import React from 'react';
import './Wait.css';
import {getRoomList,enterRoom} from '../api/customSocket'

class Wait extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            roomList:[]//room name, user count
        }
        this.setState({
            roomList : this.state.roomList.concat(props.list)
        })
        getRoomList((err,msg)=>{
            console.log(msg)
            this.setState({
                roomList:this.state.roomList.splice(0,this.length).concat(msg)
            })
        })
      }
      onClickButton(){
      console.log("cliecked");
      enterRoom("room.id구해서 보내기")
    }
    render(){
        var cnt=1;
        const list = this.state.roomList.map(room =>
            <div>
                <div>{cnt++}.room name   <div class="button_base b01_simple_rollover" onClick={this.onClickButton}>입장</div> </div>
                <p></p>
                사람 수<div class="back"></div>
                <br>
                </br>
                <br></br>
            </div>);
        return (  
            <div>{list}</div>
        );
    }
}

export default Wait;
//입장버튼 활성화가 게임 시작 안했고 숫자 안찼을때