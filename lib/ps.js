var spawn = require('child_process').spawn;
var xml2js = require('xml2js');

/**
* Returns all the system processes
* @param options
*   filter {function(p)} filters processes before inserting to result list.
* @param callback {function(err, list)} Called with the list of all processes.
* @remarks Runs only on Windows (uses WMI)
*/
module.exports = function (options, callback) {

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  options.filter = options.filter || function () { return true; };

  callback = callback || function () { };

  var cmd = [
    'process',
    'list',
    '/format:rawxml'
  ];

  // Spawn process, since output from exec can be too big for buffer size supported.
  var p = spawn('wmic', cmd);

  var xml = '';

  p.stdout.on('data', function (data) {
    xml = xml + data.toString();
  });

  p.stderr.on('data', function (data) {
    console.error(data);
  });

  p.on('exit', function () {
    parser = new xml2js.Parser();
    parser.parseString(xml, function (err, result) {
      var output = {};
      result.RESULTS.CIM.INSTANCE.forEach(function (p) {
        var entry = {};
        p.PROPERTY.forEach(function (v) {
          entry[v['@'].NAME] = v.VALUE;
        });

        var e = {
          pid: entry.Handle,
          desc: entry.Description,
          cmd: entry.CommandLine,
          prog: entry.ExecutablePath
        };

        if (!e.cmd) delete e.cmd;
        if (!e.prog) delete e.prog;

        if (e.pid && options.filter(e)) {
          output[e.pid] = e;
        }
      });
      callback(null, output);
    });
  });
}