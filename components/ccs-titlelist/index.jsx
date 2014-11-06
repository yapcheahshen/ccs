/** @jsx React.DOM */

var dataset=Require("dataset"); 
var titlelist = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  }, 
  setColl:function(e) {
    var coll=parseInt(e.target.dataset['coll']);
    var title=parseInt(e.target.parentNode.dataset['title']);
    this.props.onCollChanged(coll,title);
  },
  showCollection:function(title) {
    var colls=dataset.titlecoll[title];
    var res=[];
    if (typeof colls=="number") colls=[colls];

    for (var i=0;i<colls.length;i++) {
        var collname=dataset.collnames[colls[i]];
        res.push(<a 
          data-coll={colls[i]}
          onClick={this.setColl} className="btn btn-primary">{collname}</a>);
    }
    return res;
  }, 
  renderItem:function(title) {
    return (
    <p data-title={title+1}><span className="title">{dataset.titlenames[title]}</span>
    {this.showCollection(title)}
    </p>);
  },
  render: function() {
    return (
      <div>
        {this.props.titles.map(this.renderItem)}
      </div>
    );
  }
});
module.exports=titlelist;