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
      }
    }

    window.addEventListener('load', () => {
        const DOMnewProjectButton = document.querySelector('[data-new-project-button]');
        DOMnewProjectButton.addEventListener('click', () => { render('step1') });
    });
})();
