XEJS
====
_By @angrykoala_

[![npm version](https://badge.fury.io/js/xejs.svg)](https://badge.fury.io/js/xejs)
[![Build Status](https://travis-ci.org/angrykoala/xejs.svg?branch=master)](https://travis-ci.org/angrykoala/xejs)
[![codecov](https://codecov.io/gh/angrykoala/xejs/branch/master/graph/badge.svg)](https://codecov.io/gh/angrykoala/xejs)


>**eXtreme EJS**

XEJS allows you to render files with a custom tag-based language using [EJS](https://github.com/mde/ejs). Useful to create your own tags when developing a rendering application.

> Recursive templating, what could go wrong?

> **WARNING:** Xejs is still unstable and under heavy development, please, if you are using xejs as a dependency in your project use `~` (tilde) instead of `^`(caret) in your package.json to avoid unexpected changes until version 1.0 is reached.

## How it works
**xejs** provides a custom renderer utility on top of **ejs**, allowing you to define your own tags of the type `{{ my tag }}` with custom delimiters (e.g. `<< my tag >>`).

**xejs** will then match your custom _regex_ rules (e.g. `/[Tt]itle/`) and map it to a string to be renderer by _ejs_ using your arguments.

The original **EJS** tags of the file (`<% %>`) will be escaped and won't be rendered by xejs

## Usage

`xejs("File path",options,args,done)`

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

This code will render all {{ bold [my text] }} into html `<b>` text

### Default tags
The tag `include` is already implemented, allowing you to recursively load (and render) other files.

Any tag starting on commentTag will not be rendered (`{{# a comment}}`)

### Examples:
Using the tags delimiters `{{ ... }}`

* `/[Tt]itle/` - `"title"` will translate any tag of the type `{{ title }}` or `{{Title}}` into a valid `<%- title %>` ejs tag which will be rendered by ejs. Then, ejs will use yout `title` argument (wether is a variable or a function) to generate the content.

* `/[Tt]itle2/` - `"'title'"` will render all `{{title}}` tags into the string `"title"`, without the need of extra arguments.

>**Warning:** Only simple tags allowed, nested tags and html-based tags not supported
