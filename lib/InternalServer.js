"use strict";

/**
 * Internal Server is used by slaved to communicate with master
 *
 * Created by yan on 15-6-19.
 *
 */
var WebSocketServer = require('ws').Server;
var debug = require('debug')('oneapm-internal-server');

module.exports = function (server, process) {

  var wss = new WebSocketServer({
    server: server,
    path: '/internal'
  });

  wss.on('connection', function (ws) {
    process.ws = ws;
    ws.on('message', function (msg) {
      debug('message received:%s', msg);
    });
    ws.send('ping');
  });
};

