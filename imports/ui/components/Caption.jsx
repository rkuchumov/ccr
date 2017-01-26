import React, { Component, PropTypes } from 'react';

export default class Caption extends Component {
  render() {
    return (
      <tr>
        <td className="uk-table-shrink">{this.props.caption.time}</td>
        <td className="uk-table-shrink">+{this.props.caption.duration}</td>
        <td className="uk-table-shrink">{this.props.caption.mode}</td>
        <td className="uk-table-expand uk-text-truncate">{this.props.caption.text}</td>
      </tr>
    );
  }
}

Caption.propTypes = {
  caption:           PropTypes.object.isRequired,
  // TODO: check object fields
  // caption.time:      PropTypes.string.isRequired,
  // caption.duration:  PropTypes.string.isRequired,
  // caption.mode:      PropTypes.string.isRequired,
  // caption.text:      PropTypes.string.isRequired,
};

