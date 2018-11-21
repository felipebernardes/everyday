(function newProjectComponent() {
  const storageService = new StorageService();
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
                      <li class="step-counter__step"></li>
                      <li class="step-counter__step"></li>
                  </div>
                  <div class="bottom-bar">
                      <button type="button" name="button" class="bottom-bar__button">Play Project</button>
                      <label class="bottom-bar__button">
                        Add Photo
                        <input data-add-photo type="file" accept="image/*">
                      </label>
                  </div>
                 `;

    const getSelectedProject = () => {
      return document.querySelector('[data-selected-project]');
    }

    const render = () => {
        DOMHomeContainer.innerHTML = markUpHome;
        const DOMaddPhotoInput = document.querySelector('[data-add-photo]');
        const DOMaddProjectList = document.querySelector('[data-project-list]');
        const projectList = storageService.getLocalStorage().projects;
        const projectsMarkup = projectList.map(p => {
          const photosMarkup = p.photos.map(photo => {
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

        DOMaddPhotoInput.addEventListener('change', (e) => {
          const selectedProject = getSelectedProject();

          if (!selectedProject) {
            return;
          }

          const selectedProjectDatabase = storageService.getProject(selectedProject.querySelector('[data-project-title]').innerText);
          const rawPhoto = e.target.files[0];
          const fileReader = new FileReader();
          let photoObj;

          fileReader.readAsDataURL(rawPhoto);

          fileReader.onload = () => {
            photoObj = {
              dateAdded: new Date(),
              base64: fileReader.result
            }

            selectedProjectDatabase.photos.push(photoObj);
          };
        });
    }

    window.addEventListener('load', () => {
      render();

      var slider = tns({
        container: '.project-list',
        items: 1,
        //useLocalStorage: false,
        loop: false,
        controls: false
      });

      slider.events.on('transitionEnd', (info, eventName) => {
        console.log(info.navCurrentIndex);
      });
    });
})();
