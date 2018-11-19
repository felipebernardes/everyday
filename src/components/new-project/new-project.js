(function newProjectComponent() {
  const DOMnewProjectContainer = document.querySelector('[data-new-project-section]');
  const DOMnewProjectButton = document.querySelector('[data-new-project-button]');

  const markUpStep1 = `
                    <h2>Step 1: Project Name</h2>
                    <ul>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>

                    <label>What's the name of your project?</label>
                    <input type="text" placeholder="my cool new project">

                    <p>or pick a suggestion below:</p>
                    <ul>
                      <li>- baby’s first weeks</li>
                      <li>- summer gym</li>
                      <li>- weigh gain</li>
                      <li>- 2018 vacation</li>
                    </ul>

                    <button data-new-project-step-1-button>next</button>
                 `;

   const markUpStep2 = `
                     <h2>Step 2: Project Update Frequency</h2>
                     <ul>
                       <li></li>
                       <li></li>
                       <li></li>
                     </ul>

                     <label>How often do you plan to update it?</label>
                     <label for="daily">daily</label>
                     <label for="weekly">weekly</label>
                     <label for="monthly">monthly</label>
                     <input type="radio" name="updateFrequency" value="daily" checked>
                     <input type="radio" name="updateFrequency" value="weekly">
                     <input type="radio" name="updateFrequency" value="monthly">

                     <p>we'll help you remember to update your project daily</p>

                     <button data-new-project-step-2-button>next</button>
                  `;

  const markUpStep3 = `
                    <h2>Step 3: All Set!</h2>
                    <ul>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>

                    <p>your project was created!</p>
                    <p>you can start by taking the first photo</p>

                    <button>take photo</button>

                    <button data-new-project-step-3-button>skip</button>
                 `;

    const render = (step) => {
      if (step === 'step1') {
        DOMnewProjectContainer.innerHTML = markUpStep1;
        const step1button = document.querySelector('[data-new-project-step-1-button]');
        step1button.addEventListener('click', () => {render('step2')});
      }

      if (step === 'step2') {
        DOMnewProjectContainer.innerHTML = markUpStep2;
        const step2button = document.querySelector('[data-new-project-step-2-button]');
        step2button.addEventListener('click', () => {render('step3')});
      }

      if (step === 'step3') {
        DOMnewProjectContainer.innerHTML = markUpStep3;
        const step3button = document.querySelector('[data-new-project-step-3-button]');
        step3button.addEventListener('click', () => {render('close')});
      }

      if (step === 'close') {
        DOMnewProjectContainer.innerHTML = '';
      }
    }

    DOMnewProjectButton.addEventListener('click', () => { render('step1') });
})();
