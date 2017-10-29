import React, { Component } from 'react';
import moment from 'moment';

class Caption extends Component {
  render() {
    return (
      <tr>
        <td className="uk-table-shrink">
          {moment(this.props.caption.start).format('HH:mm:ss,SSS')}
        </td>
        {/* <td className="uk-table-shrink">+{this.props.caption.duration}</td> */}
        <td className="uk-table-expand uk-text-truncate">{this.props.caption.text}</td>
      </tr>
    );
  }
}

export default Caption;
