import React, { Component } from 'react';
import {sendMessage,getRoomStatus,sendReady,getID,checkPeople} from '../api/customSocket'
import {Popup} from './Popup'
import Time from '../components/Time'
import './Main.css';
import buttonUnclick from '../images/button_unclick.png'
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
            players_before:[],
            status : "wait",
            isHidden: false,
            message : "",
            inGameStatus : "",
            vote : 0,
            charactersList: [char1,char2,char3,char4,char5,char6,char7,char8],
            log:"",
            policelog:""
        }
        this.onHandleChange = this.onHandleChange.bind(this)
        this.onClickButton = this.onClickButton.bind(this)
        this.ready = this.ready.bind(this)
        this.voteFinish = this.voteFinish.bind(this)
        checkPeople((err,msg)=>{
            var string=""
            if(this.state.status==="playing"&&this.getMyRole()==="police"){
                console.log(msg)
                if(msg) string += "당신의 선택은 마피아가 맞습니다."
                else string += "당신의 선택은 마피아가 아닙니다."
            }
            this.setState({
                policelog : string
            })
            console.log(msg)
        })
        getRoomStatus((err,msg)=>{
            var string = "";
            if(this.state.status ==="playing"){
                var change = false;
            for(var i = 0 ; i < this.state.players.length ; i++)
            {
                if(!msg.players[i].isAlive && this.state.players[i].isAlive ){
                    console.log("&&&&&&&&&&&&&&&")
                    console.log(this.state.players[i].name)
                    string += this.state.players[i].name
                    string += " "
                    change = true
                }
            }
            if(change) string += "죽었습니다"
            console.log(string)
        }
            console.log("get room status")
            console.log(msg)
            this.setState({
                room_id : msg.id,
                players: msg.players,
                status : msg.state,
                inGameStatus : msg.in_game_status,
                log : string
            })
            if(this.state.inGameStatus === "voting" && this.state.isHidden === true)
            {
                console.log(this.state.inGameStatus)
                this.setState({
                    isHidden : false
                })
            }
            else if(this.state.inGameStatus === "night")
            {
                this.setState({
                    isHidden:false
                })
            }
            else if(this.state.inGameStatus === "day" && this.state.isHidden === false )
            {
                this.setState({
                    isHidden : true
                })
            }
        })
    }

    getMyPlayer(){
        return this.state.players.find((player) => {
            return player.id === getID()
        })
    }
    getMyRole(){
        var ID = getID()
        for(var i = 0 ; i < this.state.players.length ; i++)
        {
            if(ID===this.state.players[i].id){
                return this.state.players[i].role
            }
        }
    }
    amILive(){
        var ID = getID()
        for(var i = 0 ; i < this.state.players.length ; i++)
        {
            if(ID===this.state.players[i].id){
                console.log(this.state.players[i].isAlive)
                return this.state.players[i].isAlive
            }
        }
    }

    getMyStatus() {
       return this.state.inGameStatus
    }
    
    onHandleChange(e) {
        this.setState({
            message: e.target.value
        })
    }

    ready(){ sendReady()}

    checkReady(state){
        if(state===true) return "ready"
        else return "not ready"
    }

    onClickButton(e){
        if(this.state.message !==""){
        sendMessage(this.state.message)
        this.setState({
              message : ""
          })
        }
    }  
    voteFinish(value){
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
        const nightCharacters = this.state.players.map((player) => 
        {
            //시민은 메세지 볼수 없음
            //메세지가 있고 같은 직업이면 보임
            while(this.getMyRole() != "citizen") 
            {
                if (this.getMyRole() == player.role) {
                return(
                <div>
                    <p id={"msg" + charCounter} >{player.message}</p>
                    <img id={"char" + charCounter} src = {this.state.charactersList[charCounter++]} alt="image밤용"/>
                </div>
                )
            }
            else {
                return(
                <div>
                    <img id={"char" + charCounter} src = {this.state.charactersList[charCounter++]} alt="image밤용"/>
                </div>
                )
            }
            }
            return(
                <div>
                    <img id={"char" + charCounter} src = {this.state.charactersList[charCounter++]} alt="image밤용"/>
                </div>
            )
        }); charCounter = 0
        if(this.state.status === null || this.state.room_id ==="000000")//username 입력 하기도 전 처음 상태
        {
            return(
                <div></div>
            )
        }
        else if(this.state.status==="wait" || this.state.status ==="ready")//게임 대기중
        {
             const list = this.state.players.map(player =>
            <div class="fontt">
                <br/>
                {player.name} : {this.checkReady(player.isReady)}
                <br/>
                {player.message}
                <br/>
            </div>);
            return(
                <div>{list}
                 <input ref={(ref) => this.test = ref} type="text" placeholder="chat" value = {this.state.message} onChange={this.onHandleChange}/>  <br/><br/>
            <button onClick={this.onClickButton}><img id="buttonImage" src={buttonUnclick} alt="button image" /><br/>
                <div class="centered">CHAT</div></button><br/><button onClick={this.ready}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                <div class="centered">READY</div></button></div>
            )
        }
        else if(this.state.status === "playing" && this.amILive()===false){//게임 플레이중, day
            console.log("나는 죽어따")
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
                    <div>{this.getMyRole()}</div>
                    <div>죽었습니다</div>
                    <img id="fire" src={fire} alt="fire gif"/>
                    { characters }
                </div>
            </div>
              )
             }
        else if(this.state.status === "playing" && this.state.inGameStatus === "day"){//게임 플레이중, day
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
                <div>{this.getMyRole()}</div>
                <div>낮</div>
                <img id="fire" src={fire} alt="fire gif"/>
                { characters }
            </div>
            <div class="chatbody">
            <div>{this.state.policelog}</div>
            <div>{this.state.log}</div>
                <input
                     type="text" placeholder="Chat"
                    value={this.state.message}
                    onChange={this.onHandleChange}></input> <br/>
                <button onClick={this.onClickButton}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                <div class="centered">SEND</div></button>
            </div>   
        </div>
          )
         }
        else if(this.state.status === "playing" && this.state.inGameStatus === "voting")
        {
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
                    <div>{this.getMyRole()}</div>
                    <div>투표</div>
                    <img id="fire" src={fire} alt="fire gif"/>
                    { characters }
            <Popup isHidden = {this.state.isHidden} role = {this.getMyRole()} status = {this.getMyStatus()} players={this.state.players} vote ={this.voteFinish}/>
                </div>
                <div class="chatbody">
                <div>{this.state.policelog}</div>
                <div>{this.state.log}</div>
                    <input
                         type="text" placeholder="Chat"
                        value={this.state.message}
                        onChange={this.onHandleChange}></input> <br/>
                    <button onClick={this.onClickButton}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                <div class="centered">SEND</div></button>
                </div>   
            </div>
              )
        }
        else if(this.state.status === "playing" && this.state.inGameStatus === "night")
        {
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
                    <div>밤</div>
                    <div>{this.getMyRole()}</div>
                    <img id="fire" src={fire} alt="fire gif"/>
                    { nightCharacters }
            <Popup isHidden = {this.state.isHidden} role = {this.getMyRole()} status = {this.getMyStatus()} players={this.state.players} vote={this.voteFinish}/>
                </div>
                <div class="chatbody">
                <div>{this.state.policelog}</div>
                <div>{this.state.log}</div>
                    <input
                        id="chatInput"
                         type="text" placeholder="Chat"
                        value={this.state.message}
                        onChange={this.onHandleChange}></input> 
                        <br/>
                    <button onClick={this.onClickButton}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                <div class="centered">SEND</div></button>
                </div>   
            </div>
              )
        }
        else if(this.state.status === "playing" && this.state.inGameStatus ==="mafia_win")
        {
            {
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
                        <div>{this.getMyRole()}</div>
                        <div>마피아가 이겼습니다</div>
                        <img id="fire" src={fire} alt="fire gif"/>
                        { characters }
                    </div>
                </div>
                  )
            }
        }
        else if(this.state.status === "playing" && this.state.inGameStatus ==="citizen_win")
        {
            {
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
                        <div>{this.getMyRole()}</div>
                        <div>시민이 이겼습니다</div>
                        <img id="fire" src={fire} alt="fire gif"/>
                        { characters }
                    </div>                      
                </div>
                  )
            }
        }
        return(
            <div>error</div>
        )
 }
}

export default Main;