"use strict";

const Parser = require('./app/parser');
const Renderer = require('./app/renderer');


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
        const res=this.renderer.render(file); //TODO: return promise
        if(done) done(null,res);
    }
    renderString(file,includePath, done) {
        if(!includePath && !done && typeof includePath==='function'){
            done=includePath;
        }
        const res=this.renderer.renderString(file,this.includePath); //TODO: return promise
        if(done) done(null,res);
    }

};

/*module.exports = {
    renderer: Renderer,
    parser: TagParser,
    defaultTags: defaultTags,
};*/
