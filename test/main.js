"use strict";

const fs = require('fs');
const assert = require('chai').assert;

const xejs = require('../main.js');

const config = require('./config');

describe("Main test", () => {
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

        renderer.render(config.fileDir + '/ejs_tag.md', (err, res) => {
            assert.notOk(err);
            assert.ok(res);
            assert.match(res, /Hello World\s*Hello World/);
            assert.notMatch(res, /<%-\s*msg\s*%>/);
            const renderer2 = new xejs({
                options: {
                    ejsEscape: true
                },
                tokens: config.tokens,
                args: config.args
            });
            renderer2.render(config.fileDir + '/ejs_tag.md', (err, res) => {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /Hello World/);
                assert.notMatch(res, /Hello World\s*Hello World/);
                assert.match(res, /<%-\s*msg\s*%>/);
                done();
            });
        });
    });

    it("Comment tags", (done) => {
        defaultRenderer.render(config.fileDir + '/comments.md', (err, res) => {
            assert.notOk(err);
            assert.ok(res);
            assert.match(res, /#\sComment\stags\s+#\sNot\scomment\stags/);
            assert.match(res, /#\sNot\scomment\stags\s+\{\{\s#\snot\scomment\stag\}\}\s*\{\{#\sMultiline\s+not\ssupported\}\}/);
            done();
        });
    });

    it("File not found error", (done) => {
        configRenderer.render(config.fileDir + "/notfound.md", (err, res) => {
            assert.ok(err);
            assert.notOk(res);
            done();
        });
    });
    it.skip("Return Promise", (done) => {
        configRenderer.render(config.fileDir + '/file1.md').then((res) => {
            assert.ok(res);
            done();
        });
    });

    it.skip("Rejected Promise", (done) => {
        configRenderer.render(config.fileDir + "/notfound.md").catch((err) => {
            assert.ok(err);
            done();
        });
    });

    it("Render from string", (done) => {
        fs.readFile(config.fileDir + '/file1.md', 'utf-8', (err, res) => {
            assert.notOk(err);
            assert.ok(res);
            defaultRenderer.renderString(res, config.fileDir, (err, res) => {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /Second\sfile\scontent/);
                assert.match(res, /\{\{\s*message\s*\}\}/);
                defaultRenderer.render(config.fileDir + '/file1.md', (err, res2) => {
                    assert.notOk(err);
                    assert.ok(res2);
                    assert.strictEqual(res, res2);
                    done();
                });
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

    it("Circular dependencies including files", (done) => {
        configRenderer.render(config.fileDir + '/circular1.md', (err) => {
            assert.ok(err);
            done();
        });
    });

    it("Case insensitive tokens", (done) => {
        const renderer = new xejs({
            tokens: [
                [/Message/, "msg"],
                [/iMessage/i, "msg"]
            ],
            args: config.args
        });

        renderer.render(config.fileDir + '/case_sensitive.md', (err, res) => {
            assert.notOk(err);
            assert.match(res, /##\sCase\sSensitive\s*Hello World\s*\{\{message\}\}\s*\{\{MESSAGE\}\}\s*\{\{MeSSage\}\}/);
            assert.match(res, /##\sCase\sInsensitive(\s*Hello World\s*){4}/);
            done();
        });
    });

    describe("Custom tags", () => {

        it("Double custom tags", (done) => {
            const renderer = new xejs({
                options: {
                    openTag: "<<",
                    closeTag: ">>"
                },
                args: config.args,
                tokens: config.tokens
            });

            renderer.renderFile(config.fileDir + '/custom_tags.md', (err, res) => {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /# Custom Tags\s*## Double Tags\s*Hello World\s*## Second file/);
                done();
            });

        });

        it("Only opening tags", () => {
            const renderer = new xejs({
                options: {
                    openTag: "@",
                    singleTag: true
                },
                args: config.args,
                tokens: config.tokens
            });

            renderer.renderFile(config.fileDir + '/single_tag.md', (err, res) => {
                assert.notOk(err);
                assert.ok(res);
                assert.match(res, /^Hello World\s+# Unclosed Tags/);
                assert.match(res, /## Valid Tags\s*Hello World\s+##\sSecond\sfile\s*Second\sfile\scontent\s+Hello World Hello World\s+Hello World\nHello World\s+Hello World not\_parse/);
                assert.match(res, /##\sInvalid\sTags\s+@message@\s+@\smessage\s+@message@message\s+test@message\s+@includefile2\.md\s+{{message}}/);
                assert.match(res, /##\sComments\s+@\s#message\s+@@#message\s+@ # message\s+#message\s+a@#message space/);


            });
        });

        it("Custom comment tags", (done) => {
            const renderer = new xejs({
                options: {
                    commentTag: "@"
                },
                args: config.args,
            });
            renderer.renderFile(config.fileDir + '/custom_tags.md', (err, res) => {
                assert.notOk(err);
                assert.ok(res);
                assert.notMatch(res, /\{\{\@[\s\S]*?\}\}/);
                assert.notMatch(res, /custom comment/);
                assert.match(res, /## Custom Comment\s*<<# normal comment >>/);
                done();
            });
        });
        it("Comments with custom tags", (done) => {
            const renderer = new xejs({
                options: {
                    openTag: "<<",
                    closeTag: ">>"
                },
                args: config.args
            });

            renderer.renderFile(config.fileDir + '/custom_tags.md', (err, res) => {
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
