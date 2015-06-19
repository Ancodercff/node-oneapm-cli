// injected by oneapm :: begin
var chalk = require('chalk');
var profiler = require('v8-profiler');
var WebSocket = require('ws');
var debug = require('debug')('oneapm-child-pid.' + process.pid);

debug('indejcted');

setTimeout(function () {
  var ws = new WebSocket('ws://127.0.0.1:8006/');
  ws.on('message', function (msg) {
    debug('message received:%s ', msg.toString());
    switch (msg) {
      case 'takeSnapshot':
        var snapShot = profiler.takeSnapshot();

        debug('snapshot created %s', snapShot.title);

        var filename = Date.now() + '.heapsnapshot';
        var output = require('fs').createWriteStream(filename);
        snapShot.serialize(function (line, length) {
          output.write(line);
        }, String);
        debug('snapshot file created %s', filename);

        break;
      case 'startProfiling':
        profiler.startProfiling();
        debug('startProfiling');
        break;
      case 'stopProfiling':
        var cpuProfile = profiler.stopProfiling();
        debug('cpuprofile created %s', cpuProfile.title);
        var filename = Date.now() + '.cpuprofile'
        require('fs').writeFileSync(filename, JSON.stringify(cpuProfile));
        debug('cpuprofile file created ', filename);
      case 'ping':
        ws.send('pong');
        break;
    }
  });
}, 200);

// injected by oneapm :: end