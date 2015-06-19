"use strict";

/**
 * Created by wyvern on 15/6/18.
 */

var http = require('http');
var express = require('express');
var pidusage = require('pidusage');
var app = express();
var server = http.createServer(app);
var path = require('path');


module.exports = function (process) {

  app.get('/current', function (req, res) {
    res.json(process.pid);
  })

  app.get('/action/:action', function (req, res) {
    process.ws.send(req.params.action);
    res.end();
  });

  return server;
};

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/process/:pid', function (req, res) {
  pidusage.stat(req.params.pid, function (err, result) {
    res.json(result);
  });
});