"use strict";

//Default tokens to be rendered everytime
const defaultTokens = [
    [/include\s+(\S+)/i, "xejs(\"$1\",parentPath)"]
];

const parserConst = {
    tagRegex: /<%/g,
    openTagEJS: "<%-",
    closeTagEJS: "%>",
    singleTagClose: "(?=\\s)"
};

module.exports = class Parser {
    constructor(options, tokens) {
        options = options || {};


        this.openTag = options.openTag || "{{";
        this.closeTag = options.closeTag || "}}";
        this.ejsEscape = options.ejsEscape !== false;
        this.singleTag = options.singleTag === true;
        this.defaultTokens = options.defaultTokens !== false;

        this.setCommentTag(options.commentTag);
        this.setTokens(tokens);
    }

    //Replace tags of content
    execute(content) {
        content = this.escapeEJS(content);
        content = this.stripComments(content);

        for (let t of this.tokens) {
            content = content.replace(t[0], this.replaceCallback.bind(this, t[1]));
        }
        return content;
    }

    //Private

    //Will set and compile tokens
    setTokens(tokens) {
        tokens = tokens || [];
        if(this.defaultTokens) tokens = tokens.concat(defaultTokens);
        this.tokens = tokens.map((tokenData) => {
            //TODO: check tokens? throw if not valid
            const reg = this.compileTag(tokenData[0]);
            return [reg, tokenData[1]];
        });
    }

    setCommentTag(commentTag) {
        commentTag = commentTag || "#";
        commentTag = this.openTag + commentTag;
        this.commentRegex = this.compileTag(/[\s\S]*/i, commentTag);
    }

    escapeEJS(content) {
        if (this.ejsEscape) content = content.replace(parserConst.tagRegex, "<%%");
        return content;
    }

    //Callback to be called on each replaced string
    replaceCallback() {
        let params = Array.prototype.slice.call(arguments);
        const command = params[0];
        params = params.slice(2, params.length - 2);
        let result = parserConst.openTagEJS + command + parserConst.closeTagEJS;

        if (this.singleTag) {
            const firstSpace = params.shift();
            if (firstSpace === undefined || firstSpace === null) throw "Problem parsing single tags";
            result = firstSpace + result;
        }

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
    compileTag(token, openTag) {
        let closeTag = this.closeTag;
        openTag = openTag || this.openTag;

        if (this.singleTag) {
            closeTag = parserConst.singleTagClose;
            openTag = "(\\s|^)" + openTag;
        }
        return generateTagRegex(token, openTag, closeTag, this.singleTag);
    }

    escapeToken(input) {
        return input.replace(/(["'<%>=-])/g, "\\$1");
    }
};

//Helper (private) functions

//Returns final regex for a xejs tag
function generateTagRegex(token, openTag, closeTag, singleTag) {
    let tokenString = token.source;
    const modifier = token.ignoreCase ? "gi" : "g";

    tokenString = tokenString.replace(/\\s/g, "\ ");
    if (singleTag) {
        tokenString = tokenString + "?";
    } else {
        tokenString = "\\ *?" + tokenString + "?\\ *?";
    }
    return new RegExp(openTag + tokenString + closeTag, modifier);
}
