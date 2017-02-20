"use strict";

const TagParser = require('./app/tag_parser');
const Renderer = require('./app/renderer');

const defaultTags = TagParser.defaultTags;

function getTokens(tokens) {
    let res = defaultTags;
    if (tokens) res = res.concat(tokens);
    return res;
}


function renderFile(file, renderingOptions, args, done) {
    return render(file, renderingOptions, args, done, false);
}

function renderString(content, renderingOptions, args, done) {
    return render(content, renderingOptions, args, done, true);
}

function render(file, renderingOptions, args, done, renderString) {
    //Extract this
    if (!done && typeof args === "function") {
        done = args;
        args = [];
    } else if (!done && !args && typeof renderingOptions === "function") {
        done = renderingOptions;
        renderingOptions = {};
    }
    //####

    const tokens = getTokens(renderingOptions.tokens);

    let res = null;
    let err = null;
    try {
        const parser = new TagParser(renderingOptions, tokens);
        const renderer = new Renderer(parser, args);
        if (renderString) {
            const includePath = renderingOptions.includePath;
            res = renderer.renderString(file, includePath); //file is content here
        } else {
            res = renderer.render(file);
        }
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
