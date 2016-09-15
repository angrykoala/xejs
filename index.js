var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var render = ejs.render;


var defaultTokens = [
    [/include\s+(\S+)/, "- xejs(\"$1\",options,parentPath)"],
    [/log\s(.+)/, "console.log(\"$1\")"]
];

var includeToken=defaultTokens[0];

function generateTokenRegex(token, options) {
    return new RegExp(options.openTag + "\\s*?" + token.source + "?\\s*?" + options.closeTag, "g");
}

function escapeToken(input) {
    var res = input.replace(/(["'<%>=-])/g, "\\$1");
    return res;
}

function replaceTokens(content, tokens, options) {
    for (var i = 0; i < tokens.length; i++) {
        var reg = generateTokenRegex(tokens[i][0], options);
        var command=tokens[i][1];
        content = content.replace(reg, function() {
            var result=options.openTagEJS + command + options.closeTagEJS;
            for(var i=1;i<arguments.length-2;i++){
                var elem=escapeToken(arguments[i]);
                result=result.replace("$"+i,elem);    
            }
            return result;
        });
    }
    return content;
}

var xejs = function(file, options, parentPath) {
    try {
        var dirname=file;
        if (parentPath) dirname = path.join(parentPath, "../", file);
        var content = fs.readFileSync(dirname, 'utf-8');
        content = content.replace(options.tagRegex, options.openTagEJS + "%");
        content = replaceTokens(content, options.tokens, options);

        var rendererOptions=options.args || {};
        rendererOptions.xejs=xejs;
        rendererOptions.parentPath=dirname;
        rendererOptions.options=options;
        content = render(content, rendererOptions);
        rendererOptions.parentPath=parentPath;
        return content;
    } catch (e) {
        console.log("XEJS error:", e);
        return "";
    }
};

module.exports = function(file, renderingOptions, args) {
    var tokens = defaultTokens;
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
