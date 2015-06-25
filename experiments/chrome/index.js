"use strict";

var child_process = require('child_process');
var which = require('which');
var chalk = require('chalk');
var chrome = require('chrome-debug-protocol');

var resolved = which.sync('chromium-browser') || which.sync('chrome');

var REMOTE_DEBUGGING_PORT = 9222;
var DEMO_URL = "http://www.baidu.com/"

// http://peter.sh/experiments/chromium-command-line-switches/
var args = [
  "--temp-profile",
  "--no-first-run",
  "--disable-extensions",
  "--no-default-browser-check",
  "--remote-debugging-port=" + REMOTE_DEBUGGING_PORT,
  "--proxy-auto-detect"
];

args.push("http://localhost:" + REMOTE_DEBUGGING_PORT);
args.push(DEMO_URL);

child_process.spawn(resolved, args).on('exit', function (exitCode) {
  console.log(chalk.green("existing"));
  process.exit(exitCode);
});

setTimeout(function () {
  chrome.getTabs("http://localhost:" + REMOTE_DEBUGGING_PORT + "/json", function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.url === DEMO_URL) {
        var chromeTab = chrome.createDebugger(tab);

        /**
         * @see http://chromedevtools.github.io/debugger-protocol-viewer/
         * @see https://github.com/DickvdBrink/chrome-debug-protocol/blob/master/protocol.json
         */
        chromeTab.Console.enable();
        chromeTab.on('Console.messageAdded', function (evt) {
          console.log(evt.message.text, evt.message.url + '#' + evt.message.line);
        });
      }
    })
  })
}, 1000);