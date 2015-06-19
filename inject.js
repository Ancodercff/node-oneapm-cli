// INJECTED BY ONEAPM-CLI

/**
 * bin/oneapm will make sure oneapm-cli/node_modules is in the NODE_PATH environment variable
 * so that v8-profiler can be included from oneapm-cli's path
 *
 */

var profiler = require('v8-profiler');
var WebSocket = require('ws');
var debug = require('debug')('oneapm-inject-pid.' + process.pid);

var masterServer = process.env.ONEAPM_MASRER_SERVER;
var reportDuration = process.env.ONEAPM_REPORTING_DURATION;

debug('injected');

/**
 * gather metrics
 * @returns {{}}
 */
function sampleMetrics() {
  var message = {};
  message.pid = process.pid;
  message.memoryUsage = process.memoryUsage();
  return message;
}

/**
 *
 * @param actionName
 * @return {String}
 */
function executeAction(actionName) {
  var filename;
  var response = "";

  switch (actionName) {
    case 'takeSnapshot':
      var snapShot = profiler.takeSnapshot();

      debug('snapshot created %s', snapShot.title);
      filename = Date.now() + '.heapsnapshot';
      var output = require('fs').createWriteStream(filename);
      snapShot.serialize(function (line, length) {
        output.write(line);
      }, String);
      debug('snapshot file created %s', filename);

      response = filename;

      break;

    case 'startProfiling':
      profiler.startProfiling();
      debug('startProfiling');
      break;

    case 'stopProfiling':
      var cpuProfile = profiler.stopProfiling();
      debug('cpuprofile created %s', cpuProfile.title);
      filename = Date.now() + '.cpuprofile';
      require('fs').writeFileSync(filename, JSON.stringify(cpuProfile));
      debug('cpuprofile file created ', filename);
      response = filename;
      break;

    case 'ping':
      response = 'pong';
      break;

    default:
      debug('unknow action:%s', actionName);
      break;
  }

  return response;
}

setTimeout(function () {
  "use strict";

  var ws = new WebSocket(masterServer);

  ws.on('open', function () {
    debug('connected to master: %s', masterServer);
    setInterval(function () {
      ws.send(JSON.stringify(sampleMetrics()));
    }, reportDuration);
  });

  ws.on('error', function (err) {
    debug('error connecting to master', err);
  });

  ws.on('message', function (msg) {
    debug('message received:%s ', msg.toString());
    ws.send(executeAction(msg));
  });

}, 200);
// INJECTED BY ONEAPM-CLI