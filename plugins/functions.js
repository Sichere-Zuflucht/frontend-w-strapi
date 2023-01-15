export default ({ app }, inject) => {
  //********* Default */
  inject('console', (...data) => {
    if (app.$config.status !== 'production') console.log(...data)
  })

  inject('newCoachEmail', (data) => {
    return app.$axios.$post(app.$config.strapi.url + "/newcoachemail", {
      headers: {
        Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
      },
      body: data,
    }).catch((e) => {
      app.store.dispatch("errorhandling", e);
    });
  })


  //********* Stripe */
  inject('loginStripeAccLink', () => {
    return app.$axios
      .get(app.$config.strapi.url + "/stripeloginlink?acc=" + app.store.getters["getActiveUser"].stripe.id, {
        headers: {
          Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
        },
      }).catch((e) => {
        app.store.dispatch("errorhandling", e);
      });
  })

  inject('createStripeAcc', () => {
    //return console.log('data', location, localStorage.getItem("strapi_jwt"))
    return app.$axios
      .get(
        app.$config.strapi.url +
        "/createstripe?email=" +
        app.store.getters["getActiveUser"].email +
        "&url=" +
        location.origin,
        {
          headers: {
            Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
          },
        }
      )
      .then((body) => {
        return app.$strapi.$users
          .update(app.$strapi.user.id, {
            stripe: {
              payouts_enabled: false, //why is it false here??? shouldn't it be true?
              id: body.data.stripeId,
            },
          })
          .then((r) => {
            if (
              confirm(
                "Sichere Zuflucht möchte Sie weiterleiten zu: " +
                body.data.url
              )
            ) {
              location.replace(body.data.url);
            }

            return {
              url: body.data.url,
            }
          })
          .catch((e) => {
            app.store.dispatch("errorhandling", e);
          });
      });
  })

  inject('deleteStripeAcc', () => {
    app.$axios
      .get(
        `${app.$config.strapi.url}/deletestripeacc?acc=${app.$strapi.user.stripe.id}`,
        {
          headers: {
            Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
          },
        }
      ).catch((e) => {
        app.store.dispatch("errorhandling", e);
      });
  })

  inject('stripePayment', (stripeId, coachId) => {
    return app.$axios
      .$get(
        `${app.$config.strapi.url}/paywithstripe?id=${stripeId}&coachStripeId=${coachId}&url=${location.origin}`,
        {
          headers: {
            Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
          },
        }
      ).catch((e) => {
        app.store.dispatch("errorhandling", e);
      });
  })

  inject('getStripeAccData', () => {
    return app.$axios
      .get(
        app.$config.strapi.url +
        "/retrievestripe?email=" +
        app.store.getters["getActiveUser"].stripe.id,
        {
          headers: {
            Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
          },
        }
      ).catch((e) => {
        app.store.dispatch("errorhandling", e);
      });
  })

  inject('getStripePaymentSession', (sessionID) => {
    return app.$axios
      .$get(
        app.$config.strapi.url +
        "/retrievestripepaysession?paymentID=" +
        sessionID,
        {
          headers: {
            Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
          },
        }
      ).catch((e) => {
        app.store.dispatch("errorhandling", e);
      });
  })


  //********* Meeting */
  inject('deleteMeeting', (email, id, acceptedDate) => {
    return app.$axios
      .get(
        `${app.$config.strapi.url}/deletemeeting?email=${email}&id=${id}&acceptedDate=${acceptedDate}`,
        {
          headers: {
            Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
          },
        }
      ).catch((e) => {
        app.store.dispatch("errorhandling", e);
      });
  })

  inject('getVideoMeeting', (video) => {
    return app.$axios
      .$get(
        `${app.$config.strapi.url}/getvideomeeting?video=${video}`,
        {
          headers: {
            Authorization: "Bearer "+ JSON.parse(localStorage.getItem("strapi_jwt")).token
          },
        }
      ).catch((e) => {
        app.store.dispatch("errorhandling", e);
      });
  })

}