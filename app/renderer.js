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
    var rendererOptions = options.args || {};
    rendererOptions.xejs = xejs;
    rendererOptions.parentPath = filePath;
    rendererOptions.options = options;
    return rendererOptions;
}

//Avoid repeating code
function xejs(file, options, parentPath) {
    var filePath = getFilePath(file, parentPath);
    if(fileInStack(filePath, options.renderedStack)) throw new Error("Error: Found circular dependencies while parsing xejs");
    options.renderedStack.push(filePath);
    var content = loadFile(filePath);
    content = parseContent(content, options);
    var rendererOptions = optionsSetup(filePath, options);
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
    var rendererOptions = optionsSetup(includePath, options);
    content = ejsRenderer(content, rendererOptions);
    rendererOptions.parentPath = includePath;
    return content;
}

module.exports = {
    renderFile: xejs,
    renderString: renderString
};
