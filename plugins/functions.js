let Authorization = `Bearer ${localStorage.getItem('ruby_jwt')}`;
let config = {
	headers: {
		'Content-Type': 'application/json',
		Authorization,
	},
	//data: data
};

function errorhandling(error) {
	{
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.log('error data:', error.response.data);
			console.log('error status:', error.response.status);
			console.log('error headers:', error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			console.log('error request:', error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.log('Error', error.message);
		}
		console.log('error config:', error.config);
		error.location ? console.log('location:', error.location) : null;

		``;
	}
}

export default ({ $axios, redirect, store, $cookies }, inject) => {
	inject('format', {
		date: (date) => {
			const d = new Date(date);
			return d.toLocaleDateString('de-DE', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		},
		time: (date) => {
			const d = new Date(date);
			return d.toLocaleTimeString('de-DE', {
				hour: 'numeric',
				minute: 'numeric',
			});
		},
	});
	inject('errorhandling', errorhandling);

	inject('rules', {
		email: (v) =>
			/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
			'E-Mail muss gültig sein',
		password: (v) =>
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
				v
			) || 'Ihr Passwort erfüllt nicht alle Vorgaben.',
		phone: (v) =>
			/^(?:\+\d{2}|0|00\d{2})(?:\s*\d{3}){2}\s*\d{4,10}/.test(v) ||
			'Ungültiges Format',
		obligatory: (v) => !!v || 'Bitte ausfüllen',
	});
	inject('functionalCookieAccepted', () => {
		const cookie = $cookies.get('CookieScriptConsent');
		if (!cookie) return false;
		if (cookie.categories.length == 0) return false;
		return cookie.categories.includes('functionality');
	});
	/****** API to Ruby on Rails */
	inject('func', {
		/** MEETINGS */

		womanCreatesNewMeeting: ({ message, coach_id }) => {
			const data = JSON.stringify({
				meeting: {
					message,
					woman_id: store.getters['getCurrentUser'].id,
					coach_id,
				},
			});
			return $axios.$post('meetings', data, config);
		},
		coachGivesProposals: async ({ video_type, time_proposals, meeting_id }) => {
			try {
				const data = JSON.stringify({
					meeting: {
						video_type,
						time_proposals,
					},
				});
				return await $axios.$put(`meetings/${meeting_id}`, data, config);
			} catch (err) {
				throw err;
			}
		},
		womanSelectsProposalAndPays: async ({
			selected_time_index,
			meeting_id,
		}) => {
			try {
				const data = JSON.stringify({
					meeting: {
						selected_time_index,
					},
				});
				const meeting = await $axios.$put(
					`meetings/${meeting_id}/start_payment_session`,
					data,
					config
				);
				return meeting.data.attributes.payment_url;
			} catch (err) {
				errorhandling(err);
			}
		},
		womanParticipatesMeetingAndCapturesPayment: async ({ meeting_id }) => {
			try {
				const data = JSON.stringify({});
				const meeting = await $axios.$put(
					`meetings/${meeting_id}/capture_payment`,
					data,
					config
				);
				return {
					meeting,
				};
			} catch (err) {
				errorhandling(err);
				return err;
			}
		},

		archiveMeeting: (meeting_id) => {
			return $axios.$put(`meetings/${meeting_id}/archive`, {}, config);
		},
		loadAllMeetingsOfParticipant: async () => {
			return (
				await $axios.$get('meetings', {
					headers: {
						Authorization,
					},
				})
			).data;
		},

		/** COACHES */
		loadCurrentCoachData: () => {
			return $axios.$get('users/me', {
				headers: {
					Authorization,
				},
			});
		},
		/*updateCurrentCoachProfil: ({
			avatar,
			display_name,
			topic_areas,
			personal_background,
			citation,
			professional_background,
			profession_line,
		}) => {
			const data = {
				user: {
					avatar,
					display_name,
					topic_areas, // topic
					personal_background, //description
					citation, //quote
					professional_background, //history
					profession_line, //profession
				},
			};

			return $axios.$put('users/me', {
				headers: {
					Authorization,
				},
				body: JSON.stringify(data),
			});
		},*/
		loadAllCoaches: async () => {
			return (await $axios.$get('users/coaches')).data;
		},
		loadSingleCoach: async (slug) => {
			return (await $axios.$get(`users/coach_by_slug/${slug}`)).data;
		},

		/** STRIPE */
		/*getStripeAccData: () => {
			return $axios.$get('stripe-account').catch((e) => {
				errorhandling(e);
			});
		},*/
		createStripeAcc: async () => {
			try {
				const createAccUrl = await $axios.$get(
					'users/coach_create_stripe_account',
					config
				);
				location.href = createAccUrl.account_form_url;
				return createAccUrl.account_form_url;
			} catch (err) {
				errorhandling(err);
			}
		},
		loginStripeAccLink: async () => {
			try {
				const loginData = await $axios.$get(
					'users/coach_login_stripe_account',
					config
				);
				return loginData.url;
			} catch (err) {
				errorhandling(err);
			}
		},

		/** AUTH + CURRENT USER*/
		me: async () => {
			try {
				const me = await $axios.$get('users/me', {
					headers: {
						Authorization,
					},
				});
				return {
					id: me.data.id,
					...me.data.attributes,
				};
			} catch {
				localStorage.removeItem('ruby_jwt');
			}
		},
		updateMe: async (user) => {
			try {
				let data = JSON.stringify({
					user: {
						...user,
					},
				});
				await $axios.$put('users/me', data, config);
			} catch (err) {
				throw err;
			}
		},
		archiveMe: async () => {
			try {
				const data = {};
				await $axios.$post('users/me/delete', data, config);
				localStorage.removeItem('ruby_jwt');
				store.dispatch('changeData', null);
			} catch (err) {
				console.log('err', errorhandling(err));
				throw err;
			}
		},
		updateAvatar: async (blob) => {
			try {
				var file = new File(
					[blob],
					'profilimage.' + blob.type.replace('image/', ''),
					{
						type: blob.type,
					}
				);
				console.log('File Upload', file, typeof file);
				let form = new FormData();
				form.append('user[avatar]', file);
				const { data } = await $axios.$post('users/avatar', form, config);
				return data.attributes.avatar_content_url;
			} catch (err) {
				throw err;
			}
		},
		register: async ({ usertype, email, password }) => {
			try {
				const data = JSON.stringify({
					user: {
						usertype,
						email,
						password,
					},
				});
				const register = await $axios.$post(
					'authentication/register',
					data,
					config
				);
				return register;
			} catch (err) {
				err.location = 'register';
				console.log('err', errorhandling(err));

				var msg = '';
				if (err.response.data.errors)
					msg = err.response.data.errors[0].includes('Invalid email')
						? 'Ungültige E-Mail-Adresse oder ungültiges Passwort'
						: err.response.data.errors[0];
				else msg = err.response.data.message;
				throw msg;
			}
		},
		login: async ({ email, password }) => {
			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 7);

			const input = JSON.stringify({
				email: email.toLowerCase(),
				password,
			});

			try {
				const data = await $axios.$post(`authentication`, input, config);
				store.dispatch('changeData', data.user.attributes);

				localStorage.setItem('ruby_jwt', data.token);

				const route = window.localStorage.getItem('redirectBackTo')
					? window.localStorage.getItem('redirectBackTo')
					: data.user.usertype == 'coach'
					? '/beratung'
					: '/frauen';

				console.log('route', route);
				window.localStorage.removeItem('redirectBackTo');
				location.href = route;
			} catch (err) {
				err.location = 'login';
				console.log('err', errorhandling(err));

				var msg = '';
				if (err.response.data.errors)
					msg = err.response.data.errors[0].includes('Invalid email')
						? 'Ungültige E-Mail-Adresse oder ungültiges Passwort'
						: err.response.data.errors[0];
				else msg = err.response.data.message;
				throw msg;
			}
		},
		logout: () => {
			localStorage.removeItem('ruby_jwt');
			store.dispatch('changeData', null);
			location.href = 'registration/signin';
		},
		forgotPassword: async ({ email }) => {
			var send_to_email = email;
			if (store.getters['getCurrentUser'])
				send_to_email = store.getters['getCurrentUser'].email;
			try {
				const data = JSON.stringify({
					user: {
						email: send_to_email,
					},
				});
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};
				const sendPasswordForgot = await $axios.$post(
					'authentication/forgot_password',
					data,
					config
				);
				return sendPasswordForgot;
			} catch (err) {
				return err;
			}
		},
		resetPassword: async ({ token, password, password_confirmation }) => {
			try {
				const resetPassword = await $axios.$post(
					`authentication/reset_password?token=${token}&password=${encodeURIComponent(
						password
					)}&password_confirmation=${encodeURIComponent(password_confirmation)}`
				);
				return resetPassword;
			} catch (err) {
				throw err;
			}
		},
		/** MAGAZINE */
		loadAllArticles: async () => {
			try {
				return (
					await $axios.$get('/articles')
				).data;
			} catch (err) {
				errorhandling(err);
				return null;
			}
		},
		loadSingleArticle: async (article_slug) => {
			try {
				const article = await $axios.$get(
					`https://sizu-content.work12.de/article/${article_slug}.json`
				);
				const cover_url = `https://sizu-content.work12.de/article/${article_slug}/${article.cover.url
					.split('/')
					.pop()}`;
				article.cover.url = cover_url;
				return article;
			} catch (err) {
				errorhandling(err);
				return null;
			}
		},
		loadRelatedArticles: async (article_id) => {
			try {
				const allArticles = (
					await $axios.$get('/articles')
				).data;

				const max = allArticles.length;
				var numbers = [];
				const relatedArticles = [];

				while (numbers.length < 3) {
					var randomNumber = Math.floor(Math.random() * max);
					console.log(
						'randomNumber',
						allArticles[randomNumber].id,
						article_id,
						randomNumber
					);
					if (
						!numbers.includes(randomNumber) &&
						allArticles[randomNumber].id !== article_id
					) {
						numbers.push(randomNumber);
						relatedArticles.push(allArticles[randomNumber]);
					}
				}

				return relatedArticles;
			} catch (err) {
				errorhandling(err);
				return null;
			}
		},
	});

	/**
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 */

	//********* Default */
	/*inject('console', (...data) => {
		if (app.$config.status !== 'production') console.log(...data);
	});

	inject('newCoachEmail', (data) => {
		return $axios
			.$post(app.$config.strapi.url + '/newcoachemail', {
				headers: {
					Authorization,
				},
				body: data,
			})
			.then(() => {
				if (app.$config.status != 'production') return;
				const { tel, altEmail, www, name } = data;
				const slack = {
					text: `*Neue Anmeldung* :rocket: 

Die Person *${name}* möchte über unsere Plattform Beratung anbieten. <@U01F8C7HESU> wird den Kontakt aufnehmen. 

*Weitere Details:*
${tel ? '- :telephone_receiver: : ' + tel : ''}
${altEmail ? '- :email: : ' + altEmail : ''}
${www ? '- :globe_with_meridians: : ' + www : ''}`,
				};

				fetch(app.$config.slackUrl, {
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					mode: 'cors', // no-cors, *cors, same-origin
					cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
					credentials: 'same-origin', // include, *same-origin, omit
					redirect: 'follow', // manual, *follow, error
					referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
					body: JSON.stringify(slack), // body data type must match "Content-Type" header
				}).catch((err) => {
					console.log('error slack', err);
				});
			})
			.catch((e) => {
				errorhandling(e);
			});
	});

	//********* Stripe 
	inject('loginStripeAccLink', () => {
		return $axios
			.get(
				app.$config.strapi.url +
					'/stripeloginlink?acc=' +
					app.store.getters['getCurrentUser'].stripeID,
				{
					headers: {
						Authorization,
					},
				}
			)
			.catch((e) => {
				errorhandling(e);
			});
	});

	inject('createStripeAcc', () => {
		return $axios
			.get(
				app.$config.strapi.url +
					'/createstripe?email=' +
					app.store.getters['getCurrentUser'].email +
					'&url=' +
					location.origin,
				{
					headers: {
						Authorization,
					},
				}
			)
			.then((body) => {
				return app.$strapi.$users
					.update(app.$strapi.user.id, {
						stripeID: body.data.stripeId,
					})
					.then((r) => {
						if (
							confirm(
								'Sichere Zuflucht möchte Sie weiterleiten zu: ' + body.data.url
							)
						) {
							location.replace(body.data.url);
						}

						return {
							url: body.data.url,
						};
					})
					.catch((e) => {
						errorhandling(e);
					});
			});
	});

	inject('deleteStripeAcc', () => {
		return $axios
			.get(
				`${app.$config.strapi.url}/deletestripeacc?acc=${app.$strapi.user.stripeID}`,
				{
					headers: {
						Authorization,
					},
				}
			)
			.catch((e) => {
				errorhandling(e);
			});
	});

	inject('retrieveStripePaymentSetup', (checkoutSession) => {
		return $axios
			.get(
				`${app.$config.strapi.url}/retrievestripepaymentsetup?checkoutSession=${checkoutSession}`,
				{
					headers: {
						Authorization,
					},
				}
			)
			.catch((e) => {
				const err = {
					...e,
					location: 'functions.js retrieveStripePaymentSetup',
				};
				errorhandling(err);
			});
	});
	// not in use... maybe it will be needed once ?!
	inject('stopStripePaymentSetup', (checkoutSession) => {
		return $axios
			.get(
				`${app.$config.strapi.url}/stopstripepaymentsetup?checkoutSession=${checkoutSession}`,
				{
					headers: {
						Authorization,
					},
				}
			)
			.catch((e) => {
				const err = {
					...e,
					location: 'functions.js stopStripePaymentSetup',
				};
				errorhandling(err);
			});
	});

	//old -> a new version above is creating a delayed charge
	inject('stripePayment', (coachStripeId, meetingID) => {
		const user = app.store.getters['getCurrentUser'];
		return $axios
			.$get(
				`${app.$config.strapi.url}/paywithstripe?coachStripeId=${coachStripeId}&name=${user.username}&email=${user.email}&url=${location.origin}&meetingID=${meetingID}`,
				{
					headers: {
						Authorization,
					},
				}
			)
			.catch((e) => {
				errorhandling(e);
			});
	});

	inject('getStripeAccData', () => {
		return $axios
			.get(
				app.$config.strapi.url +
					'/retrievestripe?stripeID=' +
					app.store.getters['getCurrentUser'].stripeID,
				{
					headers: {
						Authorization,
					},
				}
			)
			.catch((e) => {
				errorhandling(e);
			});
	});

	inject('getStripePaymentSession', (sessionID) => {
		if (sessionID) {
			return $axios
				.$get(
					`${app.$config.strapi.url}/retrievestripepaysession?paymentID=${sessionID}`,
					{
						headers: {
							Authorization,
						},
					}
				)
				.catch((e) => {
					errorhandling(e);
				});
		}
		return {
			status: false,
		};
	});

	//********* Meeting 
	inject('deleteMeeting', (email, id, acceptedDate, paymentID) => {
		return $axios
			.get(
				`${app.$config.strapi.url}/deletemeeting?email=${email}&id=${id}&acceptedDate=${acceptedDate}`,
				{
					headers: {
						Authorization,
					},
				}
			)
			.then(() => {
				this.$stopStripePaymentSetup(paymentID);
			})
			.catch((e) => {
				const err = {
					...e,
					location: 'functions.js deleteMeeting',
				};
				errorhandling(err);
			});
	});

	inject('getVideoMeeting', (video) => {
		return $axios
			.$get(`${app.$config.strapi.url}/getvideomeeting?video=${video}`, {
				headers: {
					Authorization,
				},
			})
			.catch((e) => {
				errorhandling(e);
			});
	});

	inject('functionalCookieAccepted', () => {
		const cookie = app.$cookies.get('CookieScriptConsent');
		if (!cookie) return false;
		if (cookie.categories.length == 0) return false;
		return cookie.categories.includes('functionality');
	});

	inject('meetingConfirmationEmail', (data) => {
		return $axios
			.post(`${app.$config.strapi.url}/meetingConfirmationEmail`, {
				headers: {
					Authorization,
				},
				body: data,
			})
			.catch((err) => {
				console.log('error', err);
			});
	});*/
};
