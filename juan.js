/* find out the distribution of juan
*/
var glob=require("glob");
var fs=require("fs");
var juans={};
var juan_analysis=function(fn) {
	console.log(fn)
	var content=fs.readFileSync(fn,"utf8");
	content.replace(/j="(\d+)"/g,function(m,m1){
		if (!juans[m1]) juans[m1]=0;
		juans[m1]++;
	})
}
var finalize=function() {
	var out=[];
	for (var i in juans) {
		out.push([parseInt(i),juans[i]]);
	}
	out.sort(function(a,b){
		return ((b[1]<<14)+b[0]) - ((a[1]<<14)+a[0]);
	});
	out2=out.map(function(o){return o[1]+" books has "+o[0]+" juan"})
	
	fs.writeFileSync("juans.txt",out2.join("\n"),"utf8");
}
glob("guanglu/*.xml",function(err,files){
	files.map(juan_analysis,"g");
	glob("zonglu/*.xml",function(err,files2){
		files2.map(juan_analysis,"z");
		finalize();
	})
});
