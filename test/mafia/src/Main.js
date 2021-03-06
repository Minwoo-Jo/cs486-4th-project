import React, { Component } from 'react';
import { subscribeGame } from "./api/CustomSocket"
import { sendMessage } from "./api/CustomSocket"
class Main extends Component {
    constructor() {
        super();
        this.state = {
            room_id: "000000",
            players: [],
            message: String
        }
        subscribeGame((err, msg)=> {
            this.setState({
                players: this.state.players.splice(0, this.length).concat(msg)
            })
        })
        // socket = socketIOClient("http://143.248.38.120");
 

        // socket.on('reload', (msg) => {
        //     this.setState({
        //         players: this.state.players.splice(0, this.length).concat(msg)
        //     })
        // })
    }
  
    handleSubmit = (e) => {
        // 페이지 리로딩 방지

        e.preventDefault();
        // 상태값을 onCreate 를 통하여 부모에게 전달
        this.props.onCreate(this.state);
        // 상태 초기화
        this.setState({
            message: ""
        }
        )
    }
    // sendMessage = () => {
    //     console.log("YEP")
    //     socket.emit('send message', this.state.message)

    // }
    handleChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }
    sendMessage = () => {
        sendMessage(this.state.message)
    }


    render() {
        const list = this.state.players.map(player =>
            <div>
                <div>{player.message}</div>
                <p></p>
                {player.id} 
                <br>
                </br>
                <br></br>
            </div>);
        return (
            <div>
                <hr></hr>
                {list}
                <input
                    value={this.state.message}
                    onChange={this.handleChange}></input> <button onClick={this.sendMessage}
                    >SEND</button>
                <div>{this.state.message}</div>
            </div>
        )
    }
}




export default Main;