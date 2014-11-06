/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var dataset=Require("dataset");
var collectionlist = React.createClass({
  renderItem:function(coll) {
    return <a data-coll={coll} className="btn btn-primary">{dataset.collnames[coll]}</a>
  },
  setColl:function(e) {
    var coll=e.target.dataset['coll'];
    this.props.onCollChanged(coll);
  },
  render:function() {
    return <div onClick={this.setColl} >
      {this.props.colls.map(this.renderItem)}
    </div>
  }
});
module.exports=collectionlist;