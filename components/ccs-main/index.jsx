/** @jsx React.DOM */
var bootstrap=Require("bootstrap");
var titles=Require("titles");
var authors=Require("authors");
var collections=Require("collections");
var inputs=Require("inputs");
var titleList=Require("titlelist");
var api=Require("api");

var main = React.createClass({
  getInitialState: function() {
    return {titles:[],author:"",colls:[],coll:""};
  },
  tofindchanged:function(tofind) {
    var titles=api.search.findTitle(tofind);
    var colls=api.search.findCollection(tofind);
    this.setState({titles:titles,colls:colls});
  },
  setAuthor:function(author) {
    this.setState({author:author});
  },
  setColl:function(coll,title) {
    this.setState({coll:coll,title:title});
  },
  render: function() {
    return ( 
      <div>
        <h2>中國古籍叢書目錄檢索系統</h2>

        <div>
        <div className="col-md-4">
          <inputs def="農" placeholder="書名" onChange={this.tofindchanged}></inputs>
          <titleList onCollChanged={this.setColl} 
          titles={this.state.titles}/>
        </div>
        <div className="col-md-4">
          <collections 
             coll={this.state.coll} 
             title={this.state.title} 
             colls={this.state.colls} 
             onAuthorChanged={this.setAuthor} />
        </div>
        <div className="col-md-4">
          <authors 
             onCollChanged={this.setColl} 
             author={this.state.author}></authors>
        </div>
        </div>
      </div>
    );
  }
});
module.exports=main;