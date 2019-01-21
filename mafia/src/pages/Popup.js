import React, { Component } from 'react';

export class Popup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vote: 1,
            players : this.props.players,
            status : this.props.status,
            role : this.props.role,
            isHidden : false
        }
    }
    a() {
        this.props.vote(this.state.vote)
        this.setState({
            isHidden : true
        })
    }

    render() {
        console.log(this.state)
        if (this.props.status === "voting") {
            console.log("render voting")
            const list = this.props.players.map(player =>
                <div className="form-check">
                    <label>
                        <input
                            type="radio"
                            name="react-tips"
                            value={player.name}
                            className="form-check-input"
                        />
                        {player.name}
                    </label>
                </div>
            );
            return (<div>{
                !this.state.isHidden &&  <div>
                {list}
                <button onClick={() => this.a()}>투표하기</button>
            </div>
            }
               </div>
            ) 
        }
        else if (this.props.status === "night") {
            switch (this.state.role) {
                case "mafia":
                    const list1 = this.props.players.map(player => {
                        if (player.role !== "mafia") {
                            return (
                                <div className="form-check">
                                    <label>
                                        <input
                                            type="radio"
                                            name="react-tips"
                                            value={player.name}
                                            className="form-check-input"
                                        />
                                        {player.name}
                                    </label>
                                </div>
                            )
                        }
                    }
                    );
                    return (
                        <div>
                            {list1}
                            <button onClick={() => this.props.vote(this.state.vote)}>투표하기</button>
                        </div>
                    )
                case "police":
                    const list2 = this.props.players.map(player => {
                        if (player.role !== "police") {
                            return (
                                <div className="form-check">
                                    <label>
                                        <input
                                            type="radio"
                                            name="react-tips"
                                            value={player.name}
                                            className="form-check-input"
                                        />
                                        {player.name}
                                    </label>
                                </div>
                            )
                        }
                    }
                    );
                    return (
                        <div>
                            {list2}
                            <button onClick={() => this.props.vote(this.state.vote)}>투표하기</button>
                        </div>
                    )
                case "doctor":
                    const list3 = this.props.players.map(player =>
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio"
                                    name="react-tips"
                                    value={player.name}
                                    className="form-check-input"
                                />
                                {player.name}
                            </label>
                        </div>
                    );
                    return (
                        <div>
                            {list3}
                            <button onClick={() => this.props.vote(this.state.vote)}>투표하기</button>
                        </div>
                    )
                default:
                    return (<div></div>)
            }

        }
        return <div> </div >
    }
}

export default Popup;