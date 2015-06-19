#!/usr/bin/env node

/**
 * Created by yan on 15-6-19.
 */

console.log(process.pid);

var child_process = require('child_process');
var profiler = require('v8-profiler');
var p = child_process.fork('index.js',{
  env:require('util')._extend(process.env,{
    NODE_PATH:process.env.NODE_PATH+":"+require('path').join(__dirname,'..','node_modules')
  })
});
console.log(process.pid, p.pid);
