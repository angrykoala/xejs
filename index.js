var ejs=require('ejs');
var fs=require('fs');

ejs.renderFile("test.ejs", {
    openTag: "<%",
    closeTag: "%>",
    render: ejs.render,
    fs: fs,
    tagRegex: /<%/g
    
}, function(err,res){
    console.log(err);
    fs.writeFile("result.html",res,function(){
        console.log("finished");
    });    
});
