"use strict";

var fs = require('fs');
var path = require('path');

var jsxgettext = require('../../lib/jsxgettext');
var json = require('../../lib/parsers/json').json;


exports['test json parser with sample.json'] = function (assert, cb) {
  var sampleFilename = path.join(__dirname, '..', 'inputs', 'sample.json');
  var opts = {
    language: 'json',
    keys: ['description'],
    ignoreKeys: ['bugs']
  };
  var testSample = function (err, source) {
    var sources = {'inputs/sample.json': source};
    var result = jsxgettext.generate.apply(jsxgettext, json(sources, opts));
    var inRes = function(str) {
      return (result.indexOf(str) > -1);
    };
    var notInRes = function(str) {
      return !inRes(str);
    };

    assert.equal(typeof result, 'string', 'give results as a string');

    assert.ok(inRes('msgid "are red"'), 'extracts a simple key val from an array');

    assert.ok(inRes('msgid "are red"'), 'extracts messages from an array of objs');

    assert.ok(notInRes('msgid "buzz"'), 'ignores strings nested under an ignore key');

    cb();
  };
  fs.readFile(sampleFilename, "utf8", testSample);
};


exports['test json parser using an ugly sample'] = function (assert, cb) {
  var samplePn = path.join(__dirname, '..', 'inputs', 'sample-ugly.json');
  var opts = { language: 'json', keys: ['noise'] };
  var testSample = function (err, source) {
    var sources = {samplePn: source};
    var result = jsxgettext.generate.apply(jsxgettext, json(sources, opts));
    var inRes = function(str) {
      return (result.indexOf(str) > -1);
    };

    assert.equal(typeof result, 'string', 'give results as a string');

    assert.ok(inRes('such \'quote\''), 'extracts a message containing a quote');

    assert.ok(inRes('a paren )'), 'extracts a message with a bracket');

    assert.ok(inRes('and newline \\n'), 'extracts a message with a newline');

    cb();
  };
  fs.readFile(samplePn, "utf8", testSample);
};


if (module === require.main) require('test').run(exports);
