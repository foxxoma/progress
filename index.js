const progressBar = {
	points: 0,
	steps: [],
	progressBarDom: false,
	progressBarClass: '_progressBar',
	stepWrapperClass: 'progressStepWrapper',
	stepSignClass: 'progressStepSign',
	stepSignWrapperClass: 'progressStepSignWrapper',
	stepClass: 'progressStep',
	stepFunctionalClass: '_progressStep',

	/* step[{min:int, max:int}] */
	init(min = 0, max = 100, steps = false, points = 0, setStepClass = false) {
		if (!steps) { 
			this.steps.push({min,max});
		} else {
			this.steps = steps;
		}

		if (points) { 
			this.points = points;
		}

		if (setStepClass) {
			this.setStepClass(setStepClass);
		}

		this.progressBarDom = document.querySelector('.' + this.progressBarClass);

		if (!this.progressBarDom) {
			return false;
		}

		this.build();
	},
	setStepClass(stepClass) {
		this.stepClass = stepClass;
	},
	setPoints(points) {
		this.points = points;
		this.stepsRendering();
	},
	build() {
		for (let step = 0; step < this.steps.length; step++)
		{
			let stepWrapper = document.createElement('div');
			stepWrapper.classList.add(this.stepWrapperClass);

			let stepDom = document.createElement('div');
			stepDom.classList.add(this.stepClass, this.stepFunctionalClass);
			stepDom.dataset.step = step;

			stepWrapper.appendChild(stepDom);
			this.addSign(step, stepWrapper)
			this.progressBarDom.appendChild(stepWrapper);

			this.stepRendering(step, stepDom);
		}
	},
	addSign(step, stepWrapper)
	{
		let stepSignWrapper = document.createElement('div');
		stepSignWrapper.classList.add(this.stepSignWrapperClass);

		let stepSignMin = document.createElement('span');
		stepSignMin.classList.add(this.stepSignClass);
		stepSignMin.textContent = this.steps[step].min;
		let stepSignMax = document.createElement('span');
		stepSignMax.classList.add(this.stepSignClass);
		stepSignMax.textContent = this.steps[step].max;

		stepSignWrapper.appendChild(stepSignMin);
		stepSignWrapper.appendChild(stepSignMax);

		stepWrapper.appendChild(stepSignWrapper);
	},
	stepRendering(step, dom = false) {
		let stepDom = false;
		let proc = 0;

		if (dom) {
			stepDom = dom;
		}
		else {
			stepDom = document.querySelector('.' + this.stepFunctionalClass + '[data-step="'+ step +'"]');
		}

		if (this.points >= this.steps[step].max) {
			proc = 100;
		}
		else if(this.points >= this.steps[step].min) {
			const allStepPoints = this.steps[step].max - this.steps[step].min;
			const stepPoints = this.points - this.steps[step].min;

			proc = stepPoints/(allStepPoints/100);
		}
		stepDom.style.width = proc + '%';
	},
	stepsRendering(step) {
		for (step in this.steps)
			this.stepRendering(step);
	},
}

let dubugJsondb = '{"points":130,"steps":[{"min":0,"max":100},{"min":200,"max":400},{"min":400,"max":1600},{"min":1600,"max":5000}]}';

const dubug = {
	init()
	{
		let data = dubugApi.getProgress();
		console.log(data);
		document.querySelector('.points').value = data.points;
		document.querySelector('.start').remove();
		progressBar.init(0, 0, data.steps , data.points);
	},
	setPoints(points)
	{
		if (dubugApi.setPoints(points))
			progressBar.setPoints(points);
	}
}

const dubugApi = {
	getProgress() {
		const response = this.getAjax();
		if (response.status != 'success') {
			return false;
		}

		return JSON.parse(response.data);
	},
	setPoints(points) {
		const response = this.setPintsAjax(points);
		if (response.status != 'success') {
			return false;
		}

		return true;
	},
	getAjax() {
		return {data: dubugJsondb, status: 'success'};
	},
	setPintsAjax(points) {
		let data = JSON.parse(dubugJsondb)
		data.points = points;
		dubugJsondb = JSON.stringify(data)

		return {status: 'success'};
	}
}