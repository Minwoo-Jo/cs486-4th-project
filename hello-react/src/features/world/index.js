import React from 'react'
import Player from '../player'
import Map from '../map'
import socketIOClient from "socket.io-client"
var socket = socketIOClient("http://143.248.38.120");
var playerList = [1];

function World(props) {
    const list = playerList.map( x => <Player/>)
      return (
        <div
            style={{
                position: 'relative',
                width: '800px',
                height: '400px',
                margin: '20px auto'
            }}
        >
            <Map />
            {list}
        </div>
    )
}

function getSocket() {
       return socket;
}

export default World