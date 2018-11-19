(function newProjectComponent() {
  const DOMnewProjectContainer = document.querySelector('[data-new-project-section]');
  const DOMnewProjectButton = document.querySelector('[data-new-project-button]');

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
                      <p>or pick a suggestion below:</p>
                      <ul class="suggestions__list">
                        <li class="suggestions__item" data-suggestion>- baby’s first weeks</li>
                        <li class="suggestions__item" data-suggestion>- summer gym</li>
                        <li class="suggestions__item" data-suggestion>- weigh gain</li>
                        <li class="suggestions__item" data-suggestion>- 2018 vacation</li>
                      </ul>
                    <section>

                    <button class="new-project__next-button" data-new-project-step-1-button>next</button>
                 `;

   const markUpStep2 = `
                     <button class="new-project__dismiss-button" data-new-project-dismiss-button>X</button>

                     <h2>Step 2: Project Update Frequency</h2>
                     <ul class="step-counter">
                       <li class="step-counter__step"></li>
                       <li class="step-counter__step step-counter__step--active"></li>
                       <li class="step-counter__step"></li>
                     </ul>

                     <label>How often do you plan to update it?</label>
                     <label for="daily">daily</label>
                     <label for="weekly">weekly</label>
                     <label for="monthly">monthly</label>
                     <input type="radio" name="updateFrequency" value="daily" checked>
                     <input type="radio" name="updateFrequency" value="weekly">
                     <input type="radio" name="updateFrequency" value="monthly">

                     <p>we'll help you remember to update your project daily</p>

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

                    <p>your project was created!</p>
                    <p>you can start by taking the first photo</p>

                    <button class="new-project__photo-button">take photo</button>

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

        suggestions.forEach(s => s.addEventListener('click', () => {
          suggestions.forEach(otherSuggestion => otherSuggestion.classList.remove('selected'));
          s.classList.add('selected');
          projectNameInput.value = s.innerText.replace('-', '').trim();
        }));

        step1button.addEventListener('click', () => {render('step2')});
        dismissButton.addEventListener('click', () => {render('close')});
      }

      if (option === 'step2') {
        DOMnewProjectContainer.innerHTML = markUpStep2;
        const step2button = document.querySelector('[data-new-project-step-2-button]');
        const dismissButton = document.querySelector('[data-new-project-dismiss-button]');
        step2button.addEventListener('click', () => {render('step3')});
        dismissButton.addEventListener('click', () => {render('close')});
      }

      if (option === 'step3') {
        DOMnewProjectContainer.innerHTML = markUpStep3;
        const step3button = document.querySelector('[data-new-project-step-3-button]');
        const dismissButton = document.querySelector('[data-new-project-dismiss-button]');
        step3button.addEventListener('click', () => {render('close')});
        dismissButton.addEventListener('click', () => {render('close')});
      }

      if (option === 'close') {
        DOMnewProjectContainer.innerHTML = '';
        DOMnewProjectContainer.classList.remove('open');
      }
    }

    DOMnewProjectButton.addEventListener('click', () => { render('step1') });
})();
