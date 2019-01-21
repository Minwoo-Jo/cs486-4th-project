import React from 'react';
import './Home.css';
import Wait from './Wait'
import Main from './Main'
import {sendName,callRoomList} from '../api/customSocket'

class Home extends React.Component{
    constructor(){
        super()
        this.state={
            myName:"",
            List:[]
        }
        this.handleChange = this.handleChange.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
    }

    handleChange(e){
        this.setState({
            myName:e.target.value
        })
    }

    onClickButton(){
        callRoomList()
        sendName(this.state.myName);
    }

    render(){
        return (  
            <div class="wrapper">
             <div class="header">Mafia
              <input type="text" placeholder="이름을 입력하세요~" id = "getName" value = {this.state.myName} onChange={this.handleChange}/>  
            <button onClick={this.onClickButton}>
             시작!
             </button></div>
            {/* 게임상태에 따라 버튼 클릭 가능 불가능 하게 만들기 */}

             <div class="rightCol">

             <Wait />

             </div>

             <div class="mid">
             <Main/>  
         
             
             </div>
            </div>        
        );
    }
}

export default Home;