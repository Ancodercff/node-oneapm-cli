/**
 * Created by yan on 15-6-19.
 */

console.log(process.env);

require('http').createServer(function (req, res) {
  res.end('ok');
}).listen(3001);