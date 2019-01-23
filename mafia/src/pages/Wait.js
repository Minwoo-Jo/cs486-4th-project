import React from 'react';
import './Wait.css';
import {getRoomList,enterRoom,createRoom} from '../api/customSocket'
import buttonUnclick from '../images/button_unclick.png'

class Wait extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            roomList:[],//room name, user count
            showRoomList:false
        }
        this.setState({
            roomList : this.state.roomList.concat(props.list)
        })
        getRoomList((err,msg)=>{
            console.log("getroomlist")
            console.log(msg)
            this.setState({
                roomList:msg,
                showRoomList : true
            })  
        })
         this.onClickButton = this.onClickButton.bind(this);
      }
    onClickButton(msg){
        console.log("clicked")
        enterRoom(msg)
    }
    onCreateRoom(){
        createRoom();
    }
    getStatus(state)
    {
        if(state==null) return "";
        else return "현재 상태 : "+state;
    }
    getMessage(state){
        if(state==="000000") return "로비로"
        else return state;
    }
    render(){
        var cnt=1;
        const list = this.state.roomList.map(room =>{
            if(room.id !="000000"){return(
            <div>
                <div>{cnt++}.{this.getMessage(room.id)} </div><br></br>
                {room.players.length}명 {this.getStatus(room.state)}
                <p></p><button onClick={()=>this.onClickButton(room.id)}>
                <img id="buttonImage" src={buttonUnclick} alt="button image" />
                <div class="centered">입장</div>
             </button>
               <div class="back"></div>
                <br>
                </br>
                <br></br>
        </div>)}});
        return (
            this.state.showRoomList ? <div>{list}<button onClick={()=>this.onCreateRoom()}><div class="centered">방만들기</div><img id="buttonImage" src={buttonUnclick} alt="button image" /></button></div>: <div></div>
        )
    }
}

export default Wait;
//입장버튼 활성화가 게임 시작 안했고 숫자 안찼을때