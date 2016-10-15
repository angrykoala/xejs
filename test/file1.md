# Xejs Test

Second file twice:

{{ Include file2.md }}

{{ INCLUDE file2.md }}

message

{{ message }}

{{
    message
    }}



Now a custom command loop:

{{loop(Inside loop,10)}}
loop end

A code file:

```js
{{include ../package.json}}
```
_package.json_

<% should not be parsed %>

## Nested include

{{ include file5.md }}

## Inline include
This {{include file2.md}} contains file2
