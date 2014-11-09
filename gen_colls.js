// gen_colls.js
var glob=require("glob"), fs=require("fs");
var target="components/ccs-dataset/"; // 前置準備資料存放 工作資料夾
var colls=[]; // 集訊原碼
var M=0;
var convertfile=function(fn) {
	var txt=fs.readFileSync(fn,"utf8");
//	var C=txt.split(/<_ ?id ?=".+?"\/>.*\r\n/); // 以 <_ id=.../> 區隔 集訊
	var C=txt.split(/\r\n.*?(<coll>|<coll j="\d+">)/).filter(function(c){
		return c;
	});
	// 選取例
	//	<coll>再續百川學海</coll>
	//	<coll j="20">百川學海二十卷</coll>
	//	<coll j="1430">皇清經解續編</coll>一千四百三十卷
	//  <coll>婁東雜著</coll>（<coll type="alias">一名棣香齋叢書</coll>）
	// 忽略例
	//	<coll type="alias">閔刻十種</coll>
	//  <coll type="alias">一名棣香齋叢書</coll>
	var coCount=colls.length,n=(C.length-1)/2;
	console.log(fn,n,'colls from',coCount,'to',coCount+n-1);
	C.forEach(function(coll,ic){ // 針對 每 集訊 coll
		if(M<10)console.log(ic,coll.length,coll.substr(0,200))
		coll.replace(/^(.+?)<\/coll>/g,function(m,m1){
			if(M<10)console.log(m1)
			var x='<coll>'+coll;
			x=x.replace(/<\ed>/g,'<\ed><br\/>');
			x=x.replace(/<ti/g,'<br\/><ti');
			x=x.replace(/JUAN/g,'卷');
			x=x.replace(/　*<note>/g,'<br\/><br\/><note>');
			x=x.replace(/\r\n　/g,'<br\/>');
			x=x.replace(/\r\n<pb.*?\/>/g,'');
			x=x.replace(/<br>(　*<br\/>)+<ti/g,'<br\/><ti');
			x=x.replace(/\r\n/g,'');
			x=x.replace(/<_.+\/>.*$/,'');
			if(M++<10)console.log(x.substr(x.length-20));
			colls.push(x);
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
