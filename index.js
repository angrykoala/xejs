var defaultTags = require('./app/tag_parser').defaultTags;
var xejsRenderer = require('./app/renderer');

module.exports = function(file, renderingOptions, args, done) {
    var tokens = defaultTags;
    if (renderingOptions.tokens) tokens = tokens.concat(renderingOptions.tokens);
    if (!done && typeof args === "function") done = args;
    else if (!done && !args && typeof renderingOptions === "function") done = renderingOptions;

    var options = {
        openTagEJS: "<%- ",
        closeTagEJS: "%>",
        tagRegex: /<%/g,
        openTag: renderingOptions.openTag || "{{",
        closeTag: renderingOptions.closeTag || "}}",
        commentTag: renderingOptions.commentTag || "#",
        ejsEscape: renderingOptions.ejsEscape === false ? false : true,
        tokens: tokens,
        args: args || {}
    };
    var res = null;
    var err = null;
    try {
        res = xejsRenderer(file, options);
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
};
