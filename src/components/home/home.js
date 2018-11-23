 (function newProjectComponent() {
  const storageService = new StorageService();
  const ls = storageService.getLocalStorage();
  const projectList = storageService.getLocalStorage().projects;
  let selectedProject;

  const DOMnotification = document.querySelector('.notification');
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
            selectedProject.hasRecentlyAddedPhoto = true;

            storageService.saveProject(selectedProject);
            setTimeout(() => location.reload(), 100);
          };
        });
    }

    const checkHasRecentlyAddedPhoto = () => {
      let idx;
      projectList.forEach((p, i) => {
        if (p.hasRecentlyAddedPhoto) {
          p.hasRecentlyAddedPhoto = false;
          storageService.saveProject(p);
          idx = i;
        }
      });
      return idx;
    }

    window.addEventListener('load', () => {
      render();
      const steps = document.querySelectorAll('.step-counter__step');

      var slider = tns({
        container: '.project-list',
        items: 1,
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

      const hasRecentlyAddedPhoto = checkHasRecentlyAddedPhoto();
      debugger;
      if (hasRecentlyAddedPhoto >= 0) {
        DOMnotification.classList.add('animate');
        slider.goTo(hasRecentlyAddedPhoto + 1);
      } else {
        slider.goTo(projectList.length + 1);
      }
    });
})();
