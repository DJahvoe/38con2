import superglobal from './config/superglobal.js';
import { onNavigate } from './utils/function.js';
import routes from './config/routes.js';

// Listening Event for Apps
const routing = document.getElementById('routes');
window.addEventListener('ChangeSceneApp', (e) => {
	// console.log(routing.querySelector(`[data-route]`);
	[...routing.querySelectorAll(`[data-route]`)].forEach((route) => {
		route.classList.remove('btn-link-active');
	});
	switch (e.detail) {
		case superglobal.HOME:
			routing.style.display = 'none';
			break;
		case superglobal.PROJECT:
			routing.style.display = 'block';
			routing
				.querySelector(`[data-route='${superglobal.PROJECT}']`)
				.classList.add('btn-link-active');
			break;
		case superglobal.ABOUT:
			routing.style.display = 'block';
			routing
				.querySelector(`[data-route='${superglobal.ABOUT}']`)
				.classList.add('btn-link-active');
			break;
		case superglobal.PROJECT_DETAIL:
			routing.style.display = 'block';
			routing
				.querySelector(`[data-route='${superglobal.PROJECT}']`)
				.classList.add('btn-link-active');
			break;
	}
});

// Hooks
const appDiv = document.getElementById('app');

window.addEventListener('popstate', (e) => {
	appDiv.innerHTML = routes['/' + window.location.hash].template;
});

// Link
const dataRoutes = [...document.querySelectorAll('[data-route]')];
dataRoutes.forEach((routing) => {
	routing.addEventListener('click', () => {
		onNavigate(routing.dataset.route);
	});
});

// Go to entered link
onNavigate('/' + window.location.hash);
