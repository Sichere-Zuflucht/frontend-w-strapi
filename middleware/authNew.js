export default function ({ redirect, store, route }) {
	if (!store.getters['getCurrentUser']) {
		window.localStorage.setItem('redirectBackTo', route.fullPath);
		redirect('/registration/signin');
	} else {
		if (
			store.getters['getCurrentUser'].usertype != 'authenticated' &&
			store.getters['getCurrentUser'].verification - status == 'done'
		) {
			redirect('/');
		}
	}
}
