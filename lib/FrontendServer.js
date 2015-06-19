"use strict";

/**
 *
 * FrontendServer is used to talk to browsers
 *
 * Created by yan on 15-6-19.
 */

var WebSocketServer = require('ws').Server;
var format = require('util').format;
var extend = require('util')._extend;

module.exports = function (server, p) {

  var wss = new WebSocketServer({
    server: server,
    path: '/frontend'

  });

  wss.on('connection', function (ws) {
    welcomeConnection(ws);
    broadcast('welcome', {
      uptime: process.uptime()
    }, 123);

  });

  function welcomeConnection(ws) {
    var welcomeMessage = {
      type: "welcome",
      data: [format('Welcome,currently %d connection(s) online', wss.clients.length)]
    };

    ws.send(JSON.stringify(welcomeMessage));
  }

  function broadcast(type) {

    var broadCastMessage = {
      type: type,
      data: Array.prototype.slice.call(arguments, 1)
    };

    var messageContent = JSON.stringify(broadCastMessage);

    wss.clients.forEach(function (item) {
      item.send(messageContent);
    });

  }

  // main logic

  setInterval(function () {

    require('pidusage').stat(p.pid, function (err, result) {
      broadcast('pidusage', extend(result, {id: Date.now()}));
    });

    broadcast('memoryUsage', extend(process.memoryUsage(), {id: Date.now()}));

  }, 100);

};




