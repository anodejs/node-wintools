var spawn = require('child_process').spawn;
var xml2js = require('xml2js');

/**
* Returns all the system processes
* @param filter {function(p)->Boolean} A filter function executed on each process before pushing it to the list.
* @param callback {function(err, list)} Called with the list of all processes.
* @remarks Runs only on Windows (uses WMI)
*/
module.exports = function (filter, callback) {
  if (!filter) filter = function () { return true; }
  if (!callback) callback = function () { };

  var options = [
    'process',
    'list',
    '/format:rawxml'
  ];

  // Spawn process, since output from exec can be too big for buffer size supported.
  var p = spawn('wmic', options);

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

        if (e.pid && filter(e)) {
          output[e.pid] = e;
        }
      });
      callback(null, output);
    });
  });
}