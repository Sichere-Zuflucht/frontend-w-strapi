export default ({ app }, inject) => {
	/****** API to Ruby on Rails */
	/** MEETINGS */
	inject(
		'womanSelectsProposalAndPays',
		({ selected_time_index, meeting_id }) => {
			// change Ruby Route, so that the payment id is happening in the backend!

			const data = {
				meeting: {
					selected_time_index,
				},
			};

			return app.$axios.$put(`meetings/${meeting_id}`, {
				headers: {
					Authorization:
						'Bearer ' + JSON.parse(localStorage.getItem('ruby_jwt')).token,
				},
				body: JSON.stringify(data),
			});
		}
	);

	inject('womanCreatesNewMeeting', ({ message, woman_id, coach_id }) => {
		const data = {
			meeting: {
				message,
				woman_id,
				coach_id,
			},
		};

		return app.$axios.$post('meetings', {
			headers: {
				Authorization:
					'Bearer ' + JSON.parse(localStorage.getItem('ruby_jwt')).token,
			},
			body: JSON.stringify(data),
		});
	});

	inject(
		'coachGivesProposals',
		({ video_type, time_proposals, meeting_id }) => {
			const data = {
				meeting: {
					video_type,
					time_proposals,
				},
			};

			return app.$axios.$put(`meetings/${meeting_id}`, {
				headers: {
					Authorization:
						'Bearer ' + JSON.parse(localStorage.getItem('ruby_jwt')).token,
				},
				body: JSON.stringify(data),
			});
		}
	);

	inject('archiveMeeting', ({ meeting_id }) => {
		return app.$axios.$put(`meetings/${meeting_id}/archive`, {
			headers: {
				Authorization:
					'Bearer ' + JSON.parse(localStorage.getItem('ruby_jwt')).token,
			},
		});
	});

	inject('loadAllMeetingsOfParticipant', () => {
		return app.$axios.$get('meetings', {
			headers: {
				Authorization:
					'Bearer ' + JSON.parse(localStorage.getItem('ruby_jwt')).token,
			},
		});
	});

	/** COACHES */
	inject('loadCurrentCoachData', () => {
		return app.$axios.$get('users/me', {
			headers: {
				Authorization:
					'Bearer ' + JSON.parse(localStorage.getItem('ruby_jwt')).token,
			},
		});
	});

	inject(
		'updateCurrentCoachProfil',
		({
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

			return app.$axios.$put('users/me', {
				headers: {
					Authorization:
						'Bearer ' + JSON.parse(localStorage.getItem('ruby_jwt')).token,
				},
				body: JSON.stringify(data),
			});
		}
	);

	inject('loadAllCoaches', () => {
		return app.$axios.$get('users');
	});

	inject('loadSingleCoaches', (user_id) => {
		return app.$axios.$get(`users/${user_id}`);
	});

	/** AUTH */

	inject('loginUser', async ({ email, password }) => {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7);

		const token = (
			await app.$axios.$post(
				`authentication?email=${email}&password=${password}`
			)
		).token;

		app.$cookies.set('user-jwt', token, {
			secure: true,
			expires: expirationDate,
		});
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
	inject('console', (...data) => {
		if (app.$config.status !== 'production') console.log(...data);
	});

	inject('newCoachEmail', (data) => {
		return app.$axios
			.$post(app.$config.strapi.url + '/newcoachemail', {
				headers: {
					Authorization:
						'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
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
				app.store.dispatch('errorhandling', e);
			});
	});

	//********* Stripe */
	inject('loginStripeAccLink', () => {
		return app.$axios
			.get(
				app.$config.strapi.url +
					'/stripeloginlink?acc=' +
					app.store.getters['getActiveUser'].stripeID,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
					},
				}
			)
			.catch((e) => {
				app.store.dispatch('errorhandling', e);
			});
	});

	inject('createStripeAcc', () => {
		return app.$axios
			.get(
				app.$config.strapi.url +
					'/createstripe?email=' +
					app.store.getters['getActiveUser'].email +
					'&url=' +
					location.origin,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
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
						app.store.dispatch('errorhandling', e);
					});
			});
	});

	inject('deleteStripeAcc', () => {
		return app.$axios
			.get(
				`${app.$config.strapi.url}/deletestripeacc?acc=${app.$strapi.user.stripeID}`,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
					},
				}
			)
			.catch((e) => {
				app.store.dispatch('errorhandling', e);
			});
	});

	inject('retrieveStripePaymentSetup', (checkoutSession) => {
		return app.$axios
			.get(
				`${app.$config.strapi.url}/retrievestripepaymentsetup?checkoutSession=${checkoutSession}`,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
					},
				}
			)
			.catch((e) => {
				const err = {
					...e,
					location: 'functions.js retrieveStripePaymentSetup',
				};
				app.store.dispatch('errorhandling', err);
			});
	});
	// not in use... maybe it will be needed once ?!
	inject('stopStripePaymentSetup', (checkoutSession) => {
		return app.$axios
			.get(
				`${app.$config.strapi.url}/stopstripepaymentsetup?checkoutSession=${checkoutSession}`,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
					},
				}
			)
			.catch((e) => {
				const err = {
					...e,
					location: 'functions.js stopStripePaymentSetup',
				};
				app.store.dispatch('errorhandling', err);
			});
	});

	//old -> a new version above is creating a delayed charge
	inject('stripePayment', (coachStripeId, meetingID) => {
		const user = app.store.getters['getActiveUser'];
		return app.$axios
			.$get(
				`${app.$config.strapi.url}/paywithstripe?coachStripeId=${coachStripeId}&name=${user.username}&email=${user.email}&url=${location.origin}&meetingID=${meetingID}`,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
					},
				}
			)
			.catch((e) => {
				app.store.dispatch('errorhandling', e);
			});
	});

	inject('getStripeAccData', () => {
		return app.$axios
			.get(
				app.$config.strapi.url +
					'/retrievestripe?stripeID=' +
					app.store.getters['getActiveUser'].stripeID,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
					},
				}
			)
			.catch((e) => {
				app.store.dispatch('errorhandling', e);
			});
	});

	inject('getStripePaymentSession', (sessionID) => {
		if (sessionID) {
			return app.$axios
				.$get(
					`${app.$config.strapi.url}/retrievestripepaysession?paymentID=${sessionID}`,
					{
						headers: {
							Authorization:
								'Bearer ' +
								JSON.parse(localStorage.getItem('strapi_jwt')).token,
						},
					}
				)
				.catch((e) => {
					app.store.dispatch('errorhandling', e);
				});
		}
		return {
			status: false,
		};
	});

	//********* Meeting */
	inject('deleteMeeting', (email, id, acceptedDate, paymentID) => {
		return app.$axios
			.get(
				`${app.$config.strapi.url}/deletemeeting?email=${email}&id=${id}&acceptedDate=${acceptedDate}`,
				{
					headers: {
						Authorization:
							'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
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
				app.store.dispatch('errorhandling', err);
			});
	});

	inject('getVideoMeeting', (video) => {
		return app.$axios
			.$get(`${app.$config.strapi.url}/getvideomeeting?video=${video}`, {
				headers: {
					Authorization:
						'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
				},
			})
			.catch((e) => {
				app.store.dispatch('errorhandling', e);
			});
	});

	inject('functionalCookieAccepted', () => {
		const cookie = app.$cookies.get('CookieScriptConsent');
		if (!cookie) return false;
		if (cookie.categories.length == 0) return false;
		return cookie.categories.includes('functionality');
	});

	inject('meetingConfirmationEmail', (data) => {
		return app.$axios
			.post(`${app.$config.strapi.url}/meetingConfirmationEmail`, {
				headers: {
					Authorization:
						'Bearer ' + JSON.parse(localStorage.getItem('strapi_jwt')).token,
				},
				body: data,
			})
			.catch((err) => {
				console.log('error', err);
			});
	});
};
