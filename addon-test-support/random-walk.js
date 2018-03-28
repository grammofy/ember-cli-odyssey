/**
 * Gets a random element from `array`.
 *
 * @param {Array} array The array to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * sample([1, 2, 3, 4])
 * // => 2
 */
function sample(array) {
  const length = array == null ? 0 : array.length
  return length ? array[Math.floor(Math.random() * length)] : undefined
}

/**
 * Allows setting up a random walk by adding custom test steps.
 */
class RandomWalk {
  constructor(test, assert) {
    this.test = test;
    this.assert = assert;
    this.steps = [];
    this.consistencyChecks = [];
  }

  addStep(name, options) {
    options.name = name;

    if (!options.weight) {
      options.weight = 1.0;
    }

    if (typeof options.isApplicable != 'function') {
      options.isApplicable = () => true;
    }

    this.steps.forEach((step) => {
      if (step.name == options.name) {
        throw `There is already a step called {options.name}.`;
      }
    });

    this.steps.pushObject(options);
  }

  async doSteps(count) {
    if (this.history === undefined) {
      this.history = [];
    }

    for (let i = 0; i < count; i++) {
      await this.doRandomStep();
    }
  }

  async doRandomStep() {
    const possibleSteps = this.steps.filter(step => step.isApplicable());

    if (!possibleSteps.length) {
      throw 'No possible steps found!';
    }

    const nextStep = sample(possibleSteps);
    await this.doStep(nextStep);
  }

  async doStep(step, params) {
    if (!params) {
      params = {};
    }

    this.history.pushObject({ step, params});
    await step.execute(this.assert, params);
  }

  async execute(name, params) {
    const steps = this.steps.filter(step => step.name === name);

    if (steps.length === 0) {
      throw `No step with name '${name}' found!`;
    }

    const step = steps[0];
    await this.doStep(step, params);
  }

  async repeatFromHistory(history) {
    this.setup();

    history.forEach(async (entry) => {
      const { step, params } = entry;
      await this.doStep(step, params);
    });
  }

  setup() {
    this.history = [];
  }
}

export default RandomWalk;
