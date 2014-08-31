/** @jsx React.DOM */

var dataset=Require("dataset"); 
var titles=Require("titles");
var collectionList = React.createClass({
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
var titleInCollection = React.createClass({
  setAuthor:function(author) {
    this.props.onAuthorChanged(author);
  },
  render:function() {
    var titlesInCollection=dataset.collections[this.props.coll] || [];
    return <div>
      <h2>{dataset.collnames[this.props.coll]}</h2>
      <titles onAuthorChanged={this.setAuthor} titles={titlesInCollection}/>
    </div>
  }
});
/* show directly when only one candidate */
var collections = React.createClass({
  getInitialState: function() {
    return {bar: "world",coll:this.props.coll};
  },
  shouldComponentUpdate:function(nextProps) {
    if (nextProps.coll!=this.props.coll) nextState.coll=nextProps.coll;
    return true;
  },
  setColl:function(coll) {
    this.setState({coll:coll});
  },
  setAuthor:function( author) {
    this.props.onAuthorChanged(author);
  },
  render: function() {
    return (
      <div>
        <collectionList onCollChanged={this.setColl} colls={this.props.colls}/>
        <titleInCollection onAuthorChanged={this.setAuthor} coll={this.state.coll}/>
      </div>
    );
  }
});
module.exports=collections;