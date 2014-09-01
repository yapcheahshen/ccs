/** @jsx React.DOM */

var dataset=Require("dataset"); 
var titles = React.createClass({
  selectAuthor:function(e) { 
    var author=parseInt(e.target.dataset['author']);
    this.props.onAuthorChanged(author);
  },  
  renderTitle:function(T) {
    var r=[];
    for (var i=0;i<T.length;i++) {
      var selected="";
      var entry=T[i];
      if (entry==this.props.title) selected="selected_title";
      if (entry>0) {
        r.push(<span className={selected}>{dataset.titlenames[entry-1]}</span>);
      } else {
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
      }
    }
    return r;
  },
  render: function() {
    return <span>{this.renderTitle(this.props.titles)}</span>
  }
});
module.exports=titles;