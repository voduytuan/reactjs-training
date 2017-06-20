define([
    'react',
    'jsx!components/comment/commentlist'
], function(
    React,
    CommentListComponent
){

    var CommentComponent = React.createClass({
        changeColor: function(e) {
            this.refs.commentlist.changecolortogreen();
        },
        showError: function() {
            alert('Has error');
        },
        componentDidMount: function() {
        },
        render: function(){
            return (
                <form className="ui form" method="POST">
                  <div className="field">
                    <label>Your Name</label>
                    <input type="text" name="fullname" placeholder="Your name" />
                  </div>

                  <div className="field">
                    <label>Leave your comment:</label>
                    <textarea rows="3"></textarea>
                  </div>

                  <button className="ui green button" type="submit">Submit</button>

                  <button className="ui blue button" onClick={this.changeColor} type="button">Change Color</button>

                  <CommentListComponent ref="commentlist" showErrorFromParent={this.showError} />
                </form>

            )
        }
    });

    return CommentComponent;
});
