import React, { Component } from 'react';

class Option extends Component {
    static defaultProps = {
        info: {
            name: '이름'
        }
    }

    render() {
        const {name} = this.props.info;

        return (
            <div className="form-check">
                <label>
                    <input
                        type="radio"
                        name="react-tips"
                        value= {name}
                        className="form-check-input"
                    />
                    {name}
                </label>
            </div>
        )
    }

    
}

export default Option;