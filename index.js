var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var render = ejs.render;


var tokens = [
    [/include\s+(.+)/, "- xejs(\"$1\")"],
    [/log\s(.+)/, "console.log(\"$1\")"]
];

var options;
var parentPath;

function generateTokenRegex(token) {
    return new RegExp(options.openTag + "\\s*" + token.source + "\\s*" + options.closeTag, "g");
}

function replaceTokens(content) {
    for (var i = 0; i < tokens.length; i++) {
        var reg = generateTokenRegex(tokens[i][0]);
        content = content.replace(reg, options.openTagEJS + tokens[i][1] + options.closeTagEJS);
    }
    return content;
}

var xejs = function(file) {
    try {
        if (parentPath) file = path.join(parentPath, "../", file);
        parentPath = file;
        var content = fs.readFileSync(file, 'utf-8');
        var regexp = new RegExp(options.openTag + "\\s*include (.+)\\s*" + options.closeTag, "g");
        content = content.replace(options.tagRegex, options.openTagEJS + "%");
        //content = content.replace(regexp, options.openTagEJS + "- xejs('$1');" + options.closeTagEJS);
        content = replaceTokens(content);

        content = render(content, {
            xejs: xejs
        });
        return content;
    } catch (e) {
        console.log("XEJS error", e);
        return "";
    }
};

module.exports = function(file, renderingOptions) {
    options = {
        openTagEJS: "<%",
        closeTagEJS: "%>",
        tagRegex: /<%/g,
        openTag: renderingOptions.openTag || "{{",
        closeTag: renderingOptions.closeTag || "}}"
    };
    parentPath="";
    return xejs(file);
};
