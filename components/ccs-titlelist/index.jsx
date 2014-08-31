/** @jsx React.DOM */

var dataset=Require("dataset"); 
var titlelist = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  }, 
  showCollection:function(title) {
    var colls=dataset.titlecoll[title];
    var res=[];
    if (typeof colls=="number") colls=[colls];

    for (var i=0;i<colls.length;i++) {
        var collname=dataset.collnames[colls[i]];
        res.push(<a className="btn btn-primary btn-xs">{collname}</a>);
    }
    return res;
  }, 
  renderItem:function(title) {
    return (
    <p><span className="title">{dataset.titlenames[title]}</span>
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