"use strict";

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

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
        content = this.renderContent(content, filePath);
        this.renderedStack.pop();
        return content;
    }

    //Avoid repeating code
    renderString(content, includePath) {
        includePath = includePath || process.cwd();
        includePath += "/file";
        return this.renderContent(content, includePath);
    }

    renderContent(content, filePath) {
        content = this.parseContent(content);
        const rendererOptions = this.getRendererOptions(filePath);
        return ejsRenderer(content, rendererOptions);
    }

    getRendererOptions(filePath) {
        const rendererOptions = Object.assign({}, this.args);
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

module.exports = Renderer;
