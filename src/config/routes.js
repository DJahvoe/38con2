import home from '../pages/home.js';
import project from '../pages/project.js';
import about from '../pages/about.js';
import projectDetail from '../pages/project-detail.js';
import superglobal from './superglobal.js';
// Routes
const routes = {
	[superglobal.HOME]: home,
	[superglobal.PROJECT]: project,
	[superglobal.ABOUT]: about,
	[superglobal.PROJECT_DETAIL]: projectDetail,
};

export default routes;
