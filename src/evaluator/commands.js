// Copyright 2015 Interactive Computing project (https://github.com/interactivecomputing).
// All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
// except in compliance with the License. You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the
// License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific language governing permissions
// and limitations under the License.
//
// commands.js
// Implements various commands (aka line and cell magics) available within the shell.
//

var util = require('util');


// Implements the %inspect command
// This command can be used to inspect a variable, or expression within the shell.
function inspectCommand(shell, args, data, evaluationId) {
  if (args.names) {
    args.names.forEach(function(n) {
      console.log(n + ':');
      console.dir(shell.state[n]);
      console.log();
    });
  }
}
inspectCommand.options = function(parser) {
  return parser
    .help('Allows inspecting variables')
    .option('names', {
      list: true,
      position: 0,
      required: true,
      help: 'the variables to inspect'
    });
}


// Initialize the shell with tne commands defined above, so they are available for use as
// %% magics.
function initialize(shell) {
  shell.registerCommand('inspect', inspectCommand);
}


module.exports = {
  initialize: initialize
};
