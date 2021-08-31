import home from './pages/home.js';
import about from './pages/about.js';
import contact from './pages/contact.js';
// Routes
const routes = {
	'/': home,
	'/#contact': contact,
	'/#about': about,
};

// Hooks
const appDiv = document.getElementById('app');
appDiv.innerHTML = routes['/' + window.location.hash];
const onNavigate = (pathname) => {
	window.history.pushState({}, pathname, window.location.origin + pathname);
	appDiv.innerHTML = routes[pathname];
};
window.onpopstate = () => {
	appDiv.innerHTML = routes['/' + window.location.hash];
};

// Link
[...document.querySelectorAll('[data-route]')].forEach((routing) => {
	routing.addEventListener('click', () => {
		onNavigate(routing.dataset.route);
	});
});
