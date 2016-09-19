var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var render = ejs.render;

var tagParser=require('./app/tag_parser');


var xejs = function(file, options, parentPath) {
    try {
        var dirname = file;
        if (parentPath) dirname = path.join(parentPath, "../", file);
        var content = fs.readFileSync(dirname, 'utf-8');
        content = content.replace(options.tagRegex, options.openTagEJS + "%");
        content = tagParser(content, options.tokens, options);

        var rendererOptions = options.args || {};
        rendererOptions.xejs = xejs;
        rendererOptions.parentPath = dirname;
        rendererOptions.options = options;
        content = render(content, rendererOptions);
        rendererOptions.parentPath = parentPath;
        return content;
    } catch (e) {
        console.log("XEJS error:", e);
        return "";
    }
};

module.exports = function(file, renderingOptions, args) {
    var tokens = tagParser.defaultTags;
    if (renderingOptions.tokens) tokens = tokens.concat(renderingOptions.tokens);

    var options = {
        openTagEJS: "<%",
        closeTagEJS: "%>",
        tagRegex: /<%/g,
        openTag: renderingOptions.openTag || "{{",
        closeTag: renderingOptions.closeTag || "}}",
        tokens: tokens,
        args: args || {}
    };
    return xejs(file, options, "");
};
