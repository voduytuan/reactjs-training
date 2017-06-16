define([
    'react',
    'jsx!components/comment'
], function(
    React,
    CommentComponent
){

    var initialize = function(){
        React.render(React.createElement(CommentComponent, {}), document.getElementById('container'));
    }

    return {
        initialize: initialize
    };
});
