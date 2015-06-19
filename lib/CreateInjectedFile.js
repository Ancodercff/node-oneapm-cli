/**
 * Created by yan on 15-6-19.
 */
var fs = require('fs');
var path = require('path');

/**
 *
 * @param fileName
 * @returns {string}
 */
module.exports = function (fileName) {
  var originalFilePath = require('path').join(process.cwd(), fileName);
  var originalConent = fs.readFileSync(originalFilePath).toString();
  var newFilePath = originalFilePath + '.mod';
  var injectContent = fs.readFileSync(path.join(__dirname, '..', 'inject.js')).toString();
  fs.writeFileSync(newFilePath, injectContent + '\n' + originalConent);
  return newFilePath;
}