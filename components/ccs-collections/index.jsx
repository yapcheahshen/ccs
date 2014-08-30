/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var collectionList = React.createClass({
  render:function() {
    return <div>
      <button type="button" className="btn btn-primary">說郛</button>
      <button type="button" className="btn btn-primary">百川學海</button>
    </div>
  }
});
var titleInCollection = React.createClass({
  render:function() {
    return <div>
      聖門事業圖<br/>
      中華古今注<br/> 
    </div>
  }
});
var collections = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      <div>
        <collectionList/>
        <titleInCollection/>

      </div>
    );
  }
});
module.exports=collections;