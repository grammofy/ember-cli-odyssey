ember-cli-odyssey
==============================================================================

Random walks for acceptance tests.

Installation
------------------------------------------------------------------------------

```
ember install ember-cli-odyssey
```


Usage
------------------------------------------------------------------------------

In your acceptance test import `RandomWalk`:

```js
import RandomWalk from 'ember-cli-odyssey';
```

Then setup your custom steps for an odyssey through the app (The sample uses [ember-cli-page-object](https://github.com/san650/ember-cli-page-object)):

```js
import rootPage from '../../pages/root';
import loginPage from '../../pages/auth/login';
import profilePage from '../../pages/auth/profile';

test('odyssey through the app', async function (assert) {
  // define all things that are needed for the steps, e.g. email, password...

  const randomWalk = new RandomWalk(this, assert);

  randomWalk.addStep('visitRootPage', {
    isApplicable: () => currentURL() !== '/',
    async execute() {
      await rootPage.visit();
      assert.equal(currentURL(), '/', 'I can visit the root page');
  });

  randomWalk.addStep('visitLoginPage', {
    isApplicable: () => currentURL() === '/',
    async execute: () => await rootPage.clickLogin(),
  });

  randomWalk.addStep('login', {
    isApplicable: () => currentURL() === '/login',
    async execute: () => await loginPage.login(email, password),
  });

  randomWalk.addStep('visitUserProfile', {
    isApplicable: () => currentURL() !== '/login',
    async execute() {
      await profilePage.visit();
      assert.equal(currentURL(), '/profile', 'I can visit the profile page');
    },
  });

  randomWalk.addStep('editUserProfile', {
    isApplicable: () => currentURL() === '/profile',
    async execute() {
      await profilePage
        .name('Howard Hamster')
        .username('emberman')
        .submit();

      assert.equal(currentURL(), '/profile', 'After editing my profile I stay on the profile page');
      assert.equal(profilePage.name(), 'Howard Hamster', 'My name got changed');
      assert.equal(profilePage.username(), 'emberman', 'My username got changed');
    },
  });

  // Doing the random walk

  randomWalk.setup();

  // do a few deterministic steps
  await randomWalk.execute('visitLoginPage');
  await randomWalk.execute('login');

  // and then 20 random steps
  await randomWalk.doSteps(20);
});
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-cli-odyssey`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
