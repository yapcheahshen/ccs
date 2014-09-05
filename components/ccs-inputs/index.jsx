/** @jsx React.DOM */
var inputs = React.createClass({
  getInitialState: function() {
    return {deftofind:this.props.def};
  },
  oninput:function() {
    var tofind=this.refs.tofind.getDOMNode().value;
    clearTimeout(this.timer);
    //bind context must be null to get rid of warning message
    this.timer=setTimeout( this.props.onChange.bind(null,tofind),300);
  },
  onkeypress:function(e) {
    var tofind=this.refs.tofind.getDOMNode().value;
    if (e&&e.key=="Enter") this.props.onChange(tofind);
  },
  componentDidMount:function() {
    this.onkeypress();
  },
  render: function() { 
    return (
      <div>
        [[[<input placeholder={this.props.placeholder} ref="tofind" onKeyPress={this.onkeypress} onInput={this.oninput}
          className="input input-lg form-control" defaultValue={this.state.deftofind}></input>
      </div>
    );
  }
});
module.exports=inputs;