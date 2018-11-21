(function newProjectComponent() {
  const DOMHomeContainer = document.querySelector('[data-home]');
  const markUpHome = `
                  <h1 class="logo">Everyday</h1>
                  <ul class="project-list">
                      <li class="project-item">
                          <span class="project-item__text">project</span>
                          <h2 data-project-title class="project-item__name">Macieira no quintal</h2>
                          <ul class="project-images">
                              <li class="project-images__item">
                                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYU1s9SJjAZXdwkVtSY5heHy7KhBDu8Yf5K38kdrT6bgq5ULe" alt=""  class="project-images__image">
                              </li>
                              <li class="project-images__item">
                                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYU1s9SJjAZXdwkVtSY5heHy7KhBDu8Yf5K38kdrT6bgq5ULe" alt=""  class="project-images__image">
                              </li>
                              <li class="project-images__item">
                                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYU1s9SJjAZXdwkVtSY5heHy7KhBDu8Yf5K38kdrT6bgq5ULe" alt=""  class="project-images__image">
                              </li>
                          </ul>
                      </li>
                  </ul>
                  <ul class="step-counter">
                      <li class="step-counter__step step-counter__step--active"></li>
                      <li class="step-counter__step"></li>
                      <li class="step-counter__step"></li>
                  </ul>
                  <div class="bottom-bar">
                      <button type="button" name="button" class="bottom-bar__button">Play Project</button>
                      <label class="bottom-bar__button">
                        Add Photo
                        <input data-add-photo type="file" accept="image/*">
                      </label>
                  </div>
                 `;

   const markUpHome2 = `
                   <h1 class="logo">Everyday</h1>
                   <ul class="project-list">
                       <li class="project-item">
                           <span class="project-item__text">new project</span>
                           <h2 class="project-item__name">Start a new project</h2>
                           <button data-new-project-button class="project-item__button">
                            <img src="img/new-project.png" alt="new project button icon">
                           </button>
                       </li>
                   </ul>
                   <ul class="step-counter">
                       <li class="step-counter__step step-counter__step--active"></li>
                       <li class="step-counter__step"></li>
                       <li class="step-counter__step"></li>
                   </ul>
                   <div class="bottom-bar">
                       <button type="button" name="button" class="bottom-bar__button">Play Project</button>
                       <label class="bottom-bar__button">Add Photo<input data-add-photo type="file" accept="image/*"></label>
                   </div>
                  `;


    const getSelectedProject = () {
      return document.querySelector('[data-selected-project]');
    }

    const render = () => {
        DOMHomeContainer.innerHTML = markUpHome2;
        const DOMaddPhotoInput = document.querySelector('[data-add-photo]');

        DOMaddPhotoInput.addEventListener('change', (e) => {
          const selectedProject = getSelectedProject();

          if (!selectedProject) {
            return;
          }

          const storageService = new StorageService();
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

    window.addEventListener('load', () => { render() });
})();
