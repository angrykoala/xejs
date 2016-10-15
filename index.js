var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var render = ejs.render;

var tagParser = require('./app/tag_parser');

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


module.exports = function(file, renderingOptions, args, done) {
    var tokens = tagParser.defaultTags;
    if (renderingOptions.tokens) tokens = tokens.concat(renderingOptions.tokens);
    if (!done && typeof args === "function") done = args;
    else if (!done && !args && typeof renderingOptions === "function") done = renderingOptions;

    var options = {
        openTagEJS: "<%- ",
        closeTagEJS: "%>",
        tagRegex: /<%/g,
        openTag: renderingOptions.openTag || "{{",
        closeTag: renderingOptions.closeTag || "}}",
        commentTag: renderingOptions.commentTag || "#",
        ejsEscape: renderingOptions.ejsEscape === false ? false : true,
        tokens: tokens,
        args: args || {}
    };
    var res = null;
    var err = null;
    try {
        res = xejs(file, options);
    } catch (e) {
        err = e;
    }
    if (done) return done(err, res);
    return new Promise(function(resolve, reject) {
        if (err) {
            reject(err);
        } else {
            resolve(res);
        }
    });
};
