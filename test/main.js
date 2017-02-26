"use strict";

const fs = require('fs');
const assert = require('chai').assert;

const xejs = require('../main.js');

const config = require('./config');

describe("Main test", function() {
    this.timeout(5000);
    const regex = config.regex;
    let configRenderer;
    let defaultRenderer;

    beforeEach(() => {
        configRenderer = new xejs({
            tokens: config.tokens,
            args: config.args
        });
        defaultRenderer = new xejs();
    });

    it("Example file", (done) => {
        assert.ok(xejs);
        configRenderer.render(config.fileDir + '/file1.md', (err, res) => {
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

    it("No arguments provided", (done) => {
        const renderer = new xejs();
        const renderer2 = new xejs({});

        renderer.render(config.fileDir + '/file1.md', (err, res) => {
            assert.notOk(err);
            assert.ok(res);

            renderer2.render(config.fileDir + '/file1.md', (err, res2) => {
                assert.notOk(err);
                assert.ok(res2);
                assert.strictEqual(res, res2);

                assert.match(res, /Second\sfile\scontent/);
                assert.match(res, /\{\{\s*message\s*\}\}/);
                done();
            });
        });
    });

    it("No ejs escape option", (done) => {
        const renderer = new xejs({
            options: {
                ejsEscape: false
            },
            tokens: config.tokens,
            args: config.args
        });

        renderer.render(config.fileDir + '/ejs_tag.md', function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            assert.match(res, /Hello\sWorld\s*Hello\sWorld/);
            assert.notMatch(res, /<%-\s*msg\s*%>/);
            const renderer2 = new xejs({
                options: {
                    ejsEscape: true
                },
                tokens: config.tokens,
                args: config.args
            });
            renderer2.render(config.fileDir + '/ejs_tag.md', function(err, res) {
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
        defaultRenderer.render(config.fileDir + '/comments.md', function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            assert.match(res, /#\sComment\stags\s+#\sNot\scomment\stags/);
            assert.match(res, /#\sNot\scomment\stags\s+\{\{\s#\snot\scomment\stag\}\}\s*\{\{#\sMultiline\s+not\ssupported\}\}/);
            done();
        });
    });

    it("File not found error", function(done) {
        configRenderer.render(config.fileDir + "/notfound.md", (err, res) => {
            assert.ok(err);
            assert.notOk(res);
            done();
        });
    });
    it.skip("Return Promise", function(done) {
        configRenderer.render(config.fileDir + '/file1.md').then((res) => {
            assert.ok(res);
            done();
        });
    });

    it.skip("Rejected Promise", function(done) {
        configRenderer.render(config.fileDir + "/notfound.md").catch((err) => {
            assert.ok(err);
            done();
        });
    });

    it("Render from string", function(done) {
        fs.readFile(config.fileDir + '/file1.md', 'utf-8', function(err, res) {
            assert.notOk(err);
            assert.ok(res);
            defaultRenderer.renderString(res, config.fileDir, function(err, res) {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /Second\sfile\scontent/);
                assert.match(res, /\{\{\s*message\s*\}\}/);
                defaultRenderer.render(config.fileDir + '/file1.md', function(err, res2) {
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

    it("Render file method", (done) => {
        configRenderer.render(config.fileDir + '/file1.md', (err, res) => {
            assert.notOk(err);
            assert.ok(res);
            configRenderer.renderFile(config.fileDir + '/file1.md', (err2, res2) => {
                assert.notOk(err2);
                assert.ok(res2);
                assert.strictEqual(res, res2);
                done();
            });
        });
    });
});
