import React, { Component } from 'react';
import {sendVote} from '../api/customSocket'
import buttonUnclick from '../images/button_unclick.png'

export class Popup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            players : this.props.players,
            status : this.props.status,
            role : this.props.role,
            vote : 0,
            selected : ''
        }
        this.handleOptionChange = this.handleOptionChange.bind(this)
    }
    vote() {
       this.props.vote(this.state.vote)
       sendVote(this.state.selected)
    }

    handleOptionChange(e) {
        this.setState({
            selected: e.target.value
        })
        console.log(e.target.value)
    }

    render() {
       if (this.props.status === "voting") {
            console.log("render voting")
            const list = this.props.players.map(player => {
                if (player.isAlive === true) {
                    return (
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio"
                                    name="react-tips"
                                    value={player.id}
                                    className="form-check-input"
                                    checked={this.state.selected === player.id}
                                    onChange = {this.handleOptionChange}
                                />
                                {player.name}
                            </label>
                        </div>
                    )
                }
            }
            );
            return (<div>{
                !(this.props.isHidden) &&
                <div>{list}<button onClick={() => this.vote()}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                <div class="centered">VOTE</div></button></div>
            }</div>
            ) 
        }
        else if (this.props.status === "night") {
            switch (this.props.role) {
                case "mafia":
                    const list1 = this.props.players.map(player => {
                        if (player.role !== "mafia" && player.isAlive === true) {
                            return (
                                <div className="form-check">
                                    <label>
                                        <input
                                            type="radio"
                                            name="react-tips"
                                            value={player.id}
                                            className="form-check-input"
                                            checked={this.state.selected === player.id}
                                            onChange = {this.handleOptionChange}
                                        />
                                        {player.name}
                                    </label>
                                </div>
                            )
                        }
                    }
                    );
                    return (
                        <div>{
                            !(this.props.isHidden) &&
                            <div>{list1}<button onClick={() => this.vote()}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                            <div class="centered">VOTE</div></button></div>
                        }</div>
                    )
                case "police":
                    const list2 = this.props.players.map(player => {
                        if (player.role !== "police" && player.isAlive === true) {
                            return (
                                <div className="form-check">
                                    <label>
                                        <input
                                            type="radio"
                                            name="react-tips"
                                            value={player.id}
                                            className="form-check-input"
                                            checked={this.state.selected === player.id}
                                            onChange = {this.handleOptionChange}
                                        />
                                        {player.name}
                                    </label>
                                </div>
                            )
                        }
                    }
                    );
                    return (
                        <div>{
                            !(this.props.isHidden) &&
                            <div>{list2}<button onClick={() => this.vote()}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                            <div class="centered">VOTE</div></button></div>
                        }</div>
                    )
                case "doctor":
                const list3 = this.props.players.map(player => {
                    if ( player.isAlive === true) {
                        return (
                            <div className="form-check">
                                <label>
                                    <input
                                        type="radio"
                                        name="react-tips"
                                        value={player.id}
                                        className="form-check-input"
                                        checked={this.state.selected === player.id}
                                        onChange = {this.handleOptionChange}
                                    />
                                    {player.name}
                                </label>
                            </div>
                        )
                    }
                }
                    );
                    return (
                        <div>{
                            !(this.props.isHidden) &&
                <div>{list3}<button onClick={() => this.vote()}><img id="buttonImage" src={buttonUnclick} alt="button image" />
                <div class="centered">VOTE</div></button></div>
                        }</div>
                    )
                default://citizen
                    return (<div></div>)
            }
        }
        return <div> </div>
       }
}

export default Popup;