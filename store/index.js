export const state = () => ({
    user: null,
    jwt: null,
  })
  export const mutations = {
    changeUser (state, user) {
      state.user = user
    },
    changeJWT (state, jwt) {
        state.jwt = jwt
      }
  }