"use strict";
// Tag manipulation

const defaultTokens = [
    [/include\s+(\S+)/i, "xejs(\"$1\",options,parentPath)"]
];


function stripComments(content, options) {
    const commentOptions = {
        openTag: options.openTag + options.commentTag,
        closeTag: options.closeTag
    };
    const commentRegex = generateTagRegex(/[\s\S]*/i, commentOptions);
    content = content.replace(commentRegex, "");
    return content;
}

function generateTagRegex(token, options) {
    let modifier = "g";
    if (token.ignoreCase) modifier += "i";
    let tokenString = token.source;
    tokenString = tokenString.replace(/\\s/g, "\ ");
    tokenString = "\\ *?" + tokenString + "?\\ *?";

    return new RegExp(options.openTag + tokenString + options.closeTag, modifier);
}

function escapeToken(input) {
    return input.replace(/(["'<%>=-])/g, "\\$1");
}

function replaceTags(content, tokens, options) {
    function replaceCallback() {
        let result = options.openTagEJS + command + options.closeTagEJS;
        for (let i = 1; i < arguments.length - 2; i++) {
            let elem = escapeToken(arguments[i]);
            result = result.replace("$" + i, elem);
        }
        return result;
    }


    content = stripComments(content, options);

    for (let i = 0; i < tokens.length; i++) {
        const reg = generateTagRegex(tokens[i][0], options);
        //var required for scope purposes
        var command = tokens[i][1]; // jshint ignore:line
        content = content.replace(reg, replaceCallback);
    }
    return content;
}

replaceTags.defaultTags = defaultTokens;

module.exports = replaceTags;
