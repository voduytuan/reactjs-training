define([
    'react'
], function(
    React
){
    var WelcomeComponent = React.createClass({
        componentDidMount: function() {
        },
        render: function(){
            return (
                <h1>Hello world</h1>
            )
        }
    });

    return WelcomeComponent;
});
