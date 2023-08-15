export default function ({ redirect, store }) {
	if (store.getters['getCurrentUser']) {
		if (store.getters['getCurrentUser'].usertype == 'coach')
			redirect('/beratung');
		else redirect('/frauen');
	} else redirect('/registration/signin');
}
