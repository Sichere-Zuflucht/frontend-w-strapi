export default function ({ redirect, store }) {
	if (store.getters['getCurrentUser']) {
		if (store.getters['getCurrentUser'].usertype == 'woman') {
			redirect('/frauen');
		} else if (store.getters['getCurrentUser'].usertype == 'coach') {
			redirect('/beratung');
		}
	}
}
