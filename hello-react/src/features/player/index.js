import React from 'react'
import {connect} from 'react-redux'
import circle from './circle.PNG'
import handleMovement from './movement'

function Player(props) {
    return (
        <div
        style = {{
            position: 'absolute',
            top: props.position[1],
            left: props.position[0],
            backgroundImage: `url(${circle})`,
            backgroundPosition: '0 0',
            width: '70px',
            height: '69px'
        }}
        />
    )
}

function getState(fn1, fn2) {
    return function(component) {
        return component
    }
}

function mapStateToProps(state) {
    return{
        ...state.player,
        // position: state.player.position,
        // hairColor: stat.player.hairColor
    }
}

export default connect(mapStateToProps)(handleMovement(Player))