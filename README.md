XEJS
====
_By @angrykoala_

[![npm version](https://badge.fury.io/js/xejs.svg)](https://badge.fury.io/js/xejs)
[![Build Status](https://travis-ci.org/angrykoala/xejs.svg?branch=master)](https://travis-ci.org/angrykoala/xejs)
[![codecov](https://codecov.io/gh/angrykoala/xejs/branch/master/graph/badge.svg)](https://codecov.io/gh/angrykoala/xejs)


>**eXtreme EJS**

Xejs allows you to render files with a custom tag-based language using [EJS](https://github.com/mde/ejs). Useful to create a custom tag-based language for templating, rendering and transpilers applications.

> Recursive templating, what could go wrong?

> **WARNING:** Xejs is still unstable and under heavy development, please, if you are using xejs as a dependency in your project use `~` (tilde) instead of `^`(caret) in your package.json to avoid unexpected changes until version 1.0 is released.

## How does it works
**xejs** provides a custom renderer utility on top of **ejs**, allowing you to define your own tags of the type `{{ mytag }}` with custom delimiters (e.g. `<< mytag >>`).

**xejs** will then match your custom _regex_ rules (e.g. `/[Tt]itle/`) and map them to a string to be renderer by _ejs_ using the provided arguments.

Only strict matched tags will be parsed, meaning that even if the opening closing tags exists, it won't be parsed unless the content matches the regex rules. This way almost never will be necessary to escape characters when using xejs.

The original **EJS** tags of the file (`<% %>`) will be escaped and won't be rendered by xejs.

## Usage
> API for xejs > 0.7    


```js
const xejs=require('xejs');
const fs=require('fs');

const myRenderer=new xejs({
    options:{
        openTag: "{{",
        closeTag: "}}"
    },
    tokens: [
        [/bold\s(.+)/, "'<b>$1</b>'"],
        [/msg/, "msg"]
    ],
    args:{
        msg: "<p>Hello World</p>"        
    }
});


myRenderer.render("testFile", function(err,file){
    fs.writeFileSync("renderedFile",file);
});
```

This code will render all {{ bold [my text] }} into html `<b>` text and {{msg}} into `"<p>Hello World</p>"`

#### Xejs constructor parameters
All parameters are part of the object passed to the constructor. All are optional.
* **options**: Provides the configuration to be used by the parser
    * `openTag`: _string_ Represents the opening of the tag. default: `{{`.
    * `closeTag`: _string_ Represents the ending of the tag. default: `}}`.
    * `commentTag`: _string_ Represents the mark of a comment tag that won't be rendered. Comment tag will be used next to the open tag. default: `#` (A default comment would be {{# my comment}}).
    * `ejsEscape`: _boolean_ If set to true, ejs tags (`<% %>`) will be escaped before rendering, to avoid ejs code injection. If false, xejs would act as an extension of a simple ejs parser. default: `true`.
    * `singleTag`: _boolean_ If set to true, only opening tokens will be used (e.g. `@msg`). While using this option, closeTag option will be ignored.
    * `defaultTokens`: _boolean_ disable default tokens (`include`).
* **tokens**: An array of pairs, representing the regex tokens to match and the substitution. Each pair would be of the style [/tagRegex/,"tagCommand"].
    * The first element of each pair represents a regex to match, it can use the `i` modifier and capturing groups `(...)` to use `$` arguments. This regex will automatically be compiled into a valid xejs regex, adding the open and closing tags.
    * The second argument is a string representing a js expression. The expression will be executed by ejs and the result will be added in the place of the tag. Any js expression could be used, but it is recommended to make use of functions specified in `args` parameters. To change the tag for a string, simply add simple quotes to the string `"'string to replace, not js code'"`.
    * By default, xejs will preload the token `{{ include myfile }}` to recursively parse and include other files using xejs.
* **args**: args will be a simple object of variables and functions to be added to the scope of the xejs parser, allowing to execute function, or use common variables as part of the rendering process.

#### Xejs render method
3 different interfaces are provided in a xejsRenderer:
* `renderFile(file,done)`: Will render given file, executing `done(err,res)` afterwards, if no callback is provided, a Promise will be returned.
* `render(file,done)`: Sugar-syntax for renderFile.
* `renderString(content, includePath, done)`: Will render given content string, executing `done(err,res)` afterwards, if no callback is provided, a Promise will be returned.
    * The _optional_ argument `includePath` defines the path to use for include routing. If none provided, the current cwd path will be used.

>In all 3 methods, a Promise will be returned if no callback is defined. However, the promise won't be returned otherwise.

#### Examples:
Using the tags delimiters `{{ ... }}`

* `/[Tt]itle/` - `"title"` will translate any tag of the type `{{ title }}` or `{{Title}}` into a valid `<%- title %>` ejs tag which will be rendered by ejs. Then, ejs will use yout `title` argument (whether is a variable or a function) to generate the content.

* `/[Tt]itle2/` - `"'title'"` will render all `{{title2}}` tags into the string `"title"`, without the need of extra arguments.

>**Warning:** Only simple tags allowed, nested tags and html-based tags not supported


### Deprecated API
> For xejs<0.7

The following example shows the deprecated usage of xejs for versions before 0.7

This API and documentation is no longer maintained.
```js
var xejs=require('xejs');
var fs= require('fs');


var options={
    openTag: "{{",
    closeTag: "}}",
    commentTag: "#",
    tokens: [
        [/bold\s(.+)/, "'<b>$1</b>'"]
    ]
};


xejs("example/test.ejs",options,{}, function(err,file){
    fs.writeFileSync('example/prueba.html',file);
});
```

### License
Xejs is being developed and maintained as Open-Source software by @angrykoala (https://github.com/angrykoala) licensed under [GNU GENERAL PUBLIC LICENSE version 3](https://github.com/angrykoala/xejs/blob/master/LICENSE)

The original source code can be found at: <https://github.com/angrykoala/xejs>
