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
// custom.js
//

// RequireJS configuration to add common scripts used.
require.config({
  paths: {
    d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min',
    elem: '/static/require/element'
  }
});

// CodeCell and CodeMirror related functionality
$(function() {
  function hiddenLineFormatter(n) { return ''; }
  function stringLineFormatter(n) { return n.toString(); }

  // load CodeMirror modes
  $.getScript('/static/components/codemirror/mode/clike/clike.js');
  $.getScript('/static/components/codemirror/mode/clike/javascript.js');

  // Configure CodeMirror settings
  var cmConfig = IPython.CodeCell.options_default.cm_config;
  cmConfig.mode = 'text/javascript';
  cmConfig.indentUnit = 2;
  cmConfig.smartIndent = true;
  cmConfig.autoClearEmptyLines = true;
  cmConfig.gutter = true;
  cmConfig.fixedGutter = true;
  cmConfig.lineNumbers = true;
  cmConfig.lineNumberFormatter = hiddenLineFormatter;

  // %%json cell support
  IPython.config.cell_magic_highlight['magic_application/ld+json'] = {
    reg: [ /%%json/ ]
  };
  IPython.config.cell_magic_highlight['magic_text/plain'] = {
    reg: [ /%%text/ ]
  };

  var codeCellProto = IPython.CodeCell.prototype;
  var originalJSONConverter = codeCellProto.toJSON;
  var originalExecuteReplyHandler = codeCellProto._handle_execute_reply;
  var originalSelectHandler = codeCellProto.select;
  var originalUnselectHandler = codeCellProto.unselect;

  // Override JSON conversion to switch the language identifier.
  codeCellProto.toJSON = function() {
    var data = originalJSONConverter.apply(this);
    data.language = 'javascript';

    return data;
  }

  // Override execute handler on code cells to copy metadata from kernel into
  // cell metadata.
  codeCellProto._handle_execute_reply = function(msg) {
    originalExecuteReplyHandler.call(this, msg);

    var metadata = msg.metadata;
    for (var n in metadata) {
      if (n.indexOf('ijava.') === 0) {
        this.metadata[n] = metadata[n];
      }
    }
  }

  // Override select and unselect handlers to toggle display of line numbers.
  codeCellProto.select = function() {
    if (originalSelectHandler.apply(this)) {
      this.code_mirror.setOption('lineNumberFormatter', stringLineFormatter);
      return true;
    }
    return false;
  }
  codeCellProto.unselect = function() {
    if (originalUnselectHandler.apply(this)) {
      this.code_mirror.setOption('lineNumberFormatter', hiddenLineFormatter);
      return true;
    }
    return false;
  }
});

// JSON display support
$(function() {
  IPython.OutputArea.display_order.push('application/json');

  IPython.OutputArea.append_map['application/json'] = function(data, md, element) {
    var outputElement = this.create_output_subarea(md, 'output_text', 'application/json');
    outputElement.append($('<pre/>').text(JSON.stringify(data, null, 2)));

    element.append(outputElement);

    return outputElement;
  }
});
