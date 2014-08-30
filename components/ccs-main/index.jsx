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
    return {};
  },
  tofindchanged:function(tofind) {
    
  },
  setAuthor:function(author) {
    this.setState({author:author});
  },
  render: function() {
    return ( 
      <div>
        <h2>中國叢書目錄檢索系統</h2>
        <div>
        <div className="col-md-4">
          <inputs placeholder="書名" onChange={this.tofindchanged}></inputs>
          <titleList/>
        </div>
        <div className="col-md-4">
          <collections onAuthorChange={this.setAuthor}></collections>
        </div>
        <div className="col-md-4">
          <authors author={this.state.author}></authors>
        </div>
        </div>
      </div>
    );
  }
});
module.exports=main;