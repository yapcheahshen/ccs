// gen_colls.js
var glob=require("glob"), fs=require("fs");
var target="components/ccs-dataset/"; // 前置準備資料存放 工作資料夾
var colls=[]; // 集訊原碼
var convertfile=function(fn) {
	var txt=fs.readFileSync(fn,"utf8");
	var C=txt.split(/<_ id=".+?"\/>.*\r\n/); // 以 <_ id=.../> 區隔 集訊
	var coCount=colls.length;
	console.log(fn,C.length-1,'colls from',coCount,'to',coCount+C.length-2)
	C.forEach(function(coll,ic){ // 針對 每 集訊 coll
		coll.replace(/^　*<coll.*?>(.+?)</,function(m,m1){
			coll=coll.replace(/<\ed>/g,'<\ed><br>');
			coll=coll.replace(/<ti/g,'<br><ti');
			coll=coll.replace(/JUAN/g,'卷');
			coll=coll.replace(/　*<note>/g,'<br><br><note>');
			coll=coll.replace(/\r\n　/g,'<br>');
			coll=coll.replace(/\r\n<pb.*?\/>/g,'');
			coll=coll.replace(/<br>(　*<br>)+<ti/g,'<br><ti');
			coll=coll.replace(/\r\n/g,'');
			colls.push(coll);
		});
	});
}
glob("guanglu/*.xml",function(err,gfiles){
	gfiles.map(convertfile);
	glob("zonglu/*.xml",function(err,zfiles){
		zfiles.map(convertfile);
		for (var i=0;i<colls.length;i++) {
			colls[i]=JSON.stringify(colls[i],"","").replace(",[]","");
		}
		fs.writeFileSync(target+"colls.js","module.exports=["+colls.join(",\n")+"]","utf8");
	})
});
