/** @jsx React.DOM */
/* show directly when only one candidate */
var titleList=Require("titlelist");
var titles=Require("titles");
var api=Require("api");
var inputs=Require("inputs");
var dataset=Require("dataset"); 
var authorList=React.createClass({
  renderItem:function(author) {
    return <button data-author={author} className="btn btn-warning btn-xs btn-author">{dataset.authors[author]}</button> ;
  },
  selectAuthor:function(e) {
    var author=parseInt(e.target.dataset['author']);
    this.props.setauthor(author);
  },
  render:function() {
    var extra="";
    if (this.props.authors&&this.props.authors.length>50) {
      extra="Total:"+this.props.authors.length;
      this.props.authors.length=50;
    }
    return <div onClick={this.selectAuthor} >
      {this.props.authors.map(this.renderItem)}
      <span className="label label-danger">{extra}</span>
    </div>
  }
});
var titleByAuthorList=React.createClass({
  renderItem:function(T) {
    return <div>
      <button className="btn btn-primary btn-xs">{dataset.collnames[T[0]]}</button>
      <titles onAuthorChanged={this.props.setauthor} titles={T[1]} authorid={this.props.authorid}/>
    </div>
  },
  render:function() {
    return <div>
      {this.props.titles.map(this.renderItem)}
    </div>
  }
});

var authors = React.createClass({
  componentWillUpdate:function() {
    //api.search.findTitleByAuthor(this.state.author);
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.author!=this.props.author) {
      nextState.author=nextProps.author;
      var author=nextState.author, that=this;
      setTimeout(function(){
        that.setauthor(author);
      },10);
    }
    return true;
  },
  getInitialState: function() {
    return {author: this.props.author, authors:[] ,titles:[]};
  },
  authorchanged:function(tofind) {
    var res=api.search.findAuthor(tofind);
    this.setState({authors:res});
  },
  setauthor:function(authorid) {
    var res=api.search.findTitleByAuthor(authorid);
    this.setState({titles:res,authorid:authorid});
  },
  render: function() {
    return (
      <div>
        <inputs ref="tofind" 
          placeholder="作者" def="貫" onChange={this.authorchanged}></inputs>
        <authorList setauthor={this.setauthor} 
            authors={this.state.authors}/>
        <titleByAuthorList setauthor={this.setauthor} 
            authorid={this.state.authorid} titles={this.state.titles}/>
      </div>
    );
  }
});
module.exports=authors;