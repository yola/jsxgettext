'use strict';
var lodash = require('lodash');
var jsontrans = require('gulp-static-i18n/lib/translators/json');
var Dotted = jsontrans.Dotted;
var pushDotKeys = jsontrans.pushDotKeys;


function extractStrings(keyTest, jsonStr) {
  // bfs traversal
  var obj = JSON.parse(jsonStr);
  var strings = [];
  var queue = [];
  var dotobj = new Dotted(obj);
  var key, val;
  var next = function() {
    key = queue.shift();
    val = dotobj.get(key);
    return key;
  };

  pushDotKeys(null, obj, queue);
  while (next()) {
    if (typeof val === 'object' || Array.isArray(val)) {
      pushDotKeys(key, val, queue);
    }
    if (typeof val === 'string' && val !== '' && keyTest(key, obj)) {
      strings.push(val);
    }
  }

  return strings;
}

function getParser(options) {
  var keys = options.keys;
  var ignored = options.ignoreKeys;

  if (!keys) {
    var msg = 'Option --keys must be used when extracting from json';
    throw new Error(msg);
  }

  var isKeyMarkedForExtraction = jsontrans.getKeyFilter(keys, ignored);
  return lodash.partial(extractStrings, isKeyMarkedForExtraction);
}

var jsonParser = function(sources, options) {
  var parse = getParser(options);
  var strings = lodash.mapValues(sources, parse);
  options.stringsExtracted = true;
  return [strings, options];
};

exports.json = jsonParser;
