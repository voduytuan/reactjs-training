define([
    'react'
], function(
    React
){
    var CommentComponent = React.createClass({
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

                </form>

            )
        }
    });

    return CommentComponent;
});
