var xejs=require('./index');
var fs= require('fs');

var options={
    openTag: "{{",
    closeTag: "}}",
    tokens: [
        [/bold\s(.+)/, "- '<b>$1</b>'"]
    ]
};


var file=xejs("example/test.ejs",options);

fs.writeFileSync('example/prueba.html',file);
