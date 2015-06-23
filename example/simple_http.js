/**
 * Created by yan on 15-6-19.
 */

require('http').createServer(function (req, res) {
  "use strict";
  res.end('ok');
}).listen(3001);

setTimeout(function () {
  process.exit(0);
}, 1000)