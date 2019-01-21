import React, { Component } from 'react';
import {sendMessage,getRoomStatus,getGameResult,getTime,sendReady,getID,rotateClock} from '../api/customSocket'
import {Popup} from './Popup'
import Time from '../components/Time'
import './Main.css';

// 사진 가져오기
import fire from '../images/fire.gif'
import char1 from '../images/char1.gif'
import char2 from '../images/char2.gif'
import char3 from '../images/char3.gif'
import char4 from '../images/char4.gif'
import char5 from '../images/char5.gif'
import char6 from '../images/char6.gif'
import char7 from '../images/char7.gif'
import char8 from '../images/char8.gif'
import forest from '../images/forest.jpg'

//백그라운드 사진 
var backgroundStyle = {
    backgroundImage: `url(${forest})`
}

let charCounter = 0

class Main extends Component {
    timer; 
    constructor(props) {
        super(props);
        this.state = {
            room_id: "000000",
            players: [{
                name:"test1"
            },
            {
                name:"test2"
            },
            {
                name:"test4"
            }],
            status : "wait",
            isHidden: true,
            message : "",
            inGameStatus : "",
            vote : 0,
            charactersList: [char1,char2,char3,char4,char5,char6,char7,char8]
        }
        this.onHandleChange = this.onHandleChange.bind(this)
        this.onClickButton = this.onClickButton.bind(this)
        this.ready = this.ready.bind(this)
        getRoomStatus((err,msg)=>{
            console.log("get room status")
            console.log(msg)
            this.setState({
                room_id : msg.id,
                players: msg.players,
                status : msg.state,
                inGameStatus : msg.in_game_status
            })
            if(this.state.inGameStatus === "voting" && this.state.isHidden === true)
            {
                this.setState({
                    isHidden : false
                })
            }
            else if(this.state.inGameStatus === "night")
            {
                this.setState({
                    isHidden:true
                })
            }
        })
      /*  getJoinRoomInfo((err,msg)=>{
            console.log(msg)
            this.setState({
                room_id:msg.id,
                players : msg.players,
                isPlaying : msg.isPlaying
            })*/
            // var mafiaNum=0,totalPlayer;
            // totalPlayer = this.state.players.length;

            // for(var i = 0 ; i < this.state.players.length ; i++)
            //  {
            //     switch(this.state.players[i].role)
            //     {
            //         case "mafia":
            //         mafiaNum++;
            //         break;
            //     }
            // }

            // if(mafiaNum==0){
            //     this.setState({
            //         isEnd : true
            //     })//클라이언트에 끝났다고 알리기
            // }
            // else if(mafiaNum*2>totalPlayer){
            //     this.setState({
            //         isEnd : true
            //     })//클라이언트에 끝났다고 알리기
            // } 서버쪽으로 옮기기~ 
       // }

        //get join room info, get room status 합치기!
     //   )
        getGameResult((err,msg)=>{
            console.log("get game result")
            this.setState({
                isEnd : msg.isEnd//게임 결과도 나중에 받아오기
            })
        })
        //game result를 받아온다는 것은 게임이 끝났다는 것, 결과 출력 후 isplaying을 false로 바꾸어준다
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
    // hideWithTimer() {
    //     this.timer = setTimeout(() => {
    //         // this.toggleHidden()
    //         this.setState({
    //             isHidden: true
    //         })
    //     }, 10000)
    // }
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
    toggleHidden() {
        this.setState({
            isHidden: !this.state.isHidden
        })
     //   this.hideWithTimer()
    }
    getMyPlayer(){
        return this.state.players.find((player) => {
            return player.id === getID()
        })
    }
    onHandleChange(e) {
        this.setState({
            message: e.target.value
        })
    }
    ready(){
        sendReady()
    }
    checkReady(state){
        if(state==true)
        {
            return "ready"
        }
        else{
            return "not ready"
        }
    }
    onClickButton(e){
        if(this.state.message !==""){
        sendMessage(this.state.message)
        this.setState({
              message : ""
          })
        }
    }  
    
    update(value){
        this.setState({
            isHidden : true
         })
    }

    render() {
        const characters = this.state.players.map((player) => 
        {
            if(player.message != null) {
                return (
                <div>
                <p id={"msg" + charCounter} >{player.message}</p>
                <img id={"char" + charCounter} src = {this.state.charactersList[charCounter++]} alt="image테스트"/>
                </div>
                )
            }
            else {
                return (
                <div>
                    <img id={"char" + charCounter} src = {this.state.charactersList[charCounter++]} alt="image테스트"/>
                </div>
            )
            }
            
        }

        ); charCounter = 0
        // if(this.state.status === null || this.state.room_id ==="000000")//username 입력 하기도 전 처음 상태
        // {
        //     return(
        //         <div>마피아 게임 rule</div>
        //     )
        // }
        // else if(this.state.status==="wait" || this.state.status ==="ready")//게임 대기중
        // {
        //      const list = this.state.players.map(player =>
        //     <div>
        //         <br/>
        //         <br/>
        //         {player.name} : {this.checkReady(player.isReady)}
        //         <br/>
        //         <br/>
        //         {player.message}
        //         <br/>
        //         <br/>
        //     </div>);
        //     return(
        //         <div>{list}
        //          <input ref={(ref) => this.test = ref} type="text" placeholder="chat" value = {this.state.message} onChange={this.onHandleChange}/>  
        //     <button onClick={this.onClickButton}>채팅</button><button onClick={this.ready}>Ready</button></div>
        //     )
        // // }
        // else if(this.state.status === "playing"){//게임 플레이중
        const list = this.state.players.map(player =>
            <div>
                <div>{player.message}</div>
                <p></p>
                {player.name} 
                <br>
                </br>
                <br></br>
            </div>);
        return(
        <div class="mainbody">
            <div class="gamebody" style={  backgroundStyle  }>
                <Time />
                <img id="fire" src={fire} alt="fire gif"/>
                { characters }

                <div>
                {!this.state.isHidden &&<div><Popup players={this.state.players} vote={this.update.bind(this)} />
                </div>}
                </div> 
            </div>
            <div class="chatbody">
                <input
                     type="text" placeholder="이름을 입력하세요~"
                    value={this.state.message}
                    onChange={this.onHandleChange}></input> 
                <button onClick={this.onClickButton}>SEND</button>
            </div>   
        </div>
        )
        }
        // console.log(this.state.state)
        // return(
        //     <div>error</div>
        // )
 //  }
}

export default Main;