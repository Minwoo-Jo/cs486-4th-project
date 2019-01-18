import store from '../../config/store'
import { CIRCLE_WIDTH} from '../../config/constants'
import { CIRCLE_HEIGHT} from '../../config/constants'
import World from '../world'

export default function handleMovement(player) {

    function getNewPosition(direction) {
        const oldPos = store.getState().player.position
        switch(direction) {
            case 'WEST':
                return [oldPos[0] - CIRCLE_WIDTH, oldPos[1]]
            case 'EAST':
                return [oldPos[0] + CIRCLE_WIDTH, oldPos[1]]
            case 'NORTH':
                return [oldPos[0], oldPos[1] - CIRCLE_HEIGHT]
            case 'SOUTH':
                return [oldPos[0], oldPos[1] + CIRCLE_HEIGHT]
        }
    }

    function dispatchMove(direction) {
        store.dispatch({
            type: 'MOVE_PLAYER',
            payload: {
                position: getNewPosition(direction)
            }
        })
    }

    function handleKeyDown(e) {
        e.preventDefault()
        socket.emit('playermove', e);

    }

    socket.on('handlemove', (msg) => {
        if(msg.id==socket.id){
        switch(msg.value) {
            case 37:
                return dispatchMove('WEST')
            case 38:
                return dispatchMove('NORTH')
            case 39:
                return dispatchMove('EAST')
            case 40:
                return dispatchMove('SOUTH')
            default:
                console.log(msg.value)
        }
    }
    })

    window.addEventListener('keydown', (e) => {
        handleKeyDown(e)
    })

    return player
}