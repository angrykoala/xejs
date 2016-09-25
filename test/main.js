var fs = require('fs');
var assert = require('chai').assert;

var xejs = require('../index.js');

var config=require('./config');

describe("Main test", function() {
    it("Exaple file", function(done) {
        this.timeout(5000);
        var regex=config.regex;
        assert.ok(xejs);
        xejs(__dirname + '/file1.md', config.options, config.args, function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            var i;
            for (i = 0; i < regex.match.length; i++) {
                assert.match(res, regex.match[i]);
            }
            for (i = 0; i < regex.notMatch.length; i++) {
                assert.notMatch(res, regex.notMatch[i]);
            }
            done();
        });
    });
});
