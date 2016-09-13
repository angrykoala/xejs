XEJS
====
_By @angrykoala_
**eXtreme EJS**, 

XEJS allows you to render files using a custom tag-based language using [EJS](https://github.com/mde/ejs)

> Recursive templating, what could go wrong?

## How it works
**xejs** provides a custom renderer utility on top of **ejs**, allowing you to define your own tags of the type `{{ my tag }}` with custom delimiters (`<< my tag >>`).

**xejs** will then match your custom _regex_ rules (e.g. `/[Tt]itle/`) and map it to a string to be renderer by _ejs_.

The original **EJS** tags of the file (`<% %>`) will be escaped and won't be rendered by xejs

### Examples:
Using the tags delimiters `{{ ... }}`

* `/[Tt]itle/` - `"= title"` will translate any tag of the type `{{ title }}` or `{{Title}}` into a valid `<%- title %>` ejs tag which will be rendered by ejs.



>**Warning:** Only simple tags allowed, nested tags and html-based tags not supported
