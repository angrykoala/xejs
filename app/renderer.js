var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var ejsRenderer = ejs.render;

var tagParser = require('./tag_parser');


function getFilePath(file, parentPath) {
    var filePath = file;
    if (parentPath) filePath = path.join(parentPath, "../", file);
    return filePath;
}

function loadFile(filePath){
    return fs.readFileSync(filePath, 'utf-8');
}

function parseContent(content, options) {
    if (options.ejsEscape !== false) content = content.replace(options.tagRegex, "<%%");
    return tagParser(content, options.tokens, options);
}

function setupOptions(filePath, options) {
    var rendererOptions = options.args || {};
    rendererOptions.xejs = xejs;
    rendererOptions.parentPath = filePath;
    rendererOptions.options = options;
    return rendererOptions;
}


function xejs(file, options, parentPath) {
    var filePath = getFilePath(file, parentPath);
    var content= loadFile(filePath);
    content = parseContent(content, options);
    var rendererOptions = setupOptions(filePath, options);
    content = ejsRenderer(content, rendererOptions);
    rendererOptions.parentPath = parentPath;
    return content;
}

function renderFromString(content,options){
    var filePath = ".";
    content = parseContent(content, rendererOptions);
    var rendererOptions = setupOptions(filePath, options);
    content = ejsRenderer(content, rendererOptions);
    rendererOptions.parentPath = filePath;
    return content;
}

module.exports = xejs;
