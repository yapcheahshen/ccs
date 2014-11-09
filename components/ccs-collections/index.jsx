/** @jsx React.DOM */

var dataset=Require("dataset"); 
var titles=Require("titles");

var titleInCollection = React.createClass({
  setAuthor:function(author) {
    this.props.onAuthorChanged(author);
  },
  clicked:function(e) { 
    if (e.target.nodeName=="PR") {
      console.log("pr clicked" + e.target.innerHTML);
    }
  },
  render:function() {
    var titlesInCollection=dataset.collections[this.props.coll] || [];
    var collinfo=dataset.collinfos[this.props.coll];
    return <div>
      <h3 onClick={this.clicked} dangerouslySetInnerHTML={{__html:collinfo}} />
      <titles onAuthorChanged={this.setAuthor} 
        titles={titlesInCollection} coll={this.props.coll}
        title={this.props.title} />
    </div>
  }
});
/* show directly when only one candidate */
var collections = React.createClass({
  getInitialState: function() {
    return {coll:this.props.coll};
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.coll!=this.props.coll) {
      nextState.coll=nextProps.coll;
    }
    if (nextProps.title!=this.props.title) {
      nextState.title=nextProps.title;
    }

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
        <titleInCollection 
         onAuthorChanged={this.setAuthor} 
         title={this.props.title}
         coll={this.state.coll}/>
      </div>
    );
  }
});
module.exports=collections;