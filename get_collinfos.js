// gen.js 產生 中國古籍叢書目錄檢索 ccs 前置準備資料
// 產生   collnames.js 集名陣列    collnames[集名序號]=人名     coName
// 產生  titlenames.js 書名陣列   titlenames[書名序號]=書名     tiName
// 產生     authors.js 人名陣列      authors[人名序號]=人名     prName
// 產生   titlecoll.js 人集陣列    titlecoll[人名序號]=集名序號 coIndex
// 產生 collections.js 集訊陣列  collections[集名序號]=集訊     coll
var glob=require("glob"), fs=require("fs");
var target="components/ccs-dataset/"; // 前置準備資料存放 工作資料夾
var tiCount=0, tiIndex, ti={}; // tiCount 書名總數, tiIndex 書名序號, ti[書名]=書名序號
var prCount=0, prIndex, pr={}; // prCount 人名總數, prIndex 人名序號, pr[人名]=人名序號
var coCount=0, coIndex, co={}; // coCount 集名總數, coIndex 集名序號, co[集名]=集名序號
var collnames=[], titlename=[], authors=[], titlecoll=[], collections=[], coll;
var collinfos=[], colls=[]; // 集訊原碼
var pb; // 廣錄頁碼 或 綜錄頁碼
var j; // 集名重複序號
var cj={},CJ={}; // cj[集名]=集名重複序號
var n;
var file;
var parseLineInfo=function(line) { // 逐行蒐集 相關集訊 ()
	line.replace(/<pb.+?="(.+?)"\/>/,function(m,m1){
		pb=file.charAt(0)+m1; // 廣錄頁碼 'g'+pb  綜錄頁碼 'z'+pb
		console.log(line,pb);
		exit;
	});
	line.replace(/<coll.*?>(.+?)</,function(m,m1){
		coName=m1; // 集名
		coIndex=coCount++, coll=collections[coIndex]=[];
		j=CJ[coName]||0, CJ[coName]=j+1; // j 集名重複序號
		if(j)coName+=j;
		collnames[coIndex]=coName; // *** 集名 (集名重複就加序號) 加入 集名陣列
		collinfos[coIndex]=pb+co[coName];
		if(coName==='農政叢書'){
			console.log('collinfos['+coIndex+']=co['+coName+']='+co[coName])
		}
		if(!co[coName]){
			console.log('collinfos['+coIndex+']=co['+coName+']='+co[coName])
			exit;
		}
		n=0;
	});
	line.replace(/<pr.*?>(.+?)<\/pr>/g,function(m,m1){
		prName=m1; // 人名 (編者 或 著者)
		prIndex=pr[prName]; // 對應 人名序號+1
		if (!prIndex) { // 若無對應 人名序號+1
			authors[prCount]=prName; // *** 人名 加入 人名陣列
			pr[prName]=prIndex=++prCount; // 人名序號+1 (從 1 起算)
		}
		coll.push(-prIndex); // coll 中以 負整數 代表 人名序號+1
		n++;  // 有人名 20140907 sam
	});
	line.replace(/<ti.*?>(.+?)<\/ti>/g,function(m,m1){
		tiName=m1; // 書名
		tiIndex=ti[tiName]; // 對應 書名序號+1
		if (!tiIndex) { // 若無對應 書名序號+1
			titlename[tiCount]=tiName; // *** 書名 加入 書名陣列
			titlecoll[tiCount]=[];
			ti[tiName]=tiIndex=++tiCount; // 書名序號+1 (從 1 起算)
		}
		coll.push(tiIndex); // coll 中以 正整數 代表 書名序號+1
		n++;  // 有人名 20140907 sam
		titlecoll[tiIndex-1].push(coIndex);
	});
	if(n) // 有書名或人名 20140907 sam
		coll.push(0), n=0; // coll 中以 0 代表 換行
}
var M=0;
var convertfile=function(fn) {
	file=fn;
	var txt=fs.readFileSync(fn,"utf8");
	var C=txt.split(/<_ id=".+?"\/>.*\r\n/); // 以 <_ id=.../> 區隔 集訊
	console.log(fn,C.length-1,'colls from',coCount,'to',coCount+C.length-2)
	C.forEach(function(coll,ic){ // 針對 每 集訊 coll
			var L=coll.split(/\r?\n/);
			for(var i=0;i<L.length;i++){
				parseLineInfo(L[i]);
			}
		coll.replace(/^　*<coll.*?>(.+?)</,function(m,m1){
			coName=m1, j=cj[coName]||0; cj[coName]=j+1;
			if(j)coName+=j;
			coll=coll.replace(/<\ed>/g,'<\ed><br>');
			coll=coll.replace(/<ti/g,'<br><ti');
			coll=coll.replace(/JUAN/g,'卷');
			coll=coll.replace(/　*<note>/g,'<br><br><note>');
			coll=coll.replace(/\r\n　/g,'<br>');
			coll=coll.replace(/\r\n<pb.*?\/>/g,'');
			coll=coll.replace(/<br>(　*<br>)+<ti/g,'<br><ti');
			coll=coll.replace(/\r\n/g,'');
			co[coName]=coll;
			if(coName==='農政叢書'){
				console.log(colls.length,'co['+coName+']=',coll)
			}
			colls.push(coName);
			var L=coll.split(/\r?\n/);
			for(var i=0;i<L.length;i++){
				parseLineInfo(L[i]);
			}
		});
	});
}


var formats=function() {
	collnames=collnames.map(JSON.stringify);
	authors  =authors  .map(JSON.stringify);
	titlename=titlename.map(JSON.stringify);
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
}
var finalize=function() {
	formats();
	console.log('collnames.js',collnames.length);
	fs.writeFileSync(target+  "collnames.js","module.exports=["+collnames.join(",\n")+"]","utf8");
	fs.writeFileSync(target+"collections.js","module.exports=["+collections.join(",\n")+"]","utf8");
	fs.writeFileSync(target+  "collinfos.js","module.exports=["+collinfos.join(",\n")+"]","utf8");
	fs.writeFileSync(target+ "titlenames.js","module.exports=["+titlename.join(",\n")+"]","utf8");
	fs.writeFileSync(target+    "authors.js","module.exports=["+authors.join(",\n")+"]","utf8");
	fs.writeFileSync(target+  "titlecoll.js","module.exports=["+titlecoll.join(",\n")+"]","utf8");
}
glob("guanglu/*.xml",function(err,gfiles){
	glob("zonglu/*.xml",function(err,zfiles){
		var files=gfiles.concat(zfiles);
		for(var i=0;i<files.length;i++){
			var file=files[i];
			var txt=fs.readFileSync(fn,"utf8");

		}
	})
});
glob("guanglu/*.xml",function(err,files){
	files.map(convertfile,"g");
	glob("zonglu/*.xml",function(err,files2){
		files2.map(convertfile,"z");
		finalize();
	})
});
