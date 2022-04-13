export const state = () => ({
  user: null,
  jwt: null,
})

export const getters = {
  getActiveUser(state) {
    return state.user
  },
  getJWT(state) {
    return state.jwt
  },
}

export const actions = {
  checkAuth({ commit }){
    if (this.$strapi.user) commit('setUserData', this.$strapi.user)
    else commit('setUserData', null)
  },
  async login({ commit }, form) {
    const data = await this.$strapi.login({ identifier: form.email, password: form.password })
    commit('setUserData', data.user)
    commit('setJWT', data.jwt)
  },
  logout({ commit }) {
    this.$strapi.logout()
    commit('setUserData', null)
    commit('setJWT', null)
  },
  errorhandling({commit},error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("error data:",error.response.data);
      console.log("error status:",error.response.status);
      console.log("error headers:",error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log("error request:",error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log("error config:",error.config);
  }
}

export const mutations = {
  setUserData(state, user) {
    state.user = user
  },
  setJWT(state, jwt) {
    state.jwt = jwt
  }
}