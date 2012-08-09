(function() {
  var assert, doCommand, getScreenType, log;

  log = function(s) {
    var logTag;
    logTag = $('log');
    return logTag.innerHTML += satanise(s);
  };

  assert = function(s) {
    return log(s);
  };

  doCommand = function(cmd) {
    return execute(cmd);
  };

  getScreenType = function(context) {
    return 'small';
  };

}).call(this);

