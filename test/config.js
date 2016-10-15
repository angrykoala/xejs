function loop(data, times) {
    var res = "";
    for (var i = 0; i < times; i++) {
        res += data + "\n";
    }
    return res;
}


module.exports = {
    options: {
        tokens: [
            [/loop[\s]*\((.*),([0-9]*)\)/, "loop('$1','$2')"],
            [/message/, "msg"]
        ]
    },
    args: {
        loop: loop,
        msg: "Hello World"
    },
    regex: {
        match: [
            /# Xejs Test/,
            /Second file twice:\s+(## Second file\s+Second file content\s+){2}/,
            /message\s+Hello World\s+\{\{\s+message\s+\}\}/,
            /Now a custom command loop:\s+(Inside loop\s){10}\s*loop end/,
            /A code file:\s+```js\s+{[\s\S]*\}\s+```\s+_package\.json_/,
            /<%\sshould\snot\sbe\sparsed\s%>/,
            /## Nested include\s+## Included file\s+## Second file\s+Second file content/,
            /## Inline include\sThis ## Second file\s+Second file content\s contains file2/
        ],
        notMatch: [
            /\{\{ Include file2\.md \}\}/i,
            /\{\{include \.\.\/package\.json\}\}/i
        ]
    }
};
