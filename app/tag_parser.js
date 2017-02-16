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

    replaceCallback() {
        let params = Array.prototype.slice.call(arguments);
        let command=params.shift();
        let result = this.openTagEJS + command + this.closeTagEJS;
        for (let i = 1; i < params.length - 2; i++) {
            let elem = this.escapeToken(params[i]);
            result = result.replace("$" + i, elem);
        }
        return result;
    }

    //Replace tags of content
    replaceTags(content, tokens) {
        content = this.stripComments(content);

        for (let i = 0; i < tokens.length; i++) {
            const reg = this.generateTagRegex(tokens[i][0]);
            //var required for scope purposes
            let command = tokens[i][1]; // jshint ignore:line
            content = content.replace(reg, this.replaceCallback.bind(this,command));
        }
        return content;
    }

    // Removes all comments
    stripComments(content) {
        const commentRegex = this.generateCommentTagRegex(/[\s\S]*/i);
        content = content.replace(commentRegex, "");
        return content;
    }

    // Generates regex from token
    generateTagRegex(token) {
        let modifier = "g";
        if (token.ignoreCase) modifier += "i";
        let tokenString = token.source;
        tokenString = tokenString.replace(/\\s/g, "\ ");
        tokenString = "\\ *?" + tokenString + "?\\ *?";

        return new RegExp(this.openTag + tokenString + this.closeTag, modifier);
    }
    // Generates regex from token
    generateCommentTagRegex(token) {
        let modifier = "g";
        if (token.ignoreCase) modifier += "i";
        let tokenString = token.source;
        tokenString = tokenString.replace(/\\s/g, "\ ");
        tokenString = "\\ *?" + tokenString + "?\\ *?";

        return new RegExp(this.openTag + this.commentTag + tokenString + this.closeTag, modifier);
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
