export default function ({ redirect, store, route }) {
	if (!store.getters['getCurrentUser']) {
		window.localStorage.setItem('redirectBackTo', route.fullPath);
		redirect('/registration/signin');
	} else {
		if (store.getters['getCurrentUser'].roleName != 'coach') {
			redirect('/frauen');
		}
	}
}
