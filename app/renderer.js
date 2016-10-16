var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var render = ejs.render;

var tagParser = require('./tag_parser');


function getDirname(file, parentPath) {
    var dirname = file;
    if (parentPath) dirname = path.join(parentPath, "../", file);
    return dirname;
}

function parseContent(dirname, options) {
    var content = fs.readFileSync(dirname, 'utf-8');
    if (options.ejsEscape !== false) content = content.replace(options.tagRegex, "<%%");
    return tagParser(content, options.tokens, options);
}

function setupOptions(dirname, options) {
    var rendererOptions = options.args || {};
    rendererOptions.xejs = xejs;
    rendererOptions.parentPath = dirname;
    rendererOptions.options = options;
    return rendererOptions;
}

function xejs(file, options, parentPath) {
    var dirname = getDirname(file, parentPath);
    var content = parseContent(dirname, options);
    var rendererOptions = setupOptions(dirname, options);
    content = render(content, rendererOptions);
    rendererOptions.parentPath = parentPath;
    return content;
}


module.exports = xejs;
