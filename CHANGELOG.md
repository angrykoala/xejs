0.7.1 / 2017-03-07
==================

    * Added flag to disable default tokens
    * Tests better organized and regexes slightly improved
    * Added Promises support again
    * Readme small improvements

0.7.0 / 2017-03-03
==================

  * Single tag support (e.g. @include file.md)
  * Changes in external API, now using a class instead of function.
  * Internal refactor on main file
  * Tests updated for new API
  * Removed promises API support (temporally) to avoid "Unhandled promise rejection" errors
  * Readme file updated

0.6.2 / 2017-02-20
==================

  * Internal refactor on TagParser and Renderer (now classes instead of functions)
  * Main file code refactor
  * Internal API Changed (external API unchanged)
  * Main file renamed from index.js to main.js
  * Test "Case insensitive tokens" added
  * Removed unnecessary redundant code flows resulting in a better test coverage
  * Travis node versions updated to cover main supported versions
  * EJS updated from 2.5.5 to 2.5.6

0.6.1 / 2017-02-14
==================

  * Dev dependencies updated (mocha and ejs)
  * Contributing file updated
  * Added custom tags and custom comments tags test
  * Syntax updated to latest ES
  * Added jshint to tests

0.6.0 / 2016-10-22
==================

  * Error thrown if detected circular dependencies on include
  * Support for rendering from string
  * Node.js updated in CI tests

0.5.0 / 2016-10-15
==================

  * Include tests improved
  * Added a CONTRIBUTING file to the project
  * Promises interface supported
  * Comment tags supported (default to `{{# comment }}`)

0.4.0 / 2016-10-09
==================

  * Ejs tags escape fixed
  * No escape ejs tags option added
  * Xejs arguments are now optional
  * Readme improved
  * Custom commands now won't need the ejs tag appendix (`-`,`=`)
  * Changelog added

0.3.1 / 2016-09-25
==================

  * CI added
  * Unit tests added
  * Support for node>0.12.15

0.3.0 / 2016-09-23
==================

  * Async fixed

0.2.4 / 2016-09-23
==================

  * Async xejs, errors now returned in callback

0.2.3 / 2016-09-21
==================

  * Removed vertical whitespace from regexes
  * Added badges
  * Code structure improvement

0.2.2 / 2016-09-17
==================

  * Ignore case option added to include tag
  * Regex ignore case option supported

0.2.1 / 2016-09-15
==================

  * Xejs won't crash when no arguments provided

0.2.0 / 2016-09-15
==================

  * Fixed recursive paths problems

0.1.0 / 2016-09-14
==================

  * Code injection problems fixed
  * Custom tokens added
  * Exported function to use xejs as module
