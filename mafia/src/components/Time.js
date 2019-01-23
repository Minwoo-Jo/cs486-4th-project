import React, { Component } from 'react';
import { rotateClock } from '../api/customSocket'
import clock from '../images/clock.png'

import './Time.css'

class Time extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rotation: 0,
            lineWidth: 2
        }
        this.setContext = this.setContext.bind(this)

        rotateClock((err, msg) => {
            this.setState({
                rotation: this.state.rotation + 1.5
            })
        })
    }

    componentDidMount() {
        const img = this.refs.image
        this.ctx.translate(80, 80)
        img.onload = () => {
            this.ctx.drawImage(img, -80, -80)
        }  
    }

    shouldComponentUpdate(nextProps, nextState) {
        let shouldUpdate = this.state.rotation !== nextState.rotation

        return shouldUpdate
    }

    componentDidUpdate() {
        var pos = this.state.rotation * Math.PI/180
        this.drawHand(this.ctx, pos, 20)
    }

    drawHand(context, pos, length) {
        context.clearRect(-80, -80, 160, 160);
        context.drawImage(this.refs.image, -80, -80)
        context.beginPath()
        context.lineWidth = 5
        context.moveTo(0, 0)
        context.rotate(pos)
        context.lineTo(55,0)
        context.stroke()
        context.rotate(-pos)
    }

    setContext(r) {
        this.ctx = r.getContext("2d")
    }

    render() {

        return (
            <div>
                <canvas ref={this.setContext} width={160} height={160} />
                <img ref="image" src={clock} alt="clock png" className="hidden" />
            </div>
        )
    }
}

export default Time;