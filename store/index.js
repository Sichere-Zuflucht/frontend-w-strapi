export const state = () => ({
  user: null,
  jwt: null,
})

export const getters = {
  getUser(state){
    return state.user
  },
  getJWT(state){
    return state.jwt
  },
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedInUser(state) {
    return state.auth.user;
  },
}

export const actions = {
  async login({commit}, form) {
    this.$strapi.login({ identifier: form.email, password: form.password })
    console.log(data)
    commit('setUserData', data.user)
    commit('setJWT', data.jwt)
  },
}

export const mutations = {
  setUserData(state, user) {
    state.user = user
  },
  setJWT(state, jwt) {
    state.jwt = jwt
  }
}