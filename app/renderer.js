"use strict";

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const tagParser = require('./tag_parser');

const ejsRenderer = ejs.render;

function getFilePath(file, parentPath) {
    let filePath = file;
    if (parentPath) filePath = path.join(parentPath, "../", file);
    return filePath;
}


class Renderer {

    constructor(options) {

        this.tokens = options.tokens;
        this.renderedStack = [];

        this.options = options; //remove in the futuuure
    }

    render(file, x, parentPath) {
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
    renderString(content,x, includePath) {
        includePath = includePath || process.cwd();
        includePath += "/file";
        content = this.parseContent(content);
        const rendererOptions = this.optionsSetup(includePath);
        content = ejsRenderer(content, rendererOptions);
        rendererOptions.parentPath = includePath;
        return content;
    }


    optionsSetup(filePath) {
        const options = this.options;
        const rendererOptions = options.args || {};
        rendererOptions.xejs = this.render.bind(this); //Recursive function to be used by EJS
        rendererOptions.parentPath = filePath;
        rendererOptions.options = options;
        return rendererOptions;
    }

    loadFile(filePath) {
        return fs.readFileSync(filePath, 'utf-8');
    }

    parseContent(content) {
        return tagParser(content, this.tokens, this.options);
    }

    fileInStack(file) {
        if (this.renderedStack.indexOf(file) >= 0) return true;
        else return false;
    }

}

module.exports = {
    renderFile: function(files, options, parentPath) {
        const renderer = new Renderer(options);
        return renderer.render(files, null, parentPath);

    },
    renderString: function(content, options, includePath) {
        const renderer = new Renderer(options);
        return renderer.renderString(content, null, includePath);
    }
};
