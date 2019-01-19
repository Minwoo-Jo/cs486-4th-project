import React, { Component } from 'react';
import {sendMessage,getRoomStatus, getJoinRoomInfo,getGameResult,getTime,sendReady,getID} from '../api/customSocket'
import Popup from "reactjs-popup"

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room_id: "000000",
            players: [],
            isEnd : false,
            isPlaying:false,
            time : Number//시간형태?
        }
        getRoomStatus((err,msg)=>{
            console.log("get room status")
            console.log(msg)
            this.setState({
                room_id : msg.id,
                players: msg.players,
                isPlaying : msg.isPlaying
            })
        })
        getJoinRoomInfo((err,msg)=>{
            console.log(msg)
            this.setState({
                room_id:msg.id,
                players : msg.players,
                isPlaying : msg.isPlaying
            })
            var mafiaNum=0,totalPlayer;
            totalPlayer = this.state.players.length;

            for(var i = 0 ; i < this.state.players.length ; i++)
             {
                switch(this.state.players[i].role)
                {
                    case "mafia":
                    mafiaNum++;
                    break;
                }
            }

            if(mafiaNum==0){
                this.setState({
                    isEnd : true
                })//클라이언트에 끝났다고 알리기
            }
            else if(mafiaNum*2>totalPlayer){
                this.setState({
                    isEnd : true
                })//클라이언트에 끝났다고 알리기
            }
        }
        )
        getGameResult((err,msg)=>{
            console.log("get game result")
            this.setState({
                isEnd : msg.isEnd
            })
        })
        getTime((err,msg)=>{
            this.setState({
                time : msg
            })
            if(false/*낮인경우 */){
                if(true/*투표시간인 경우 */){

                }
            }else{
                /*밤인경우, 자신의 역할에 따라 하는 일이 달라짐 */
                
            }
        })
    }
    getMyPlayer(){
        return this.state.players.find((player) => {
            return player.id == getID()
        })
    }
    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }
    chat(){
        sendMessage(this.state.message)
    }
    ready(){
        sendReady()
    }

    render() {
        const list = this.state.players.map(player =>
            <div>
                <div>{player.message}</div>
                <p></p>
                {player.name} 
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
                    onChange={this.handleChange}></input> 

                 <button onClick={this.chat}>SEND</button>
                 <button onClick={this.ready}>Ready</button>
                 <Popup trigger={<button> Trigger</button>} position="right center">
    <div>Popup content here !!</div>
  </Popup>
            </div>
        )
    }
}

export default Main;