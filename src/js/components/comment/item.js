define([
    'react',
    'jsx!components/comment/delete'
], function(
    React,
    CommentDeleteComponent
){
    var CommentItemComponent = React.createClass({

        getInitialState: function() {
            return {
                color: 'red',
                fullname: this.props.dulieu.fullname
            }
        },

        changecolortogreen: function() {
            this.setState({color: 'green'});
        },
        componentDidMount: function() {
            var self = this;
            setTimeout(function(){
                self.setState({fullname: self.state.fullname += ' NEW'});
            }, 2000);
        },

        render: function(){
            console.log('render');
            var style = {fontSize: 14, color: this.state.color};
            console.log(style);
            return (
                <li>
                    <strong className="fullnamecomment" style={style}>{this.state.fullname}</strong>
                    <p>{this.props.dulieu.text}</p>
                    <CommentDeleteComponent showerror={this.props.showerror} />
                </li>
            )
        }
    });

    return CommentItemComponent;
});
