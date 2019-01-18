import React from 'react';
import Socket from 'socket.io-client';
import './Home.css';
import Wait from './Wait'
import Main from './Main'

var socket = Socket.connect("http://143.248.38.120:80");

class Home extends React.Component{
    constructor(){
        super()
        this.state={
            myName:"",
            List:""
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
        console.log(this.state.List)
        socket.emit("add name",this.state.myName);
        socket.on("get names",msg=>{
            this.setState({
                List : msg
            })
            console.log(this.state.List)
        })
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
             <Wait name={this.state.List}/>
             </div>

             <div class="mid">
             <Main/>             
             
             </div>
            </div>        
        );
    }
}



export default Home;