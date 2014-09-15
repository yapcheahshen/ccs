// gen_sam.js yap & samsuanchen@gmail.com since 20140901

var glob=require("glob"), fs=require("fs");							// 讀 guanglu 或 zonglu xml 檔 每列 文字
	
var ppb			=/<pb (id|n)=(["'])(.+?)\2\/>/;						// 比對				m3 頁碼
var pco			=/<coll>(.+?)<\/coll>/;								// 比對				m1 叢名
var ped			=/<ed>(.+?)<\/ed>/;									// 比對				m1 版本說明
var pjuti		=/<ti(.*? j=".+?")?>(.+?)<\/ti>/;					// 比對 書名資訊	m1 卷數資訊 m2 書名
var pju			=/ j="(.+?)"/;										// 比對				m1 卷數
var no_dy		='上在有為或義熊僧沈賢譌校增遺附編本紀署譜題録據考志記集（）〔， 、>　\t';
var pdyauro		=RegExp('　(（[^'+no_dy+']+?）|[^'+no_dy+']+?)?<pr.*?>(.+?)<\/pr>([^　、]*)');
//	pdyauro		=/　(（.+?）|.+?)?<pr.*?>(.+?)<\/pr>([^　、]*)/;	// 比對 人名資訊	m1 朝代資訊 m2 人名 m3 角色
var pdy			=RegExp('（?([^+'+no_dy+']+?)）?');
//	pdy			=/（?([^　]+?)）?/;									// 比對				m1 朝代
var pjutidyauro	=RegExp('<ti(.*? j=".+?")?>(.+?)<\/ti>|　(（[^'+no_dy+']+?）|[^'+no_dy+']+?)?<pr.*?>(.+?)<\/pr>([^　、]*)','g');
//	pjutidyauro	=/<ti(.*? j=".+?")?>(.+?)<\/ti>|　(（[^　]+?）|[^　]+?)?<pr.*?>(.+?)<\/pr>([^　、]*)/g // 比對 書名資訊 或 人名資訊
	
var page;					// 頁碼字串 page		string		m3 of /<pb (id|n)=(["'])(.+?)\2\/>/
var source;					// 來源字串	source		string  	g 代表 guanglu, z 代表 zonglu
var sourcepage;				// 源頁字串 sourcepage	string		source+page
var coll;					// 叢名字串 collection	string 		m1 of /<coll>(.+?)<\/coll>/
var times;					// 同名次數	times		number		coll 同名使用次數
var edition;				// 版本說明 edition		string		m1 of /<ed>(.+?)<\/ed>/
var juan;					// 卷數字串 juan		string 取自	m1 of /<ti(.*? j=".+?")?>(.+?)<\/ti>/
var title;					// 書名字串 title		string 		m2 of /<ti(.*? j=".+?")?>(.+?)<\/ti>/
var dynasty;				// 朝代字串 dynasty		string 取自	m1 of /　(（.+）|.+)?<pr.*?>(.+?)<\/pr>([^　、]*)/
var author;					// 人名字串 author		string 		m2 of /　(（.+）|.+)?<pr.*?>(.+?)<\/pr>([^　、]*)/
var role;					// 角色字串 role		string 		m3 of /　(（.+）|.+)?<pr.*?>(.+?)<\/pr>([^　、]*)/

var ccode;					// 叢碼		collection	code		叢名序號_8bit同名次數
var tcode;					// 書碼		title		code		書名序號_8bit卷數序號_16bit首位著者序號
var acode;					// 人碼		author		code		人名序號_8bit朝代序號

var ctimesmax;				// 最大次數 ctimesmax	number		同名次數最大值

var cid=0;					// 叢名序號 collection id 			代表 叢名字串 (可相同字串) * 特許
var tid=0;					// 書名序號 title	   id			代表 書名字串 (不相同字串)
var jid=0;					// 卷數序號 juan	   id			代表 卷數字串 (不相同字串)
var did=0;					// 朝代序號 dynasty	   id			代表 朝代字串 (不相同字串)
var aid=0;					// 人名序號 author	   id			代表 人名字串 (不相同字串)
var rid=0;					// 角色序號 role	   id			代表 角色字串 (不相同字串)

var acodeid	=0;				// 人碼序號 acode	   id			代表 朝代 人名		相符的 那著者
var tcodeid	=0;				// 書碼序號 tcode	   id			代表 著者 書名 卷數 相符的 那本書

var fid		=0;				// 首位著者 first acodeid			首位著者 人碼序號

var colls   =[''];			// 蒐集 coll	叢名字串
var ctimes	=[0 ];			// 蒐集 times	同名次數
var juans   =[''];			// 蒐集 juan	卷數字串
var titles  =[''];			// 蒐集 title	書名字串
var dynastys=[''];			// 蒐集 dynasty 朝代字串
var authors =[''];			// 蒐集 author	人名字串
var roles   =[''];			// 蒐集 roll	角色字串

var ccodes	=[0 ];			// 蒐集 ccode	叢碼
var tcodes  =[0 ];			// 蒐集 tcode   書碼
var acodes  =[0 ];			// 蒐集 acode	人碼

var co={};					// co[叢名字串]=cid (從 1 起算)
var ti={};					// ti[書名字串]=tid (從 1 起算)
var ju={};					// ju[卷數字串]=jid (從 1 起算)
var dy={};					// dy[朝代字串]=did (從 1 起算)
var au={};					// au[人名字串]=aid (從 1 起算)
var ro={};					// ro[角色字串]=rid (從 1 起算)

var tc={};					// tc[書碼字串]=tcodeid (從 1 起算)
var ac={};					// ac[人碼字串]=acodeid (從 1 起算)

var cpage	=[];			// 每項 		記錄 叢名 出處 來源字串+頁碼字串			叢-->頁
var cedition=[];			// 每項 以 list 記錄 叢名 版本 資訊							叢-->版
var cacodes =[];			// 每項 以 list 記錄 叢名 所有 人碼字串						叢-->人
var crole	=[];			// 每項 		記錄 叢名 人物 角色 						叢-->角
var ctcodes =[];			// 每項 以 list 記錄 叢名 所含 書碼字串						叢-->書

var tccodes  =[];			// 每項 以 list 記錄 書碼 所屬 叢名序號						書-->叢
var tacodes =[];			// 每項 以 list 記錄 書碼 所有 人碼字串						書-->人
var trole	=[];			// 每項 		記錄 書名 人物 角色 						書-->角

var atcodes =[];			// 每項 以 list 記錄 人碼 所著 書碼字串						人-->叢
var accodes  =[];			// 每項 以 list 記錄 人碼 所編 叢名序號						人-->書

var target="tst-dataset/";	// 檔案寫出 指定資料夾

var getCcodeid=function(coll){	// 叢名字串 coll
	cid=co[coll];
	if(!cid){
		cid=co[coll]=colls.length, colls.push(coll), ctimes[cid]=0;
	}
	times=++ctimes[cid];						// 同名次數
	times=times>ctimesmax ?times :ctimesmax;	// 最大次數
	log('叢名序號='+    cid.toString(16)+' 叢名字串='+coll+' 同名次數='+times);
	ccode=cid*0x100+times, ccodeid=ccodes.length, ccodes.push(ccode);
	log('叢碼序號='+ccodeid.toString(16)+' 叢碼字串='+ccode.toString(16));
	ctcodes [ccodeid]=[];		// 每列 以 list 記錄 叢碼序號 所含 書碼序號					叢-->書
	cacodes [ccodeid]=[];		// 每列 以 list 記錄 叢碼序號 編者 人碼序號					叢-->人
	cedition[ccodeid]=[];		// 每列 以 list 記錄 叢碼序號 所有 版本說明					叢-->版
	return   ccodeid;			// 叢碼序號 ccodeid
}
var getId=function(value,list,obj,name){var id // 取 value 在 list 中 序號 id (從 1 起算, 查考 obj, 因 list[0]='')
	id = obj[value];
	if(!id){
		id=obj[value]=list.length /* id 從 1 起算 */,	list.push(value);
		log(name+'序號='+id.toString(16)+' '+name+'字串='+value); // 檢視 產生 的 序號
	}
	return id;
}
var getJid=function(juan){		  // 卷數字串 juan
	jid = getId(juan   ,juans   ,ju,'卷數');
	return jid;					  // 卷數序號 jid
}
var getTid=function(title){	 	  // 書名字串 title
	tid = getId(title  ,titles  ,ti,'書名');
	return tid;					  // 書名序號 tid
}
var getDid=function(dynasty){	  // 朝代字串 dynastyc
	did = getId(dynasty,dynastys,dy,'朝代');
	return did;					  // 朝代序號 did
}
var getAid=function(author){	  // 人名字串 author
	aid = getId(author ,authors ,au,'人名');
	return aid;					  // 人名序號 aid
}
var getRid=function(role){		  // 角色字串 role
	rid = getId(role   ,roles   ,ro,'角色');
	return rid;					  // 角色序號 did
}
var getAcodeid=function(aid,did){ // 人名序號 朝代序號 ==> 人碼 (人名序號_8bit朝代序號) ==> 人碼序號
	acode = aid*0x100 + did;
	acodeid = getId(acode.toString(16),acodes,ac,'人碼');
	accodes [acodeid]=[];		  // 每列 以 list 記錄 編者 所編 叢名序號					人-->叢
	atcodes[acodeid]=[];		  // 每列 以 list 記錄 著者 所著 書碼序號					人-->書
	return acodeid;				  // 人碼序號
}
var getTcodeid=function(tid,jid,aid){// 書名序號 卷數序號 人碼序號 ==> 書碼 (書名序號_8bit卷數序號_16bit首位著者序號)
	tcode = (tid * 0x100 + jid) * 0x10000 + aid;
	tcodeid = getId(tcode.toString(16),tcodes,tc,'書碼');
	tccodes [tcodeid]=[];		  // 每列 以 list 記錄 書名 所屬 叢名序號					書-->叢
	tacodes[tcodeid]=[];		  // 每列 以 list 記錄 書名 著者 人碼序號					書-->人
	return tcodeid;				  // 書名序號
}
var totallines =0;
var convertfile=function(fn) { var lines, m
	log('讀取檔案='+fn)
	lines=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	log('檔案列數='+lines.length)
	lines.forEach(function(line,i){							// 一列文字 line 序號 i (從 0 起算)
		log('列'+i+'='+line)
//		ppb		=/<pb (id|n)=(["'])(.+?)\2\/>/				// 比對				m3 頁碼
		line.replace(ppb,function(m,m1,m2,m3){
			page=m3;					// 頁碼字串
			log('來源='+source+' 頁碼='+page);
		});
//		pco		=/<coll>(.+?)<\/coll>/						// 比對				m1 叢名
		line.replace(/<coll.*?>(.*?)<\/coll>/,function(m,m1){
			coll			=m1;							// 叢名字串
			ccodeid			=getCcodeid(coll);				// 叢碼序號
			sourcepage		=source+page;					// 源頁字串
			cpage[ccodeid]	=sourcepage;					// cpage[叢碼序號]=源頁字串
			log('叢碼序號='+ccodeid.toString(16)+' 源頁='+sourcepage);
		});
//		ped		=/<ed>(.+?)<\/ed>/							// 比對				m1 版本說明
		line.replace(/<ed>(.+?)<\/ed>/,function(m,m1){
			edition			=m1;							// 版本說明
			cedition[ccodeid].push(edition);				// cedition[叢名序號]=所有版本說明
			log('叢碼序號='+ccodeid.toString(16)+' 版本說明='+edition);
		});
		fid					=0 ;							// 首位著者 人碼序號 預設為 0
		var tinfo			=[];							// 書名資訊 集合 清空
//		pjutidyauro	=/<ti(.*? j=".+?")?>(.+?)<\/ti>|　(（.+）|.+)?<pr.*?>(.+?)<\/pr>(.)?/g	// 比對 書名資訊 或 人名資訊
		line.replace(pjutidyauro,function(m){
//			pjuti	=/<ti(.*? j=".+?")?>(.+?)<\/ti>/		// 比對 書名資訊	m1 卷數資訊 m2 書名
			m.replace(pjuti,function(m,m1,m2){
				if(fid)
					tinfo	=[], fid=0;						// 注意 書名資訊 已分析 !!!!! 適時清空 !!!!!
				juan		=m1 || ' j="1"';				// 卷數字串 (若無卷數資訊 卷數視為 1)
//				pju	=/ j="(.+?)"/							// 比對				m1 卷數
				juan.replace(pju,function(m,m1){
					jid		=getJid		(juan			 ); // 卷數序號
				});
				title		=m2;							// 書名字串
				tid			=getTid		(title			 ); // 書名序號
				tinfo.push(	{jid: jid,	tid: tid}	 	 ); // 書名資訊 暫存 (等 人名資訊 一起分析)
			});												// 書名資訊 結束
//			pdyauro	=/　(（.+?）|.+?)?<pr.*?>(.+?)<\/pr>([^　、]*)/	// 比對 人名資訊	m1 朝代資訊 m2 人名 m3 角色
			m.replace(pdyauro,function(m,m1,m2,m3){
				dynasty		=m1;							// 朝代字串
				did			=0;								// 若無朝代資訊 did=0
				if(m1 && m1.charAt(0)==='（' && m1.charAt(m1.length-1)==='）'){
					dynasty	=m1.substr(1,m1.length-2);		// 朝代字串
					did		=getDid		(dynasty  );		// 朝代序號
					return
				}
				author		=m2;							// 人名字串
				role		=m3;							// 角色字串
				aid			=getAid		(author   );		// 人名序號
				rid			=0;
				if(role)rid=getRid		(role     );		// 角色序號
				acodeid		=getAcodeid	(aid  ,did);		// 人碼序號
				if(!fid){
					fid		=acodeid;						// 首位著者 人碼
				}
				if(tinfo.length){							// 若 書名資訊 集合 有資料
					tinfo.map(function(t){					// 針對每個 書名資訊
						jid		=t.jid;							// 書名序號
						tid		=t.tid;							// 卷數序號
						tcodeid	=getTcodeid(tid ,jid ,fid);		// 書碼序號
						if( tccodes[tcodeid].indexOf(ccodeid)<0)// 若 tccodes[書碼序號] 集合 不含 叢名序號
							tccodes[tcodeid].push   (ccodeid);	// 將 叢名序號 加進 tccodes[書碼序號] 集合 書碼-->叢名
						if( ctcodes[ccodeid].indexOf(tcodeid)<0)// 若 ctcodes[叢名序號] 集合 不含 書碼序號
							ctcodes[ccodeid].push   (tcodeid);	// 將 書碼序號 加進 ctcodes[叢名序號] 集合 叢名-->書碼
						if(	tacodes[tcodeid].indexOf(acodeid)<0)// 若 tacodes[書碼序號] 集合 不含 人碼序號
							tacodes[tcodeid].push   (acodeid);	// 將 人碼序號 加進 tacodes[書碼序號] 集合 書碼-->人碼
						if( atcodes[acodeid].indexOf(tcodeid)<0)// 若 atcodes[人碼序號] 集合 不含 書碼序號
							atcodes[acodeid].push   (tcodeid);	// 將 書碼序號 加進 atcodes[人碼序號] 集合 人碼-->書碼
					});
				} else {
						if(	accodes[acodeid].indexOf(ccodeid)<0)// 若 accodes[人碼序號] 集合 不含 叢名序號
							accodes[acodeid].push   (ccodeid);	// 將 叢名序號 加進 accodes[人碼序號] 集合 人碼-->叢名
						if(	cacodes[ccodeid].indexOf(acodeid)<0)// 若 cacodes[叢名序號] 集合 不含 人碼序號
							cacodes[ccodeid].push   (acodeid);	// 將 人碼序號 加進 cacodes[叢名序號] 集合 叢名-->人碼
				}
			});												// 人名資訊 結束
			if(tinfo.length && !fid){	// 有 書名資訊 無 人名資訊 !!!!! 注意 !!!!!
					tinfo.map(function(t){
						jid		=t.jid;							// 書名序號
						tid		=t.tid;							// 卷數序號
						tcodeid	=getTcodeid(tid ,jid ,fid);		// 書碼序號
						if( tccodes[tcodeid].indexOf(ccodeid)<0)// 若 tccodes[書碼序號] 集合 不含 叢名序號
							tccodes[tcodeid].push   (ccodeid);	// 將 叢名序號 加進 tccodes[書碼序號] 集合 書碼-->叢名
						if( ctcodes[ccodeid].indexOf(tcodeid)<0)// 若 ctcodes[叢名序號] 集合 不含 書碼序號
							ctcodes[ccodeid].push   (tcodeid);	// 將 書碼序號 加進 ctcodes[叢名序號] 集合 叢名-->書碼
					})
			}
		});													// 一列文字 結束
		if(++totallines%10000===0)
			console.log(totallines+' totallines processed');// 檢視處理進度
	});
}
function out(msg,listname){
	var file=target+listname+".js", list=eval(listname);
	fs.writeFileSync(file,"module.exports="+JSON.stringify(list,""," "),"utf8");
	log(msg+' '+colls.length+' 列 寫到 '+target+"colls.js");
}
var finalize=function() { var i
	console.log("總共分析列數 "+totallines);
	log("總共分析列數 "+totallines);
	log("叢名 重覆次數 最大值 "+ctimesmax);
	out("頁碼",   "cpage"), out("叢名",   "colls"), out("次數",  "ctimes"),	out("叢碼",  "ccodes");
	out("朝代","dynastys"), out("人名", "authors"), out("角色",   "roles"), out("人碼",  "acodes");
	out("書名",  "titles"), out("卷數",   "juans"), 						out("書碼",  "tcodes");
	for (i=0;i<cedition.length;i++)
	   cedition[i]=JSON.stringify(cedition[i]||"","","").replace(",[]","");
	for (i=0;i< ctcodes.length;i++)
		ctcodes[i]=JSON.stringify( ctcodes[i]||"","","").replace(",[]","");
	for (i=0;i< cacodes.length;i++)
		cacodes[i]=JSON.stringify( cacodes[i]||"","","").replace(",[]","");
	for (i=0;i< atcodes.length;i++)
		atcodes[i]=JSON.stringify( atcodes[i]||"","","").replace(",[]","");
	for (i=0;i<  accodes.length;i++)
		 accodes[i]=JSON.stringify(  accodes[i]||"","","").replace(",[]","");
	for (i=0;i< tacodes.length;i++)
		tacodes[i]=JSON.stringify( tacodes[i]||"","","").replace(",[]","");
	for (i=0;i<  tccodes.length;i++)
		 tccodes[i]=JSON.stringify(  tccodes[i]||"","","").replace(",[]","");
	out("叢碼-->版本","cedition"), out("叢碼-->角色",   "crole");
	out("叢碼-->人碼", "cacodes"), out("叢碼-->書碼", "ctcodes");
	out("人碼-->叢碼", "accodes"), out("人碼-->書碼", "atcodes");
	out("書碼-->叢碼", "tccodes"), out("書碼-->人碼", "tacodes");
	out("書碼-->角色",   "trole");
}
var zongluConv=function(err,files){
	source="z";					// 來源識別字串 設為 z 代表 zonglu
	files.map(convertfile);			// 以 convertfile 處理每個 檔
	fs.writeFileSync(target+    "log.txt",logbuf,"utf8");
	finalize();						// 以 finalize 將所有資訊存檔
}
var guangluConv=function(err,files){
	source="g";					// 來源識別字串 設為 g 代表 guanglu
	files.map(convertfile);			// 以 convertfile 處理每個 檔
	glob("zonglu/*.xml",zongluConv)	// 蒐集  zonglu 資料夾中 xml 檔 交由  zongluConv 處理
}
var logbuf='guanglu 及 zonglu 資料分析 記錄';
var log=function(msg){
	logbuf+='\r\n'+msg;
}
glob("guanglu/*.xml",guangluConv);	// 蒐集 guanglu 資料夾中 xml 檔 交由 guangluConv 處理
