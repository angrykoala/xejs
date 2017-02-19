"use strict";

//Default tokens to be rendered everytime
const defaultTokens = [
    [/include\s+(\S+)/i, "xejs(\"$1\",options,parentPath)"]
];

class TagParser {
    constructor(options, tokens) {
        this.openTagEJS = options.openTagEJS || "<%- ";
        this.closeTagEJS = options.closeTagEJS || "%>";
        this.openTag = options.openTag || "{{";
        this.closeTag = options.closeTag || "}}";


        const commentTag = options.commentTag || "#";
        this.compileCommentTag(commentTag);

        this.setTokens(tokens);
    }

    //Will set and compile tokens
    setTokens(tokens) {
        tokens = tokens || [];
        this.tokens = tokens.map((tokenData) => {
            //TODO: check tokens? throw if not valid
            const reg = this.compileTag(tokenData[0]);
            return [reg, tokenData[1]];
        });
    }

    //Replace tags of content
    replaceTags(content) {
        content = this.stripComments(content);

        for (let t of this.tokens) {
            content = content.replace(t[0], this.replaceCallback.bind(this, t[1]));
        }
        return content;
    }

    //Callback to be called on each replaced string
    replaceCallback() {
        let params = Array.prototype.slice.call(arguments);
        const command = params[0];
        params = params.slice(2, params.length - 2);
        let result = this.openTagEJS + command + this.closeTagEJS;

        for (let i = 0; i < params.length; i++) {
            const paramValue = "$" + (i + 1);
            const elem = this.escapeToken(params[i]);
            result = result.replace(paramValue, elem); //TODO: check what happens if params are wrong
        }
        return result;
    }

    // Removes all comments
    stripComments(content) {
        content = content.replace(this.commentRegex, "");
        return content;
    }

    // Generates regex from token
    compileTag(token) {
        return generateTagRegex(token, this.openTag, this.closeTag);
    }

    // Generates comment regex
    compileCommentTag(commentTag) {
        const token = /[\s\S]*/i;
        const openTag = this.openTag + commentTag;
        this.commentRegex=generateTagRegex(token, openTag, this.closeTag);
    }

    escapeToken(input) {
        return input.replace(/(["'<%>=-])/g, "\\$1");
    }
}

//Helper (private) functions

//Returns final regex for a xejs tag
function generateTagRegex(token, openTag, closeTag) {
    let tokenString = token.source;
    const modifier = token.ignoreCase ? "gi" : "g";

    tokenString = tokenString.replace(/\\s/g, "\ ");
    tokenString = "\\ *?" + tokenString + "?\\ *?";

    return new RegExp(openTag + tokenString + closeTag, modifier);
}




//Temporal entry function
function parseTag(content, tokens, options) {
    const parser = new TagParser(options, tokens);
    const res = parser.replaceTags(content);
    return res;
}

parseTag.defaultTags = defaultTokens;

module.exports = parseTag;
