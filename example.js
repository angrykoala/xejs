var xejs=require('./index');
var fs= require('fs');

var options={
    openTag: "{{",
    closeTag: "}}"
};


var file=xejs("example/test.ejs",options);

fs.writeFileSync('example/prueba.html',file);

var file=xejs("example2/mdtest1.md",options);

fs.writeFileSync('example2/result.md',file);
