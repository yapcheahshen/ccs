/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var titlelist = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  }, 
  render: function() {
    return (
      <div>
        <p><span className="title">讀書筆記</span> <a className="btn btn-warning btn-xs">祝允明</a><br/>
           <a className="btn btn-primary btn-xs">廣說郛</a> <a className="btn btn-primary btn-xs">稗統</a></p>
        <p><span className="title">仁恕堂筆記</span> 　<a className="btn btn-warning btn-xs">黎士弘</a><br/>
        <a className="btn btn-primary btn-xs">賜硯堂叢書未刻稿</a></p>
      </div>
    );
  }
});
module.exports=titlelist;