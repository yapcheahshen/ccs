var glob=require("glob"), fs=require("fs");
var colls=[],C;
var convertfile=function(fn) {
	var C=fs.readFileSync(fn,"utf8").split(/<_ id="\d+\.(.+?)"\/>/);
	C.forEach(function(coll){
		var m=coll.match(/<coll>(.+?)<\/coll>/);
		console.log(m);
		exit;
	});
}
var finalize=function(){
	fs.writeFileSync(target+"colls.js","module.exports=["+colls.join(",\n")+"]","utf8");
}
glob("guanglu/*.xml",function(gerr,g){
	if(gerr){
		console.log(gerr);
		return;
	}
	g.map(convertfile,"g");
	glob("zonglu/*.xml",function(zerr,z){
		if(zerr){
			console.log(zerr);
			return;
		}
		z.map(convertfile,"z");
		finalize();
	})
});