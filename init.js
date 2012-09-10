var jshint = require('jshint');

function buildTitle(documentName, errorCount) {
  return errorCount + ' errors in ' + documentName;
}

Hooks.addMenuItem("Actions/JavaScript/JSHint document", "cmd-ctrl-h", function () {
    
    var doc = Document.current(),
        result = jshint.JSHINT(doc.text);
    
    // Only show the window if we have errors.
    if (!result) {
      var data = jshint.JSHINT.data();
      var errors = data.errors;
      
      var window = new Sheet(MainWindow.current());
      window.htmlPath = 'index.html';
      window.buttons = ["OK"];
      window.onButtonClick = function() { window.close(); }
      window.size = {width: 250, height: 300};
      
      window.onMessage = function (name, arguments) {
        if (name === 'goToLine') {
          var lineNum = arguments[0];
          
          Recipe.run(function (recipe) {
            // Line number is 0 indexed in chocolat.
            // Don't need to verify if lineNum is 0 since it should never be.
            var range = recipe.characterRangeForLineIndexes(new Range(lineNum - 1,0));
            recipe.selection = range;
            window.close();
          });
        }
      };
      
      window.title = buildTitle(doc.filename(), errors.length);
      window.run();
      window.applyFunction('hinted', [data]);
      
    } else {
      Alert.show("No errors", "Awesome work!", ["OK"]);
    }
});