const staticCache = 'everyday-static-v1';
const filesToCache = [
    '/',
    '/manifest.json',
    '/index.html',
    '/js/libs.js',
    '/js/scripts.js',
    '/css/libs.css',
    '/css/index.css',
    '/img/logo.png',
    '/img/new-project.png',
    '/img/success.png'
];

// Cache on install
this.addEventListener('install', (event) => {
    debugger;
    console.info('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(staticCache).then(cache => {
            console.info('[ServiceWorker] Caching static files');
            return cache.addAll(filesToCache);
        })
    );
});


this.addEventListener('activate', event => {
    console.info('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== staticCache) {
                    console.info('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // runs SW instantly in any existing tab previously from SW activation
    return self.clients.claim();
});

this.addEventListener('fetch', (event) => {
    console.info('[Service Worker] Fetch', event.request.url);

    event.preventDefault();
    //return cached static files
    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            console.log('cache', cacheResponse);
            return cacheResponse || fetch(event.request);
        }).catch((err) => {
          console.log('sw error', err);
        })
    );
});




class StorageService {
  constructor() {
    this.localStorage = window.localStorage;
  }

  getLocalStorage() {
    const ls = JSON.parse(window.localStorage.getItem('everyday-database'));
    return ls || { projects: []};
  }

  saveLocalStorage(ls) {
    window.localStorage.setItem('everyday-database', JSON.stringify(ls));
  }

  getProject(projectName) {
    const ls = this.getLocalStorage();
    const rawProject = ls.projects.filter(p => p.name === projectName);
    if (rawProject.length > 0) {
      return JSON.parse(rawProject);
    }
  }

  saveProject(updatedProject) {
    const project = this.getProject(updatedProject.name);
    const ls = this.getLocalStorage();

    if (project) {
      project = updatedProject;
    } else {
      ls.projects.push(updatedProject);
    }

    this.saveLocalStorage(ls);
  }
}

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

