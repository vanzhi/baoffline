import React, { Component } from 'react';
import { Route } from 'react-router-dom';

const station = () => {
    return (
        <div>123</div>
    )
}

class Middle extends Component {
    render () {
        return (
            <div>
                <Route path="/" component={station}></Route>
            </div>
        );
    }
}

export default Middle;