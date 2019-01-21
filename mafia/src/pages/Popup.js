import React, { Component } from 'react';
import Option from './Option';

class Popup extends Component {
    static defaultProps = {
        data: []
    }

    render() {
        const {  data  } = this.props;
        const list = data.map(
            info => (<Option key={info.id} info={info}/>)
        );

        return (
            <div>
                {  list  }
                <button>투표하기</button>
            </div>
        )
    }
}

export default Popup;