(function newProjectComponent() {
  const DOMnewProjectContainer = document.querySelector('[data-new-project-section]');
  const storageService = new StorageService();
  const projectBeingCreated = {
    name: '',
    updateFrequency: 'daily',
    dateCreated: new Date(),
    photos: []
  }

  const markUpStep1 = `
                    <button class="new-project__dismiss-button" data-new-project-dismiss-button>X</button>

                    <h2>Step 1: Project Name</h2>
                    <ul class="step-counter">
                      <li class="step-counter__step step-counter__step--active"></li>
                      <li class="step-counter__step"></li>
                      <li class="step-counter__step"></li>
                    </ul>

                    <label>What's the name of your project?</label>
                    <input type="text" placeholder="my cool new project" data-new-project-name-input>

                    <section class="suggestions">
                      <p class="suggestions__text">or pick a suggestion below:</p>
                      <ul class="suggestions__list">
                        <li class="suggestions__item" data-suggestion>- baby’s first weeks</li>
                        <li class="suggestions__item" data-suggestion>- summer gym</li>
                        <li class="suggestions__item" data-suggestion>- weight gain</li>
                        <li class="suggestions__item" data-suggestion>- 2018 vacation</li>
                      </ul>
                    <section>

                    <button class="new-project__next-button" data-new-project-step-1-button>next</button>
                 `;

   const markUpStep2 = `
                     <button class="new-project__dismiss-button" data-new-project-dismiss-button>X</button>

                     <h2>Step 2: Update Frequency</h2>
                     <ul class="step-counter">
                       <li class="step-counter__step"></li>
                       <li class="step-counter__step step-counter__step--active"></li>
                       <li class="step-counter__step"></li>
                     </ul>

                     <label>How often do you plan to update it?</label>

                     <section class="frequency">
                       <label data-frequency class="radio-label selected" for="daily">daily
                        <input type="radio" name="updateFrequency" value="daily" checked>
                       </label>
                       <label data-frequency class="radio-label" for="weekly">weekly
                        <input type="radio" name="updateFrequency" value="weekly">
                       </label>
                       <label data-frequency class="radio-label" for="monthly">monthly
                        <input type="radio" name="updateFrequency" value="monthly">
                       </label>
                     </section>

                     <p class="help-text">we'll help you remember to update your project <span class="highlight">daily</span></p>

                     <button class="new-project__next-button" data-new-project-step-2-button>next</button>
                  `;

  const markUpStep3 = `
                    <button class="new-project__dismiss-button" data-new-project-dismiss-button>X</button>

                    <h2>Step 3: All Set!</h2>
                    <ul class="step-counter">
                      <li class="step-counter__step"></li>
                      <li class="step-counter__step"></li>
                      <li class="step-counter__step step-counter__step--active"></li>
                    </ul>

                    <img src="img/success.png" alt="success icon">

                    <p class="help-text">your project was created!</p>
                    <p class="help-text">you can start by <span class="highlight">taking the first photo</span></p>

                    <label data-new-project-add-photo class="new-project__photo-button">
                      Take Photo
                      <input data-add-photo type="file" accept="image/*">
                    </label>

                    <button class="new-project__next-button" data-new-project-step-3-button>skip</button>
                 `;

    const render = (option) => {
      if (option === 'step1') {
        DOMnewProjectContainer.innerHTML = markUpStep1;
        DOMnewProjectContainer.classList.add('open');
        const step1button = document.querySelector('[data-new-project-step-1-button]');
        const dismissButton = document.querySelector('[data-new-project-dismiss-button]');
        const suggestions = document.querySelectorAll('[data-suggestion]');
        const projectNameInput = document.querySelector('[data-new-project-name-input]')

        suggestions.forEach(s => s.addEventListener ('click', () => {
          suggestions.forEach(otherSuggestion => otherSuggestion.classList.remove('selected'));
          s.classList.add('selected');
          projectNameInput.value = s.innerText.replace('-', '').trim();
        }));

        step1button.addEventListener('click', () => {
          projectBeingCreated.name = projectNameInput.value;
          render('step2');
        });
        dismissButton.addEventListener('click', () => {render('close')});
      }

      if (option === 'step2') {
        DOMnewProjectContainer.innerHTML = markUpStep2;
        const step2button = document.querySelector('[data-new-project-step-2-button]');
        const dismissButton = document.querySelector('[data-new-project-dismiss-button]');
        const frequency = document.querySelectorAll('[data-frequency]');
        const highlight = document.querySelector('.highlight');
        let selectedFrequency;

        frequency.forEach(f => f.addEventListener('click', () => {
          frequency.forEach(otherFrequency => otherFrequency.classList.remove('selected'));
          f.classList.add('selected');
          selectedFrequency = f.querySelector('input').value;
          highlight.innerText = f.querySelector('input').value;
        }));

        step2button.addEventListener('click', () => {
          projectBeingCreated.updateFrequency = selectedFrequency;
          render('step3');
        });
        dismissButton.addEventListener('click', () => {render('close')});
      }

      if (option === 'step3') {
        DOMnewProjectContainer.innerHTML = markUpStep3;
        const step3button = document.querySelector('[data-new-project-step-3-button]');
        const dismissButton = document.querySelector('[data-new-project-dismiss-button]');

        const DOMaddPhotoInput = document.querySelector('[data-new-project-add-photo]');
        DOMaddPhotoInput.addEventListener('change', (e) => {
          const rawPhoto = e.target.files[0];
          const fileReader = new FileReader();

          fileReader.readAsDataURL(rawPhoto);

          let photoObj;

          fileReader.onload = () => {
            photoObj = {
              dateAdded: new Date(),
              base64: fileReader.result
            }

            projectBeingCreated.photos[0] = photoObj;
            storageService.saveProject(projectBeingCreated);
            render('close');
          };
        });

        step3button.addEventListener('click', () => {
          storageService.saveProject(projectBeingCreated);
          render('close');
        });

        dismissButton.addEventListener('click', () => {
          storageService.saveProject(projectBeingCreated);
          render('close');
        });
      }

      if (option === 'close') {
        DOMnewProjectContainer.innerHTML = '';
        DOMnewProjectContainer.classList.remove('open');
        location.reload();
      }
    }

    window.addEventListener('load', () => {
      window.setTimeout(() => {
        const DOMnewProjectButton = document.querySelector('[data-new-project-button]');
        DOMnewProjectButton.addEventListener('click', () => { render('step1') });
      }, 100);
    });
})();

 (function newProjectComponent() {
  const storageService = new StorageService();
  const ls = storageService.getLocalStorage();
  const projectList = ls.projects;
  let selectedProject;

  const DOMHomeContainer = document.querySelector('[data-home]');
  const markUpHome = `
                  <h1 class="logo">Everyday</h1>
                  <ul data-project-list class="project-list">
                      <li class="project-item">
                          <span class="project-item__text">new project</span>
                          <h2 class="project-item__name">Start a new project</h2>
                          <button data-new-project-button class="project-item__button">
                           <img src="img/new-project.png" alt="new project button icon">
                          </button>
                      </li>
                  </ul>
                  <div class="step-counter">
                      <li class="step-counter__step step-counter__step--active"></li>
                      ${projectList.map(p => '<li class="step-counter__step"></li>').join('')}
                  </div>
                  <div class="bottom-bar">
                      <button data-play-video type="button" name="button" class="bottom-bar__button">Play Project</button>
                      <label class="bottom-bar__button">
                        Add Photo
                        <input data-add-photo type="file" accept="image/*">
                      </label>
                  </div>
                 `;

    const render = () => {
        DOMHomeContainer.innerHTML = markUpHome;
        const DOMaddPhotoInput = document.querySelector('[data-add-photo]');
        const DOMplayVideoButton = document.querySelector('[data-play-video]');
        const DOMaddProjectList = document.querySelector('[data-project-list]');
        const projectsMarkup = projectList.map(p => {
          const photosMarkup = p.photos.reverse().map((photo, idx) => {
            if (idx > 2) {
              return;
            }

            return `
            <li class="project-images__item">
                <img src="${photo.base64}" class="project-images__image">
            </li>
            `
          }).join('');

          return `
            <li class="project-item">
              <span class="project-item__text">project</span>
              <h2 data-project-title class="project-item__name">${p.name}</h2>
              <ul class="project-images">
                ${photosMarkup}
              </ul>
            </li>
          `
        }).join('');

        DOMaddProjectList.innerHTML += projectsMarkup;

        DOMplayVideoButton.addEventListener('click', (e) => {
          if (!selectedProject) {
            return;
          }
          const videoContainer = document.querySelector('[data-video-player]');
          const videoService = new VideoService(selectedProject, videoContainer);
        });

        DOMaddPhotoInput.addEventListener('change', (e) => {
          if (!selectedProject) {
            return;
          }

          const rawPhoto = e.target.files[0];
          const fileReader = new FileReader();
          let photoObj;

          fileReader.readAsDataURL(rawPhoto);

          fileReader.onload = () => {
            photoObj = {
              dateAdded: new Date(),
              base64: fileReader.result
            }

            selectedProject.photos.reverse();
            selectedProject.photos.push(photoObj);
            storageService.saveLocalStorage(ls);
            location.reload();
          };
        });
    }

    window.addEventListener('load', () => {
      render();
      const steps = document.querySelectorAll('.step-counter__step');

      var slider = tns({
        container: '.project-list',
        items: 1,
        //useLocalStorage: false,
        //"startIndex": 6,
        loop: false,
        controls: false
      });

      slider.events.on('transitionEnd', (info, eventName) => {
        steps.forEach(s => s.classList.remove('step-counter__step--active'))
        steps[info.navCurrentIndex].classList.add('step-counter__step--active');

        if (info.navCurrentIndex === 0) {
          selectedProject = null;
        }

        selectedProject = projectList[info.navCurrentIndex - 1];
      });
    });
})();
