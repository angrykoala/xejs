var xejs=require('./index');
var fs= require('fs');

var options={
    openTag: "{{",
    closeTag: "}}"
};


var file=xejs("example/test.ejs",options);

fs.writeFileSync('example/prueba.html',file);
