"use strict";

/**
 * Created by yan on 15-6-19.
 */

var WebSocketServer = require('ws').Server;
var format = require('util').format;
var extend = require('util')._extend;


module.exports = function (wsPort,pid) {

  var wss = new WebSocketServer({
    port: wsPort
  });

  var array_of_ws = [];

  wss.on('connection', function (ws) {
    welcomeConnection(ws);

    ws.on('close', function () {
      removeConnection(ws);
    });

    broadcast('welcome', {
      uptime: process.uptime()
    }, 123);
  });

  function welcomeConnection(ws) {
    array_of_ws.push(ws);

    var welcomeMessage = {
      type: "welcome",
      data: [format('Welcome,currently %d connection(s) online', array_of_ws.length)]
    }

    ws.send(JSON.stringify(welcomeMessage))
  }

  function removeConnection(ws) {
    array_of_ws.splice(array_of_ws.indexOf(ws), 1);
  }

  function broadcast(type) {

    var broadCastMessage = {
      type: type,
      data: Array.prototype.slice.call(arguments, 1)
    }

    var messageContent = JSON.stringify(broadCastMessage);

    array_of_ws.forEach(function (item) {
      item.send(messageContent);
    });

  }

// main logic

  setInterval(function () {

    require('pidusage').stat(pid, function (err, result) {
      broadcast('pidusage', extend(result, {id: Date.now()}));
    })
    broadcast('memoryUsage', extend(process.memoryUsage(), {id: Date.now()}));
  }, 100);

}




