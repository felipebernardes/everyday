class VideoService {
	constructor(project, DOMelement) {
		this.photos = project.photos.reverse();
		this.itemsMarkup = project.photos.map(p => {
			return `<li class="video-player__item">
								<img src="${p.base64}">
								<span>${this.formatDate(p.dateAdded)}</span>
							</li>`
		}).join('');

		this.listMarkup = `
				<button class="video-player__dismiss-button">X</button>
				<h3 class="video-player__title">${project.name}</h3>
				<ul class="video-player__list">
					${this.itemsMarkup}
				</ul>
		`;

		DOMelement.innerHTML = this.listMarkup;
		DOMelement.classList.add('active');
		const slider = tns({
			container: '.video-player__list',
			items: 1,
			loop: false,
			controls: false,
			nav: false,
			autoplay: true,
			mode: 'gallery',
  		autoplayTimeout: 1500,
			autoplayHoverPause: false
		});

		const dismissButton = DOMelement.querySelector('.video-player__dismiss-button');
		dismissButton.addEventListener('click', (e) => {
			project.photos.reverse();
			slider.destroy();
			DOMelement.classList.remove('active');
		});
	}

	formatDate(rawDate) {
		const date = new Date(rawDate);
	  const monthNames = [
	    "January", "February", "March",
	    "April", "May", "June", "July",
	    "August", "September", "October",
	    "November", "December"
	  ];
  	const day = date.getDate();
  	const month = monthNames[date.getMonth()];
  	const year = date.getFullYear();

  	return `${month} ${day} ${year}`;
	}

}
