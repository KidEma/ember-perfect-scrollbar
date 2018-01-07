/* jshint node: true */
'use strict';

const path = require('path');
const mergeTrees = require('broccoli-merge-trees');
const pickFiles = require('broccoli-funnel');

function findRoot(current) {
  let app = undefined;

  // Keep iterating upward until we don't have a grandparent.
  // Has to do this grandparent check because at some point we hit the project.
  do {
    app = current.app || app;
  } while (current.parent && current.parent.parent && (current = current.parent));

  return app;
}

module.exports = {
  name: 'ember-perfect-scrollbar',

  treeForVendor() {
    const treeify = name => {
      const treePath = path.dirname(require.resolve(name));
      return pickFiles(this.treeGenerator(treePath), {
        srcDir: '/',
        destDir: name
      });
    };

    return mergeTrees([
      treeify('perfect-scrollbar')
    ]);
  },

  treeForAddon(app) {
    const appRoot = findRoot(this);

    appRoot.import('vendor/perfect-scrollbar/dist/js/perfect-scrollbar.min.js');
    appRoot.import('vendor/perfect-scrollbar/dist/css/perfect-scrollbar.min.css');

    return this._super.treeForAddon.apply(this, arguments);
  }
};
