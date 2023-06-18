export default async function ({ store, $func }) {
	// Access the user data from the Vuex store
	console.log('global', $func, store);
	if (localStorage.getItem('ruby_jwt')) {
		const user = await $func.me();
		store.dispatch('changeData', user);
	} else {
		store.dispatch('changeData', null);
	}
}
