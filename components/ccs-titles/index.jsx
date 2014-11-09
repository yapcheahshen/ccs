/** @jsx React.DOM */

var dataset=Require("dataset"); 
var titles = React.createClass({
  selectAuthor:function(e) { 
    var author=parseInt(e.target.dataset['author']);
    this.props.onAuthorChanged(author);
  },  
  renderCollinfo:function() {
    var collinfo=dataset.collinfos[this.props.coll]||'';
    var handler=this.selectAuthor;
    collinfo=collinfo.replace(/<pr.*?>(.+?)<\/pr>/g,function(m,m1){
        var author=dataset.authors.indexOf(m1);
        return <button onClick={handler}
            data-author={author}
            className={"btn btn-warning btn-xs"}>{m1}</button>;
    });
    return collinfo;
  },
  renderTitle:function(T) {
    var r=[];
    for (var i=0;i<T.length;i++) {
      var selected="";
      var entry=T[i];
      if (entry==this.props.title) selected="selected_title";
      if (entry>0) {
        r.push(<span className={selected}>{dataset.titlenames[entry-1]} </span>);
      } else if (entry<0) {				// 20140908 sam
        var extra="";
        entry=-entry-1;
        var handler=this.selectAuthor;
        if (entry==this.props.authorid) {
          extra=" disabled";
          handler=null;
        }
        r.push(<button onClick={handler} 
          data-author={entry}
          className={"btn btn-warning btn-xs"+extra}
        >{dataset.authors[entry]}</button>);
      } else {							// 20140908 sam
        r.push(<br/>);		// 20140908 sam
      }									// 20140908 sam
    }
    return r;
  },
  render: function() {
    return <div><span>{this.renderTitle(this.props.titles)}</span><br/><span>{this.renderCollinfo()}</span></div>
  },
//render: function() {
//  return <span>{this.renderCollinfo()}</span>
//}
});
module.exports=titles;