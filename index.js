"use strict";

const defaultTags = require('./app/tag_parser').defaultTags;
const xejs = require('./app/renderer');


function setOptions(renderingOptions, args) {
    let tokens = defaultTags;
    if (renderingOptions.tokens) tokens = tokens.concat(renderingOptions.tokens);
    return {
        openTagEJS: "<%- ",
        closeTagEJS: "%>",
        tagRegex: /<%/g,
        openTag: renderingOptions.openTag || "{{",
        closeTag: renderingOptions.closeTag || "}}",
        commentTag: renderingOptions.commentTag || "#",
        ejsEscape: renderingOptions.ejsEscape === false ? false : true,
        tokens: tokens,
        args: args || {},
        renderedStack: []
    };
}

//TODO: Avoid repeating code
function renderFile(file, renderingOptions, args, done) {
    if (!done && typeof args === "function") {
        done = args;
        args = [];
    } else if (!done && !args && typeof renderingOptions === "function") {
        done = renderingOptions;
        renderingOptions = {};
    }

    const options = setOptions(renderingOptions, args);

    let res = null;
    let err = null;
    try {
        res = xejs.renderFile(file, options);
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
}

// TODO: avoid repeating code
function renderString(content, renderingOptions, args, done) {
    if (!done && typeof args === "function") {
        done = args;
        args = [];
    } else if (!done && !args && typeof renderingOptions === "function") {
        done = renderingOptions;
        renderingOptions = {};
    }

    const options = setOptions(renderingOptions, args);
    const includePath=renderingOptions.includePath;

    let res = null;
    let err = null;
    try {
        res = xejs.renderString(content, options, includePath);
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
}

module.exports = renderFile;
module.exports.renderFile = renderFile;
module.exports.renderString = renderString;
