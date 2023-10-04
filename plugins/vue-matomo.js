import Vue from 'vue';
import VueMatomo from 'vue-matomo';

Vue.use(VueMatomo, {
	host: 'https://sizu-matomo.work12.de', // Matomo server URL
	siteId: 1, // Your website's ID in Matomo
	router: true, // Enable router tracking
	trackerFileName: 'matomo', // The name of the Matomo tracker file
	debug: true, // Enable debug mode (set to true for development)
});
