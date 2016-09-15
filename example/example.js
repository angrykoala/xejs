var xejs=require('../index.js');
var fs=require('fs');

var options={
tokens:[[/loop[\s]*\((.*),([0-9]*)\)/,"- loop('$1','$2')"]]
};


function loop(data,times){
    var res="";
    for(var i=0;i<times;i++){
        res+=data+"\n";
    }
    return res;
}

var parsedFile=xejs(__dirname+'/file1.md',options,{loop:loop});
fs.writeFileSync('resultFile.md',parsedFile);
