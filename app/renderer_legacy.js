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

function fileInStack(file,renderedStack){
    if(renderedStack.indexOf(file)>=0) return true;
    else return false;
}

function loadFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

function parseContent(content, options) {
    if (options.ejsEscape !== false) content = content.replace(options.tagRegex, "<%%");
    return tagParser(content, options.tokens, options);
}

function optionsSetup(filePath, options) {
    const rendererOptions = options.args || {};
    rendererOptions.xejs = xejs;
    rendererOptions.parentPath = filePath;
    rendererOptions.options = options;
    return rendererOptions;
}

//Avoid repeating code
function xejs(file, options, parentPath) {
    const filePath = getFilePath(file, parentPath);
    if(fileInStack(filePath, options.renderedStack)) throw new Error("Error: Found circular dependencies while parsing xejs");
    options.renderedStack.push(filePath);
    let content = loadFile(filePath);
    content = parseContent(content, options);
    const rendererOptions = optionsSetup(filePath, options);
    content = ejsRenderer(content, rendererOptions);
    rendererOptions.parentPath = parentPath;
    options.renderedStack.pop();
    return content;
}

//Avoid repeating code
function renderString(content, options, includePath) {
    includePath = includePath || process.cwd();
    includePath += "/file";
    content = parseContent(content, options);
    const rendererOptions = optionsSetup(includePath, options);
    content = ejsRenderer(content, rendererOptions);
    rendererOptions.parentPath = includePath;
    return content;
}

module.exports = {
    renderFile: xejs,
    renderString: renderString
};
