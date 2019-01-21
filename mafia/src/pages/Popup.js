import React, { Component } from 'react';

export class Popup extends Component {
    constructor(props){
        super(props)
        this.state = {
            vote : 1,
            players : []
        }
    }

    render() {

        const list = this.props.players.map(player => 
            <div className="form-check">
                <label>
                    <input
                        type="radio"
                        name="react-tips"
                        value= {player.name}
                        className="form-check-input"
                    />
                    {player.name}
                </label>
            </div>
        );

        return (
            <div>
                {  list  }
                <button onClick={()=>this.props.vote(this.state.vote)}>투표하기</button>
            </div>
        )
    }
}

export default Popup;