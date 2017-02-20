"use strict";

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const TagParser = require('./tag_parser');

const ejsRenderer = ejs.render;

function getFilePath(file, parentPath) {
    let filePath = file;
    if (parentPath) filePath = path.join(parentPath, "../", file);
    return filePath;
}


class Renderer {
    constructor(tagParser, args) {
        this.parser = tagParser;
        this.args = args;
        this.renderedStack = [];
    }

    render(file, parentPath) {
        const filePath = getFilePath(file, parentPath);
        if (this.fileInStack(filePath)) throw new Error("Error: Found circular dependencies while parsing xejs");
        this.renderedStack.push(filePath);
        let content = this.loadFile(filePath);
        content = this.parseContent(content);
        const rendererOptions = this.optionsSetup(filePath);
        content = ejsRenderer(content, rendererOptions);
        rendererOptions.parentPath = parentPath;
        this.renderedStack.pop();
        return content;
    }

    //Avoid repeating code
    renderString(content, includePath) {
        includePath = includePath || process.cwd();
        includePath += "/file";
        content = this.parseContent(content);
        const rendererOptions = this.optionsSetup(includePath);
        content = ejsRenderer(content, rendererOptions);
        rendererOptions.parentPath = includePath;
        return content;
    }


    optionsSetup(filePath) {
        const rendererOptions = this.args || {};
        rendererOptions.xejs = this.render.bind(this); //Recursive function to be used by EJS
        rendererOptions.parentPath = filePath;
        return rendererOptions;
    }

    loadFile(filePath) {
        return fs.readFileSync(filePath, 'utf-8');
    }

    parseContent(content) {
        return this.parser.execute(content);
    }

    fileInStack(file) {
        if (this.renderedStack.indexOf(file) >= 0) return true;
        else return false;
    }

}

module.exports = {
    renderFile: function(files, options, parentPath) {
        const parser = new TagParser(options, options.tokens);
        const renderer = new Renderer(parser,options.args);
        return renderer.render(files, parentPath);

    },
    renderString: function(content, options, includePath) {
        const parser = new TagParser(options, options.tokens);
        const renderer = new Renderer(parser,options.args);
        return renderer.renderString(content, includePath);
    }
};
