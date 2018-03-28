'use strict';

module.exports = {
  name: 'ember-cli-odyssey',

  treeForAddonTestSupport(tree) {
    // intentionally not calling _super here
    // so that can have our `import`'s be
    // import { RandomWalk } from 'ember-cli-odyssey';

    const Funnel = require('broccoli-funnel');

    let namespacedTree = new Funnel(tree, {
      srcDir: '/',
      destDir: `/${this.moduleName()}`,
      annotation: `Addon#treeForTestSupport (${this.name})`,
    });

    return this.preprocessJs(namespacedTree, '/', this.name, {
      registry: this.registry,
    });
  },

  isDevelopingAddon() {
    return true;
  }
};
