import superglobal from '../config/superglobal';
import { onNavigate } from '../utils/function';

const home = {
	template: /* html */ `
    <div class="home--header">
        <h1 class="home--title">S.A.V</h1>
        <h2 class="home--subtitle">Welcome to my portfolio</h2>
    </div>
    <div class="home--content">
        <div id="btn-start" class="btn-link btn-link-secondary parallelogram">
            <span class="skew-fix">Start</span>
        </div>
    </div>
    `,
	onMount: () => {
		const btnStart = document.getElementById('btn-start');
		btnStart.addEventListener('click', () => {
			onNavigate(superglobal.PROJECT);
		});
	},
};

export default home;
