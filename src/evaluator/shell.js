// shell.js
//

var vm = require('vm');

var state = {};
var context = vm.createContext(state);

function evaluate(code) {
  return vm.runInContext(code, context);
}

function createShell() {
  return {
    evaluate: evaluate
  };
}

module.exports = {
  create: createShell
};
