import superglobal from '../config/superglobal';
import loading from '../components/loading';
import { onNavigate } from '../utils/function';

const project = {
	template: /* html */ `
	<h1 class="project--header">Scroll to Navigate</h1>
	<div class="project--images">
		<div id="project-first-image">${loading}</div>
		<div id="project-second-image">${loading}</div>
	</div>
	<div class="project--content">
		<div id="btn-detail" class="btn-link btn-link-secondary parallelogram">
			<span class="skew-fix">Details</span>
		</div>
	</div>
    `,
	onMount: () => {
		const btnDetail = document.getElementById('btn-detail');
		btnDetail.addEventListener('click', () => {
			onNavigate(superglobal.PROJECT_DETAIL);
		});
	},
};

export default project;
