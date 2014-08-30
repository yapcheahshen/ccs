/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var titleList=Require("titlelist");
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
  renderTitle:function() {
  },
  render:function() {
    return <div>
    <titleList/>
    </div>
  }
});

var authors = React.createClass({
  shouldComponentUpdate:function(nextProps,nextState ) {
    var shouldupdate=(nextProps.author!=this.state.author || 
            nextState.author!=this.state.author || nextState.authors!=this.state.authors);
    if (nextProps.author!=this.state.author) {
      nextState.author=nextProps.author;
    }
    return shouldupdate;
  }, 
  componentWillUpdate:function() {
    api.search.findTitleByAuthor(this.state.author);
  },
  getInitialState: function() {
    return {author: this.props.author, authors:[]};
  },
  authorchanged:function(tofind) {
    var res=api.search.findAuthor(tofind);
    this.setState({authors:res});
  },
  setauthor:function(author) {
    var res=api.search.findTitleByAuthor(author);
    console.log(res);

  },
  render: function() {
    return (
      <div>
        <inputs ref="tofind" 
          placeholder="作者" def="貫" onChange={this.authorchanged}></inputs>
        <authorList setauthor={this.setauthor} authors={this.state.authors}/>
        <titleByAuthorList/>
      </div>
    );
  }
});
module.exports=authors;