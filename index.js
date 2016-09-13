var ejs = require('ejs');
var fs = require('fs');

var render = ejs.render;

function xejs(file, options) {
    try {
        var content = fs.readFileSync(file, 'utf-8');
        var regexp = new RegExp(options.openTag + "\\s*include (.+)\\s*" + options.closeTag, "g");
        content = content.replace(options.tagRegex, options.openTagEJS + "%");
        content = content.replace(regexp, options.openTagEJS + "- xejs('$1',options)" + options.closeTagEJS);
        content = render(content, {
            xejs: xejs,
            options: options,
            fs: fs,
            render: render
        });
        return content;
    } catch (e) {
        console.log("XEJS error", e);
        return "";
    }
}

module.exports = function(file, options) {
    var renderingOptions = {
        openTagEJS: "<%",
        closeTagEJS: "%>",
        tagRegex: /<%/g,
        openTag: options.openTag || "{{",
        closeTag: options.closeTag || "}}"
    };

    xejs(file, renderingOptions);
};
