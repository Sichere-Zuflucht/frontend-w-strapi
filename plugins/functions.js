const Authorization = `Bearer ${localStorage.getItem('ruby_jwt')}`;
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
		error.location ? console.log('location', error.location) : null;

		``;
	}
}

export default ({ $axios, redirect, store }, inject) => {
	inject('errorhandling', errorhandling);

	inject('rules', {
		email: (v) =>
			/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
			'E-Mail muss gültig sein',
	});
	/****** API to Ruby on Rails */
	inject('func', {
		/** MEETINGS */
		womanSelectsProposalAndPays: ({ selected_time_index, meeting_id }) => {
			// change Ruby Route, so that the payment id is happening in the backend!

			const data = {
				meeting: {
					selected_time_index,
				},
			};

			return $axios.$put(`meetings/${meeting_id}`, {
				headers: {
					Authorization,
				},
				body: JSON.stringify(data),
			});
		},
		womanCreatesNewMeeting: ({ message, woman_id, coach_id }) => {
			const data = {
				meeting: {
					message,
					woman_id,
					coach_id,
				},
			};

			return $axios.$post('meetings', {
				headers: {
					Authorization,
				},
				body: JSON.stringify(data),
			});
		},

		coachGivesProposals: ({ video_type, time_proposals, meeting_id }) => {
			const data = {
				meeting: {
					video_type,
					time_proposals,
				},
			};

			return $axios.$put(`meetings/${meeting_id}`, {
				headers: {
					Authorization,
				},
				body: JSON.stringify(data),
			});
		},
		archiveMeeting: ({ meeting_id }) => {
			return $axios.$put(`meetings/${meeting_id}/archive`, {
				headers: {
					Authorization,
				},
			});
		},
		loadAllMeetingsOfParticipant: () => {
			return $axios.$get('meetings', {
				headers: {
					Authorization,
				},
			});
		},

		/** COACHES */
		loadCurrentCoachData: () => {
			return $axios.$get('users/me', {
				headers: {
					Authorization,
				},
			});
		},
		updateCurrentCoachProfil: ({
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
		},
		loadAllCoaches: () => {
			return $axios.$get('users');
		},
		loadSingleCoaches: (user_id) => {
			return $axios.$get(`users/${user_id}`);
		},

		/** STRIPE */
		/*getStripeAccData: () => {
			return $axios.$get('stripe-account').catch((e) => {
				errorhandling(e);
			});
		},*/

		/** AUTH */
		me: async () => {
			const me = await $axios.$get('users/me', {
				headers: {
					Authorization,
				},
			});
			return me.data.attributes;
		},
		register: async ({ usertype, email, password }) => {
			const data = {
				usertype,
				email,
				password,
			};

			return await $axios.$post('authentication/register', {
				headers: {
					Authorization,
				},
				body: JSON.stringify(data),
			});
		},
		login: async ({ email, password }) => {
			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 7);

			try {
				const data = await $axios.$post(
					`authentication?email=${email}&password=${password}`
				);
				//store.dispatch('changeData', data.user.attributes);

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
				console.log('err', errorhandling(err));
				const msg = err.response.data.errors[0].includes('Invalid email')
					? 'Ungültige E-Mail-Adresse oder ungültiges Passwort'
					: err.response.data.errors[0];
				throw msg;
			}
		},
		logout: () => {
			localStorage.removeItem('ruby_jwt');
			store.dispatch('changeData', null);
			location.href = 'registration/signin';
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
