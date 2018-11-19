(function newProjectComponent() {
  const DOMHomeContainer = document.querySelector('[data-home]');

  const markUpHome = `
                  <h1 class="logo">Everyday</h1>
                  <ul class="project-list">
                      <li class="project-item">
                          <span class="project-item__text">project</span>
                          <h2 class="project-item__name">Macieira no quintal</h2>
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
                      <button type="button" name="button" class="bottom-bar__button">Add Photo</button>
                  </div>
                 `;

    const render = () => {
        DOMHomeContainer.innerHTML = markUpHome;
    }

    window.addEventListener('load', () => { render() });
})();
