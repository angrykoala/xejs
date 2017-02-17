"use strict";

//Default tags to add
const defaultTokens = [
    [/include\s+(\S+)/i, "xejs(\"$1\",options,parentPath)"]
];

class TagParser {
    constructor(options) {
        this.openTagEJS = options.openTagEJS || "<%- ";
        this.closeTagEJS = options.closeTagEJS || "%>";
        this.openTag = options.openTag || "{{";
        this.closeTag = options.closeTag || "}}";
        this.commentTag = options.commentTag || "#";
    }

    //Replace tags of content
    replaceTags(content, tokens) {
        content = this.stripComments(content);

        for (let i = 0; i < tokens.length; i++) {
            const reg = this.generateTagRegex(tokens[i][0]);
            let command = tokens[i][1];
            content = content.replace(reg, this.replaceCallback.bind(this, command));
        }
        return content;
    }

    //Callback to be called on each replaced string
    replaceCallback() {
        let params = Array.prototype.slice.call(arguments);
        let command = params.shift();
        let result = this.openTagEJS + command + this.closeTagEJS;
        for (let i = 1; i < params.length - 2; i++) {
            let elem = this.escapeToken(params[i]);
            result = result.replace("$" + i, elem);
        }
        return result;
    }

    // Removes all comments
    stripComments(content) {
        const commentRegex = this.generateTagRegex(/[\s\S]*/i, true);
        content = content.replace(commentRegex, "");
        return content;
    }

    // Generates regex from token
    generateTagRegex(token, commentTag) {
        commentTag = commentTag || false;
        let modifier = "g";
        if (token.ignoreCase) modifier += "i";

        let openTag = this.openTag;
        if (commentTag) openTag += this.commentTag;

        let tokenString = token.source;
        tokenString = tokenString.replace(/\\s/g, "\ ");
        tokenString = "\\ *?" + tokenString + "?\\ *?";

        return new RegExp(openTag + tokenString + this.closeTag, modifier);
    }

    escapeToken(input) {
        return input.replace(/(["'<%>=-])/g, "\\$1");
    }

}

function parseTag(content, tokens, options) {
    const parser = new TagParser(options);
    const res = parser.replaceTags(content, tokens);
    return res;
}

parseTag.defaultTags = defaultTokens;

module.exports = parseTag;
