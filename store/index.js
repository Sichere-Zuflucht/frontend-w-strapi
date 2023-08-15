export const state = () => ({
	user: null,
});

export const getters = {
	getCurrentUser(state) {
		return state.user;
	},
};

export const actions = {
	async checkAuth({ commit }) {
		this.$func
			.me()
			.then((userdata) => {
				console.log('user exists');
				commit('setUserData', userdata);
			})
			.catch(() => {
				console.log('no user');
				commit('setUserData', null);
			});
	},
	changeData({ commit }, newData) {
		commit('setUserData', newData);
	},
	changeAvatar({ commit }, newAvatarFile) {
		commit('setUserAvatar', newAvatarFile);
	},
};

export const mutations = {
	setUserData(state, user) {
		state.user = user;
		console.log('setUserData', state.user);
	},
	setUserAvatar(state, newAvatar) {
		state.user.avatar_content_url = newAvatar;
	},
};
