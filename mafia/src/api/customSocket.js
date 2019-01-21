import openSocket from 'socket.io-client';
const socket = openSocket("http://143.248.38.120:80");

function sendMessage(message){
    console.log("send message");
    socket.emit('send_message', message);
}//채팅할때 message를 보내준다

function sendName(message){
    socket.emit("set_name",message);
}//user의 이름과 소켓id를 연결시켜주는 함수

function getRoomList(cb){
    socket.on('update_room_list',rooms=>cb(null,rooms));
}//현재 서버에 존재하는 room들의 정보를 받아오는 함수

function callRoomList(){
    console.log("call Room List")
    socket.emit("update_room_list");
}//이 함수를 호출하면 room list를 다시 update한다

function enterRoom(message){
    console.log("room id " + message);
    socket.emit("join_room",message)//들어간 방 정보
}

function getRoomStatus(cb){
    socket.on('update_room_status',roomInfo=>cb(null,roomInfo));
}//들어와있는 방의 정보를 받아오는 함수, 로비가 아니라면 모두 ready 상태라면 게임 시작을 해준다

function createRoom(){
    console.log("create room");
    socket.emit("create_room");
}

function getGameResult(cb){
    socket.on('update_game_result',result =>cb(null,result));//게임이 끝나는 경우 서버에서 결과 받아오는 함수, 지금은 일단 Main.js에 틀 구현해놓음, 서버로 옮겨야함
}

function getTime(cb){
    socket.on('get_time',time=>cb(null,time));//서버로 부터 시간 받아오는 함수
}

function sendReady(){
    socket.emit("send_ready");//send ready는 is Ready를 반대로 바꾸어준다
}

function getID(){
    return socket.id
}

function getMessage(cb){
    socket.on("update_message", message=>cb(null,message));
}//필요없으면 지우기
function rotateClock(clock) {
    socket.on("time_test", seconds=> clock(null,seconds));
}
export { sendMessage,sendName,getRoomList,callRoomList,enterRoom,getRoomStatus,createRoom,getGameResult,getTime,sendReady,getID,getMessage,rotateClock}