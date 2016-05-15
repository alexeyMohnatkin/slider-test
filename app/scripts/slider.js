export default class Slider {
	constructor(options) {

		this.options = {
			root: options.root,
			slideSelector: options.slidetSelector || '.slide',
			startSlide: options.startSlide || 0,
			delay: options.delay || 4000,
			speed: options.speed || 1000,
			auto: options.auto || false
		}

		this.sliderRoot = document.querySelector(this.options.root);

		// get number of slides
		this.slidesLength = this.sliderRoot.querySelectorAll(this.options.slideSelector).length;
		// get slide elements
		this.slides = this.sliderRoot.querySelectorAll(this.options.slideSelector);
		// get slide width
		this.slideWidth = 100/this.slidesLength;
		// set first slide
		this.currentSlide = this.options.startSlide;

		// init slider
		document.addEventListener("DOMContentLoaded", this.init.bind(this));

	}

	init() {
		// set slider width
		this.sliderRoot.style.width = this.slidesLength*100+'%';

		[].forEach.call(this.slides, (slide, index) => {
			slide.style.width = this.slideWidth+'%';
			slide.style.visibility = 'hidden';
			slide.style.left = '-'+(this.slideWidth * index)+'%';
		});

		// show first slide
		this.addClass(this.slides[this.options.startSlide], 'active');
		this.slides[this.options.startSlide].style.visibility = 'visible';


		// set interval
		if(this.options.auto === true) {
			this.sliderInterval = setInterval(this.showNext.bind(this), this.options.delay);
		}
	}

	showSlide(num) {

		this.slides[num].style.visibility = 'visible';
		this.fadeOut(this.slides[this.currentSlide], this.options.speed, () => {
			this.addClass(this.slides[num], 'active');
			this.removeClass(this.slides[this.currentSlide], 'active');
			this.slides[this.currentSlide].style.opacity = 1;
			this.slides[this.currentSlide].style.visibility = 'hidden';
			this.currentSlide = num;
		});


	}

	showNext() {
		this.showSlide(this.getNext(this.currentSlide));
	}

	getNext(num) {
		console.log(num);
		return num < this.slidesLength-1 ? num + 1 : 0;
	}
	getPrev(num) {
		return num > 0 ? num - 1 : this.slidesLength-1;
	}




	addClass(el, className) {
		if (el.classList)
			el.classList.add(className);
		else
			el.className += ' ' + className;
	}

	removeClass(el, className) {
		if (el.classList)
			el.classList.remove(className);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}



	animate(draw, duration) {
		let start = performance.now();

		requestAnimationFrame(function animate(time) {
			// определить, сколько прошло времени с начала анимации
			let timePassed = time - start;

			// возможно небольшое превышение времени, в этом случае зафиксировать конец
			if (timePassed > duration) timePassed = duration;

			// нарисовать состояние анимации в момент timePassed
			draw(timePassed);

			// если время анимации не закончилось - запланировать ещё кадр
			if (timePassed < duration) {
				requestAnimationFrame(animate);
			}

		});
	}

	fadeIn(el, duration, callback) {
		this.animate((timePassed) => {
			el.style.opacity = timePassed / duration;

			if(timePassed >= duration) {
				callback.call(this);
			}

		}, duration);
	}

	fadeOut(el, duration, callback) {
		this.animate((timePassed) => {
			el.style.opacity = 1 - (timePassed / duration);

			if(timePassed >= duration) {
				callback.call(this);
			}

		}, duration);
	}


}
