define([
    'react',
    'jsx!components/comment/item'
], function(
    React,
    CommentItemComponent
){
    var CommentListComponent = React.createClass({
        getInitialState: function() {
            return {
                comments: []
            }
        },
        changecolortogreen: function() {
            var self = this;
            this.state.comments.map(function(item){
                self.refs['commentitem-' + item.id].changecolortogreen();
            })

        },
        loadComments: function() {

            //ajax case
            // var self = this;
            // $.ajax({
            //     url: '',
            //     success: function(comments) {
            //         self.setState({
            //             comments: comments
            //         });
            //     }
            // })


            //Ajax here
            var comments = [
                {id: 1, fullname: 'Steve Jobs', text: "Hello world"},
                {id: 2, fullname: 'Bill Gates', text: "Hello hell"},
                {id: 3, fullname: 'Bill Gates 2', text: "Hello hell 2"}
            ];

            this.setState({
                comments: comments
            });

        },
        componentDidMount: function() {
            this.loadComments();
        },
        render: function(){
            var self = this;

            return (
                <div>
                    <h1>Comment List</h1>
                    <ol>
                    {
                        this.state.comments.length > 0 ? (
                            <div>Found {this.state.comments.length} item(s): <br />
                            {
                                this.state.comments.map(function(item) {
                                    return (
                                        <CommentItemComponent showerror={self.props.showErrorFromParent} ref={"commentitem-" + item.id} key={item.id} dulieu={item} />
                                    )
                                })
                            }
                            </div>
                        ) : (
                            <h2>Loading...</h2>
                        )
                    }

                    </ol>
                </div>
            )
        }
    });

    return CommentListComponent;
});
