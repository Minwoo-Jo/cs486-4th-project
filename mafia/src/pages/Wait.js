import React from 'react';
import './Wait.css';
import {getRoomList,enterRoom,createRoom} from '../api/customSocket'

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
        if(state=="000000") return "게임 설명 보기"
        else return state;
    }
    render(){
        var cnt=1;
        const list = this.state.roomList.map(room =>
            <div>
                <div>{cnt++}.{this.getMessage(room.id)} </div>
                <p></p><button onClick={()=>this.onClickButton(room.id)}>
             입장
             </button>
                {room.players.length}명 {this.getStatus(room.state)}<div class="back"></div>
                <br>
                </br>
                <br></br>
            </div>);
        return (
            this.state.showRoomList ? <div>{list}<button onClick={()=>this.onCreateRoom()}>방 만들기</button></div>: <div>주의사항</div>
        )
    }
}

export default Wait;
//입장버튼 활성화가 게임 시작 안했고 숫자 안찼을때