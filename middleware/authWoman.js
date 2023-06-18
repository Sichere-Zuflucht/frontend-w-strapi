export default async function ({ redirect, route, $func, store }) {
	if (!store.getters['getCurrentUser']) {
		window.localStorage.setItem('redirectBackTo', route.fullPath);
		redirect('/registration/signin');
	} else {
		if (store.getters['getCurrentUser'].roleName == 'authenticated') {
			redirect('/registration/membership-selection');
		} else if (store.getters['getCurrentUser'].roleName != 'woman') {
			redirect('/beratung');
		}
	}
}
