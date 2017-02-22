"use strict";

const fs = require('fs');
const assert = require('chai').assert;

const xejs = require('../main.js');

const config = require('./config');

describe("Main test", function() {
    this.timeout(5000);
    const regex = config.regex;
    it("Example file", function(done) {
        assert.ok(xejs);
        xejs(__dirname + '/file1.md', config.options, config.args, function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            for (let i = 0; i < regex.match.length; i++) {
                assert.match(res, regex.match[i]);
            }
            for (let i = 0; i < regex.notMatch.length; i++) {
                assert.notMatch(res, regex.notMatch[i]);
            }
            done();
        });
    });

    it("No arguments provided", function(done) {
        xejs(__dirname + '/file1.md', function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            xejs(__dirname + '/file1.md', {}, function(err, res2) {
                assert.notOk(err);
                assert.ok(res2);
                assert.strictEqual(res, res2);
                assert.match(res, /Second\sfile\scontent/);
                assert.match(res, /\{\{\s*message\s*\}\}/);
                done();
            });
        });
    });

    it("No ejs escape option", function(done) {
        assert.ok(xejs);
        const options = config.options;
        options.ejsEscape = false;
        xejs(__dirname + '/file3.md', options, config.args, function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            assert.match(res, /Hello\sWorld\s*Hello\sWorld/);
            assert.notMatch(res, /<%-\s*msg\s*%>/);
            options.ejsEscape = true;
            xejs(__dirname + '/file3.md', options, config.args, function(err, res) {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /Hello\sWorld/);
                assert.notMatch(res, /Hello\sWorld\s*Hello\sWorld/);
                assert.match(res, /<%-\s*msg\s*%>/);
                done();
            });
        });
    });
    it("Comment tags", function(done) {
        xejs(__dirname + '/file4.md', function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            assert.match(res, /#\sComment\stags\s+#\sNot\scomment\stags/);
            assert.match(res, /#\sNot\scomment\stags\s+\{\{\s#\snot\scomment\stag\}\}\s*\{\{#\sMultiline\s+not\ssupported\}\}/);
            done();
        });
    });
    it("Return Promise", function(done) {
        xejs(__dirname + "/file1.md", config.options, config.args).then(function(res) {
            assert.ok(res);
            done();
        });
    });

    it("Rejected Promise", function(done) {
        xejs(__dirname + "/notfound.md", config.options, config.args).then(function() {}, function(err) {
            assert.ok(err);
            done();
        });
    });
    it("Render from string", function(done) {
        fs.readFile(__dirname + '/file1.md', 'utf-8', function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            xejs.renderString(res, {
                includePath: __dirname
            }, function(err, res) {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /Second\sfile\scontent/);
                assert.match(res, /\{\{\s*message\s*\}\}/);
                xejs(__dirname + '/file1.md', {}, function(err, res2) {
                    assert.notOk(err);
                    assert.ok(res2);
                    assert.strictEqual(res, res2);
                    done();
                });
            });
        });
    });
    it("Render file method", function(done) {
        xejs.renderFile(__dirname + '/file1.md', config.options, config.args, function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            for (let i = 0; i < regex.match.length; i++) {
                assert.match(res, regex.match[i]);
            }
            for (let i = 0; i < regex.notMatch.length; i++) {
                assert.notMatch(res, regex.notMatch[i]);
            }
            done();
        });
    });

    it("Circular dependencies including files", function(done) {
        xejs.renderFile(__dirname + '/file6.md', config.options, config.args, function(err) {
            assert.ok(err);
            done();
        });
    });

    it("Case insensitive tokens", function(done) {
        xejs.renderFile(__dirname + '/case_sensitive.md', {
            tokens: [
                [/Message/, "msg"],
                [/iMessage/i, "msg"]
            ]
        }, config.args, function(err, res) {
            assert.notOk(err);
            assert.match(res, /##\sCase\sSensitive\s*Hello\sWorld\s*\{\{message\}\}\s*\{\{MESSAGE\}\}\s*\{\{MeSSage\}\}/);
            assert.match(res, /##\sCase\sInsensitive(\s*Hello\sWorld\s*){4}/);
            done();
        });
    });

    describe("Custom tags", function() {
        let options;
        beforeEach(function() {
            options = {
                tokens: config.options.tokens
            };
        });

        it("Double custom tags", function(done) {
            options.openTag = "<<";
            options.closeTag = ">>";

            xejs.renderFile(__dirname + '/custom_tags.md', options, config.args, function(err, res) {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /#\sCustom\sTags\s*##\sDouble\sTags\s*Hello\sWorld\s*##\sSecond\sfile/);
                done();
            });

        });

        it.skip("Only opening tags", function() {
            throw new Error("Not implemented");

        });

        it("Custom comment tags", function(done) {
            options.commentTag = "@";
            xejs.renderFile(__dirname + '/custom_tags.md', options, config.args, function(err, res) {
                assert.notOk(err);
                assert.ok(res);
                assert.notMatch(res, /\{\{\@[\s\S]*?\}\}/);
                assert.notMatch(res, /custom\scomment/);
                assert.match(res, /##\sCustom\sComment\s*<<#\snormal\scomment\s>>/);
                done();
            });
        });
        it("Comments with custom tags", function(done) {
            options.openTag = "<<";
            options.closeTag = ">>";

            xejs.renderFile(__dirname + '/custom_tags.md', options, config.args, function(err, res) {
                assert.notOk(err);
                assert.ok(res);
                assert.notMatch(res, /<<#[\s\S]*?>>/);
                assert.notMatch(res, /normal\scomment/);
                assert.match(res, /##\sCustom\sComment\s*\{\{\@\scustom\scomment\s\}\}/);
                done();
            });
        });
    });
});
