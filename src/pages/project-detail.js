import superglobal from '../config/superglobal';
import { onNavigate } from '../utils/function';

const projectDetail = {
	template: /* html */ `
	<h1 class="project-detail--title"></h1>
	<div class="project-detail--content">
		<div class="project-detail--image"></div>
		<div class="project-detail--description">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorem officiis tempora vero enim aperiam hic blanditiis esse aspernatur tenetur saepe molestias modi autem maxime placeat, sunt consequuntur corporis dolores? Itaque?</div>
		<div class="project-detail--links">
			<a id="project-detail--view-link" target="_blank" href="#"><i class="fas fa-eye"></i></a>
			<a id="project-detail--github-link" target="_blank" href="#"><i class="fab fa-github"></i></a>
		</div>
	</div>
	<div class="project-detail--footer">
		<div id="btn-back" class="btn-link btn-link-secondary parallelogram">
			<span class="skew-fix">Back</span>
		</div>
	</div>
    `,
	onMount: () => {
		const btnBack = document.getElementById('btn-back');
		btnBack.addEventListener('click', () => {
			onNavigate(superglobal.PROJECT);
		});
	},
};

export default projectDetail;
