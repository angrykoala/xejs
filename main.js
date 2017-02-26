"use strict";

const Parser = require('./app/parser');
const Renderer = require('./app/renderer');


/* xejs argument:
{
    options:{
        this.openTag: "{{",
        this.closeTag: "}}",
        this.ejsEscape false
    },
    tokens:[
        [/regex/, "Command $1"]
    ],
    args:{
        myVar: "var",
        mtFunction: function(){...}
    }
}
 */


module.exports = class xejs {
    constructor(options) {
        options = options || {};

        const parser = new Parser(options.options, options.tokens);
        this.renderer = new Renderer(parser, options.args);
    }

    render(file, done) {
        return this.renderFile(file, done);
    }
    renderFile(file, done) {
        let error = null;
        let res;
        try {
            res = this.renderer.render(file);
        } catch (e) {
            error = e;
        }
        if (done) done(error, res);
    }
    renderString(file, includePath, done) {
        if (!includePath && !done && typeof includePath === 'function') {
            done = includePath;
        }
        let error = null;
        let res;
        try {
            res = this.renderer.renderString(file, includePath);
        } catch (e) {
            error = e;
        }
        if (done) done(error, res);
    }

};
