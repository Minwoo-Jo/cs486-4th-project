import React, { Component } from 'react';
import {sendMessage,getRoomStatus,getGameResult,getTime,sendReady,getID,getMessage,rotateClock} from '../api/customSocket'
import Popup from './Popup'
import Time from '../components/Time'
import './Main.css';

// 사진 가져오기
import fire from '../images/fire.gif'
import char1 from '../images/char1.gif'
import char2 from '../images/char2.gif'
import forest from '../images/forest.jpg'

//백그라운드 사진 
var backgroundStyle = {
    backgroundImage: `url(${forest})`
}

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
            status : "onCreate",
            isHidden: true
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
        // getMessage((err,msg)=>{
            //메세지는 어떻게 처리하는것이 좋을까?
            //player에 포함되는데 전체로 받으면 3초만 띄우는것이 가능할까?
            //change가 생긴 경우 3초 띄우는 형식 vs 메세지를 아예 따로 받아 한번만 받게 만드는 경우
        // })
    }
    hideWithTimer() {
        this.timer = setTimeout(() => {
            // this.toggleHidden()
            this.setState({
                isHidden: true
            })
        }, 10000)
    }

    toggleHidden() {
    
        this.setState({
            isHidden: !this.state.isHidden
        })
        this.hideWithTimer()
    }
    getMyPlayer(){
        return this.state.players.find((player) => {
            return player.id === getID()
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
        if(this.state.status === "onCreate")//username 입력 하기도 전 처음 상태
        {
            return(
                <div>이름을 입력하세요!</div>
            )
        }
        else if(this.state.status ==="wait" || this.state.status ==="ready")//게임 대기중
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
                <div>{list}<button onClick={this.ready}>Ready</button></div>
            )
        }
        else if(this.state.status === "playing"){//게임 플레이중
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
                <section class="mainbody">
                <div class="gamebody" style={  backgroundStyle  }>
                    <Time />
                    <img id="fire" src={fire} alt="fire gif"/>
                    <img id="char1" src={char1} alt="char1 gif"/>
                    <img id="char2" src={char2} alt="char2 gif"/>
                </div>

                <div class="chatbody">
                    {/* {list} */}
                    <input
                        value={this.state.message}

                        onChange={this.handleChange}></input> 

                    <button onClick={()=>sendMessage(this.state.message)}>SEND</button>
)
                    <div>{this.state.message}</div>
                </div>
                <div>
                    {!this.state.isHidden && <Popup data={this.state.players} />}
                    <button onClick={this.toggleHidden.bind(this)}>
                        show vote
                    </button>
                    
                </div> 
            </section>
            )
        }
        else if(this.state.state === "end"){//게임 완료
            return(
                <div>Result</div>
            )
        }
        console.log(this.state.status)
        return(
            <div>error</div>
        )
    }
}

export default Main;