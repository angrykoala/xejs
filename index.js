var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var render = ejs.render;

var tagParser = require('./app/tag_parser');


var xejs = function(file, options, parentPath) {
    var dirname = file;
    if (parentPath) dirname = path.join(parentPath, "../", file);
    var content = fs.readFileSync(dirname, 'utf-8');
    if(options.ejsEscape!==false) content = content.replace(options.tagRegex, "<%%");
    content = tagParser(content, options.tokens, options);

    var rendererOptions = options.args || {};
    rendererOptions.xejs = xejs;
    rendererOptions.parentPath = dirname;
    rendererOptions.options = options;
    content = render(content, rendererOptions);
    rendererOptions.parentPath = parentPath;
    return content;
};

module.exports = function(file, renderingOptions, args, done) {
    var tokens = tagParser.defaultTags;
    if (renderingOptions.tokens) tokens = tokens.concat(renderingOptions.tokens);
    if(!done && typeof args==="function") done=args;
    else if(!done && !args &&  typeof renderingOptions==="function") done=renderingOptions;

    var options = {
        openTagEJS: "<%- ",
        closeTagEJS: "%>",
        tagRegex: /<%/g,
        openTag: renderingOptions.openTag || "{{",
        closeTag: renderingOptions.closeTag || "}}",
        ejsEscape: renderingOptions.ejsEscape===false ? false:true,
        tokens: tokens,
        args: args || {}
    };
    var res = null;
    var err = null;
    try {
        res = xejs(file, options, "");
    } catch (e) {
        err=e;
    }
    if(done) return done(err,res);
    else {
        return new Promise(function(resolve, reject) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    }
};
