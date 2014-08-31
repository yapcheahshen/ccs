if (typeof process!="undefined") {
	var dataset=require("../ccs-dataset/index.js");
} else {
	var dataset=Require("dataset");
}
var searchStrings=function( pat, strings) {
  var res=[];
  for (var i=0;i<strings.length;i++) {
    var m=strings[i].match(pat);
    if (m) res.push(i);
  }
  return res;
}
// title,title,-author,-author
var getTitleGroup=function(D,at) {
  var authorStart=at,authorEnd=at;
  var titleStart=at,titleEnd=at;

  if (D[at]>0) { //point to title
  	while (authorStart<D.length-1) {
  		if (D[authorStart]<0) break;
  		authorStart++;
  	}
  	at=authorStart;
  	authorEnd=at;
  	titleStart=at;
  	titleEnd=at;
  }


  while (authorEnd<D.length-1) {
    if (D[authorEnd+1]>0) break;
    authorEnd++;
  }; 

  while(authorStart>0) {
    if (D[authorStart-1]>0) break;
    authorStart--;
  }

  if (authorStart>0) titleEnd=authorStart-1;
  else {
    console.warn("no title before author");
    return [];//some thing error
  }

  titleStart=titleEnd;
  while (titleStart>0) {
    if (D[titleStart-1]<0) break;
    titleStart--;
  }
  return [titleStart,titleEnd,authorStart,authorEnd];

}

var findTitleByAuthor=function(author) {
	if (typeof author=="number") {
		authorid=-author - 1;
	} else {
	  var authorid=dataset.authors.indexOf(author);
	  if (authorid==-1) return [];
	  authorid=-(authorid+1);		
	}
  var res=[];
  for (var i=0;i<dataset.collections.length;i++){
    var D=dataset.collections[i];
    var at=D.indexOf(authorid);
    if (at==-1) continue;

    var titleGroup=getTitleGroup(D,at);
    if (titleGroup.length) {
    	res.push([i, D.slice(titleGroup[0],titleGroup[3]+1) ]);
    }
  };
  return res;
}
var findAuthor=function(author) {
	if (!author.trim()) return [];
	var pat=new RegExp(author);
	return searchStrings(pat,dataset.authors);
}
var findTitle=function(title) {
  if (!title.trim()) return [];
  var pat=new RegExp(title);
  var res=searchStrings(pat,dataset.titlenames); 
  if (res.length>100) res.length=100;
  return res;
}
var findCollection=function(coll) {
  if (!coll.trim()) return [];
  var pat=new RegExp(coll);
  var res=searchStrings(pat,dataset.collnames); 
  if (res.length>50) res.length=50;
  return res;
}
module.exports={
  findTitleByAuthor:findTitleByAuthor,
  findTitle:findTitle,
  getTitleGroup:getTitleGroup,
  findAuthor:findAuthor,
  findCollection:findCollection
}