import React from 'react';
import './Home.css';
import Wait from './Wait'
import Main from './Main'
import {sendName,callRoomList} from '../api/customSocket'
import mafiaLogo from '../images/mafia.gif'

import forest from '../images/forest.jpg'
//백그라운드 사진 
var backgroundStyle = {
    backgroundImage: `url(${forest})`
}

class Home extends React.Component{
    constructor(){
        super()
        this.state={
            myName:"",
            List:[],
            clicked:false,
            showWait : true
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
      if(this.state.myName !==""){
        callRoomList()
        sendName(this.state.myName);
        this.setState({
            clicked : true
        })
      }
    }

    render(){
        return (  
            <div class="wrapper">
            <div class="header">
                <img id="logo" src={mafiaLogo} alt="mafialogo"/>
                <div id="textinput">
                    <input type="text" placeholder="이름을 입력해주세요" id = "getName" value = {this.state.myName} onChange={this.handleChange}/>  
                        <button onClick={this.onClickButton} disabled={this.state.clicked}>
                        시작!
                        </button>
                </div>
                
            </div>
        {/* 게임상태에 따라 버튼 클릭 가능 불가능 하게 만들기 */}

         <div class="rightCol" style={  backgroundStyle  }>
         <Wait/>
         </div>

         <div class="mid" style={  backgroundStyle  }>
         <Main/>             
         
         </div>
        </div>        
        );
    }
}

export default Home;