var glob=require("glob");
var fs=require("fs");
var cid=0;// collection id
var ti={}, pr={} , ticount=0, prcount=0;
var collections=[],collinfos=[];
var titlename=[],author=[],collname=[],pb=0,titlecoll=[];
var target="components/ccs-dataset/";
var parseTitle=function(line) {
	var coll=collections[collections.length-1];
	line.replace(/<ti(.*?)>(.+?)<\/ti>/g,function(m,m1,m2){
		if (!ti[m2]) {
			titlecoll[ticount]=[];
			ti[m2]=++ticount;
		}
		
		titlecoll[ti[m2]-1].push(collections.length-1);
		coll.push(ti[m2]);
	});

	line.replace(/<pr(.*?)>(.+?)<\/pr>/g,function(m,m1,m2){
		if (!pr[m2]) {
			pr[m2]=++prcount;
		}
		coll.push(-pr[m2]); //minus
	});

}
var convertfile=function(fn) {
	var arr=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	for (var i=0;i<arr.length;i++) {
		var s=arr[i];
		if (s.indexOf("<ti")>-1) parseTitle(s);
		else if (s.substr(0,4)=="<pb ") {
			var p=s.substr(7);
			if (p[0]=='"') p=p.substr(1);
			pb=parseInt(p);
		}
		else if (s.indexOf("<coll")>-1) {
			var m=s.match(/<coll.*?>(.*?)<\/coll>/);
			if (m) {
				collections.push([] );
				collinfos.push([this+pb]);
				collname.push(m[1]);
			}

		}
	}
}


var formats=function() {
	for (var i=0;i<collections.length;i++) {
		collections[i]=JSON.stringify(collections[i],"","").replace(",[]","");
	}
	for (var i=0;i<collinfos.length;i++) {
		collinfos[i]=JSON.stringify(collinfos[i],"","").replace(",[]","");
	}

	for (var i=0;i<titlecoll.length;i++) {
		if (titlecoll[i].length==1) {
			titlecoll[i]=JSON.stringify(titlecoll[i][0],"","");
		} else {
			titlecoll[i]=JSON.stringify(titlecoll[i],"","");	
		}
	}

	for (var i in ti) titlename.push(i);
	for (var i in pr) author.push(i);

}
var finalize=function() {
	formats();
	fs.writeFileSync(target+"collections.js","module.exports=["+collections.join(",\n")+"]","utf8");
	fs.writeFileSync(target+"collinfos.js","module.exports=["+collinfos.join(",\n")+"]","utf8");
	fs.writeFileSync(target+"collnames.js","module.exports="+JSON.stringify(collname,""," "),"utf8");
	fs.writeFileSync(target+"titlenames.js","module.exports="+JSON.stringify(titlename,""," "),"utf8");
	fs.writeFileSync(target+"authors.js","module.exports="+JSON.stringify(author,""," "),"utf8");
	fs.writeFileSync(target+"titlecoll.js","module.exports=["+titlecoll.join(",\n")+"]","utf8");
	
}

glob("guanglu/*.xml",function(err,files){
	files.map(convertfile,"g");
	glob("zonglu/*.xml",function(err,files2){
		files2.map(convertfile,"z");
		finalize();
	})
});
