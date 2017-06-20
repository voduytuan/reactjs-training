define([
    'react'
], function(
    React
){
    var CommentDeleteComponent = React.createClass({
        delete: function(e) {
            e.preventDefault();

            this.props.showerror();
        },
        render: function(){
            return (
                <a href="#" onClick={this.delete}>&times;</a>
            )
        }
    });

    return CommentDeleteComponent;
});
