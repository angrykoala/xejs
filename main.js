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
        done = done || promesify;
        let res;
        try {
            res = this.renderer.render(file);
        } catch (e) {
            error = e;
        }
        return done(error, res);
    }
    renderString(content, includePath, done) {
        if (!includePath && !done && typeof includePath === 'function') {
            done = includePath;
        }
        done = done || promesify;
        includePath = includePath || process.cwd();
        let error = null;
        let res;
        try {
            res = this.renderer.renderString(content, includePath);
        } catch (e) {
            error = e;
        }
        return done(error, res);
    }

};

// Private function to return a promise if no done is found
function promesify(err, res) {
    if (!err) return Promise.resolve(res);
    else return Promise.reject(err);
}
