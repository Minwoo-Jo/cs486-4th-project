import React from 'react';
import Socket from 'socket.io-client';
import './Wait.css';

class Wait extends React.Component{
    constructor(props) {
        super(props);
       
      }
    static defaultProps={
        name : '기본이름'
    }
    render(){
        return (  
            <div>{this.props.name}</div>
        );
    }
}

export default Wait;