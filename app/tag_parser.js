// Tag manipulation

var defaultTokens = [
    [/include\s+(\S+)/i, "xejs(\"$1\",options,parentPath)"]
];


function stripComments(content, options) {
    var commentOptions = {
        openTag: options.openTag + options.commentTag,
        closeTag: options.closeTag
    };
    var commentRegex = generateTagRegex(/[\s\S]*/i, commentOptions);
    content = content.replace(commentRegex, "");
    return content;
}

function generateTagRegex(token, options) {
    var modifier = "g";
    if (token.ignoreCase) modifier += "i";
    var tokenString = token.source;
    tokenString = tokenString.replace(/\\s/g, "\ ");
    tokenString = "\\ *?" + tokenString + "?\\ *?";

    return new RegExp(options.openTag + tokenString + options.closeTag, modifier);
}

function escapeToken(input) {
    var res = input.replace(/(["'<%>=-])/g, "\\$1");
    return res;
}

function replaceTags(content, tokens, options) {
    function replaceCallback() {
        var result = options.openTagEJS + command + options.closeTagEJS;
        for (var i = 1; i < arguments.length - 2; i++) {
            var elem = escapeToken(arguments[i]);
            result = result.replace("$" + i, elem);
        }
        return result;
    }


    content = stripComments(content, options);

    for (var i = 0; i < tokens.length; i++) {
        var reg = generateTagRegex(tokens[i][0], options);
        var command = tokens[i][1];
        content = content.replace(reg, replaceCallback);
    }
    return content;
}

replaceTags.defaultTags = defaultTokens;

module.exports = replaceTags;
