import React, { Component } from 'react';
import { subscribeRoom } from './api/CustomSocket'
import { callRoomList } from './api/CustomSocket'
class Room extends Component {
    constructor() {
        super();

        this.state = {
            room_list : []
        }

        subscribeRoom((err, msg) => {
            this.setState({
                room_list: this.state.room_list.splice(0, this.length).concat(msg)

            })
        })
    }
    callRoomList = () => {
        callRoomList();
    }
  
    render() {
        const list = this.state.room_list.map(room => 
            <div>
                <div>{room}</div>
                <p></p>
                <br>
                </br>
                <br></br>
            </div>
        
        )
        return (
            <div>
                <button onClick={this.callRoomList}>룸</button>

                {list}

            </div>
        )
    }
}


export default Room;