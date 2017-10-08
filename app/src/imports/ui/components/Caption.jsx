import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class Caption extends Component {
  render() {
    return (
      <tr>
        <td className="uk-table-shrink">
          {moment(this.props.caption.start).format('HH:mm:ss,SSS')}
        </td>
        <td className="uk-table-shrink">+{this.props.caption.duration}</td>
        <td className="uk-table-expand uk-text-truncate">{this.props.caption.text}</td>
      </tr>
    );
  }
}

Caption.propTypes = {
  caption:           PropTypes.object.isRequired,
  // TODO: check object fields
  // caption.start:     PropTypes.string.isRequired,
  // caption.duration:  PropTypes.string.isRequired,
  // caption.mode:      PropTypes.string.isRequired,
  // caption.text:      PropTypes.string.isRequired,
};

