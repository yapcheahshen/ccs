var glob=require("glob"), fs=require("fs");
var page;					// 頁碼字串 page	   string		m3 /<pb (id|n)=(["'])(.+?)\2\/>/
var original;				// 來源字串	original   string  		g 代表 guanglu, z 代表 zonglu
var coll;					// 叢名字串 collection string 		m1 /<coll>(.+?)<\/coll>/
var edition;				// 版本字串 edition	   string  首列	m1 /<ed>(.+?)<\/ed>/
var title;					// 書名字串 title	   string 		m2 /<ti(.*? j=".+?")?>(.+?)<\/ti>/
var juan;					// 卷數字串 juan	   string  取自	m1 /<ti(.*? j=".+?")?>(.+?)<\/ti>/
var dynasty;				// 朝代字串 dynasty	   string 		m1 /　(（.+）|.+)?<pr.*?>(.+?)<\/pr>(.)?/
var author;					// 人名字串 author	   string 		m2 /　(（.+）|.+)?<pr.*?>(.+?)<\/pr>(.)?/
var role;					// 角色字串 role	   string 		m3 /　(（.+）|.+)?<pr.*?>(.+?)<\/pr>(.)?/
var cid=0;					// 叢名序號 collection id 			代表 叢名字串 (可相同字串) * 特許
var tid=0;					// 書名序號 title	   id			代表 書名字串 (不相同字串)
var jid=0;					// 卷數序號 juan	   id			代表 卷數字串 (不相同字串)
var did=0;					// 朝代序號 dynasty	   id			代表 朝代字串 (不相同字串)
var aid=0;					// 人名序號 author	   id			代表 人名字串 (不相同字串)
var acode;					// 人碼字串 author	   code hex數碼	(人名序號_8bit朝代序號)
var tcode;					// 書碼字串 title	   code hex數碼 (書名序號_8bit卷數序號_16bit首位著者序號)
var colls=[''];				// 蒐集 coll 叢名字串
var titles=[''];			// 蒐集 title 書名字串
var juans=[''];				// 蒐集 juan 卷數字串
var dynastys=[''];			// 蒐集 dynasty 朝代字串
var authors=[''];			// 蒐集 author 人名字串
var ti={};					// ti[書名字串]=tid (從 1 起算)
var au={};					// au[人名字串]=aid (從 1 起算)
var cpages  =[];			// 每列 以 list 記錄 集 所含 頁碼資訊 ('g' 或 'z' 加 pid)	集-->頁
var cauthors=[];			// 每列 以 list 記錄 集 所有 編者序號						集-->人
var ctcodes =[];			// 每列 以 list 記錄 集 所含 書碼序號						集-->書
var bcolls  =[];			// 每列 以 list 記錄 書 所屬 叢名序號						書-->集
var bauthors=[];			// 每列 以 list 記錄 書 所有 著者序號						書-->人
var atcodes =[];			// 每列 以 list 記錄 人 所著 書碼序號						人-->集
var acolls  =[];			// 每列 以 list 記錄 人 所編 叢名序號						人-->書
var target="tst-dataset/";	// 檔案寫出 指定資料夾
var valid=function(id){
	return id;				// 非 0 的資料
}
var getId=function(string,strings,obj){var id // 取 字串 string 在 strings 中 序號 id (從 1 起算, 查考 obj)
	id = obj[string]
	if(!id){
		id=obj[string]=strings.length/* id 從 1 起算 */, strings.push(string);
	}
	return id;
}
var getCid=function(coll){	// 叢名字串 collection string
	var id = getId(coll,colls,co);
	console.log('叢名序號='+id+' 叢名字串='+coll);
	cpages  [id]=[];		// 每列 以 list 記錄 集 所含 頁碼資訊 ('g' 或 'z' 加 pid)	集-->頁
	ctcodes [id]=[];		// 每列 以 list 記錄 集 所含 書碼序號						集-->書
	cauthors[id]=[];		// 每列 以 list 記錄 集 所有 編者序號						集-->人
	return   id
}
var getTid=function(title){	// 書名字串 title string
	var id = getId(title,titles,ti);
	console.log('書名序號='+id+' 書名字串='+title);
	return id
}
var getAid=function(author){	// 人名字串 author string (朝代_人名)
	var id = getId(author,authors,au);
	console.log('人名序號='+id+' 人名字串='+author);
	acolls  [id]=[];		// 每列 以 list 記錄 編者 所編 叢名序號						人-->集
	atcodes [id]=[];		// 每列 以 list 記錄 著者 所著 書碼序號						人-->書
	return   id
}
var getBid=function(tcode){	// 書碼字串 book code (書名序號_卷數_首位著者序號)
	var id = getId(tcode,tcodes,bc);
	console.log('叢名序號='+id+' 叢名字串='+tcode);
	bcolls  [id]=[];		// 每列 以 list 記錄 標 所屬 叢名序號						書-->集
	bauthors[id]=[];		// 每列 以 list 記錄 書 所有 著者序號						書-->人
	return id
}
var parseTitle=function(line) { // 處理一列 xml 文字
	line.replace(/<pb (id|n)=(["'])(.+?)\2\/>/,function(m,m1,m2,m3){			// 比對 當前頁碼 (guanglu 或 zonglu)
		pid=m3;																	// 取得 當前頁碼
		console.log('當前頁碼='+pid);											// 檢視 當前頁碼
		if(cid)																	// 若有 叢名序號
			cpages[cid].push(this+pid);										// 增加 叢名 所含頁碼 ('g' 或 'z' 加 pid)
	})
	line.replace(/<coll.*?>(.*?)<\/coll>/,function(m,m1){
		coll=m1;
		if(co[coll]
		cid=getCid(coll);
	})
	line.replace(/<ti(.*? j=".+?")?>.+?<\/ti>|<pr.*?>.+?<\/pr>/g,function(m){	// 比對 卷數 書名 或 作者
		console.log('比對 卷數 書名 作者='+JSON.stringify(m));					// 檢視 比對資訊
		var titles=[], authors=0;												// 清空 暫存 卷數 書名 資訊
		m.forEach(function(m){
			m.replace(/<ti(.*? j=".+?")?>(.+?)<\/ti>/,function(m0,m1,m2){		// 確認 卷數 書名
				authors=0;
				juan = m1 ? m1.match(/"(.+?)"/)[1].trim() : 0;					// 取得 卷數字串
				title= m2.replace(/<(.+?).*?>.+?<\\1>/g,'').trim();				// 取得 書名字串
				titles.push({juan:juan,title:title});							// 暫存 卷數 書名 資訊 備用
			})
			m.replace(/<pr.*?>(.+?)<\/pr>/,function(m0,m1){						// 確認 作者
				author=m1.trim(author);											// 取得 人名字串
				aid=getAid(author);												// 取得 人名序號
				if(!authors){													// 若是 首位著者
					if(titles.length){											// 若有 暫存 卷數 書名 資訊
						titles.forEach(function(t){								// 針對 每一 卷數 書名 資訊
							juan =t.juan ;										// 取得 卷數字串
							title=t.title;										// 取得 書名字串
							console.log('書名='+title+' 人名='+author+' 卷數='+juan);
							tcode= tid + '_' + aid + '_' + juan;				// 取得 書碼字串 (書名序號_首位著者序號_卷數)
							bid=getTid(tcode);									// 取得 書碼序號
							ctcodes[cid].push(bid);							// 增加 叢名 所含 書碼序號
							bcollss[bid].push(cid);							// 增加 書碼 所屬 叢名序號
						})
					} else {													// 若非 首位著者
						
					}
				}
				cauthors[cid].push(aid);
				authors++
			})
		})======================================================================
				titles.forEach(function(t){

				})
				console.log('人名字串='+author+' 人名序號='+aid+' 人名集合=',authors.join());
				coll.push(-aid);				// aid 取負值
			});
			if(m=m.match(/<ti(.*?j=".+?")?>(.+?)<\/ti>/)){ // 
				title= m[2].replace(/<(.+?).*?>.+?<\\1>/g,'').trim();
				var m1=m[1]
				juan = m1 ? m1.match(/"(.+?)"/)[1].trim() : 0;
				console.log('書名字串='+title+' 人名序號='+aid+' 卷數='+juan);
				title= title + '_' + aid + '_' + juan;				// 書名字串_首位著者序號_卷數
				
			} else {
				
			}
		})
		人名群前的書名
		if(m2)
			m2.replace(/<pr.*?>(.+?)<\/pr>/g,function(m0,m1){
				author=m1.trim(), aid=getAid(author);
				console.log('人名字串='+author+' 人名序號='+aid+' 人名集合=',authors.join());
				authors.push(aid), coll.push(-aid);				// aid 取負值
			});
		m1.replace(/<ti(.*?j=".+?")?>(.+?)<\/ti>/g,function(m0,m1,m2){
			title= m2.replace(/<(.+?).*?>.+?<\\1>/g,'').trim(); // 書名字串 (刪除其中 xml 標記)
			aid  = authors.length ? authors[0] : '';			// 首位作者序號
				juan = m1 ? m1.match(/"(.+?)"/)[1].trim() : 0;		// 卷數
			if (!ti[title])
				bcolls.push([]);
			tid= getTid(title);									//
			console.log('書碼字串='+title+' 書碼序號='+tid+' 書碼集合=',titles.join());
			bcolls[tid].push(cid);
			console.log('標'+tid+' 所屬叢名序號='+bcolls[tid].join());
		});
		coll.push(tid);											// tid 取正值
	});
	coll.push(0);												// end of line
	console.log('集'+cid+' 書碼作者資訊='+coll.join())
}
var convertfile=function(fn) { var lines, m
	console.log('讀取檔案='+fn)
	lines=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	console.log('檔案列數='+lines.length)
	for(var i=0;i<lines.length;i++){
		var line=lines[i];
		console.log('列'+i+'='+line)
		if (line.match(/<ti/))					
			parseTitle(line);			// 書名 人名
		else if (m=line.match(/<pb (id|n)=(["'])(.+?)\2/)) {
			pid=m[3],					// 當前頁碼
			console.log('讀取頁碼='+pid); 
			if(coll)
				cpages[cid].push(this+pid),
				console.log('cpages['+cid+']='+cpages[cid].join());
		} else if (m=line.match(/<coll.*?>(.*?)<\/coll>/)) {
			cid=getCid(coll=m[1]),		// 叢名字串 與 叢名序號
			console.log('叢名字串="'+coll+'" 叢名序號='+cid+' 叢名集合='+colls.join()),
			ctcodes.push([]),		// 預設 (空集)
			cpages[cid]=[this+pid],	// 頁碼 (前置 'g' or 'z', 當前 map 的第二的參數)
			console.log('集'+cid+'所含頁碼='+cpages[cid].join());
		}
		if(i>=23)exit
	}
}
var finalize=function() { var i
	for (i=0;i<ctcodes.length;i++)
			ctcodes[i]=JSON.stringify(ctcodes[i],"","").replace(",[]","");
	for (i=0;i<  cpages.length;i++)
			  cpages[i]=JSON.stringify(  cpages[i],"","").replace(",[]","");
	for (i=0;i<  bcolls.length;i++) {
		if (bcolls[i].length==1)
			  bcolls[i]=JSON.stringify(  bcolls[i][0],"","");
		else
			  bcolls[i]=JSON.stringify(  bcolls[i],"","");
	}
	for (i in ti) titles.push(i);
	for (i in au) authors.push(i);
	fs.writeFileSync(target+"ctcodes.js","module.exports="+JSON.stringify(ctcodes,""," "),"utf8");
	fs.writeFileSync(target+  "cpages.js","module.exports="+JSON.stringify(  cpages,""," "),"utf8");
	fs.writeFileSync(target+  "collstrings.js","module.exports="+JSON.stringify(     colls,""," "),"utf8");
	fs.writeFileSync(target+ "titleditions.js","module.exports="+JSON.stringify(     titles,""," "),"utf8");
	fs.writeFileSync(target+    "authors.js","module.exports="+JSON.stringify(     authors,""," "),"utf8");
	fs.writeFileSync(target+  "bcolls.js","module.exports="+JSON.stringify(  bcolls,""," "),"utf8");
}
var zongluConv=function(err,files){
	files.map(convertfile,"z");		// 以 convertfile 處理每個 檔
	finalize();						// 以 finalize 將所有資訊存檔
}
var guangluConv=function(err,files){
	files.map(convertfile,"g");		// 以 convertfile 處理每個 檔
	glob("zonglu/*.xml",zongluConv)	// 蒐集  zonglu 資料夾中的 xml 檔 交由  zongluConv 處理
}
glob("guanglu/*.xml",guangluConv);	// 蒐集 guanglu 資料夾中的 xml 檔 交由 guangluConv 處理
