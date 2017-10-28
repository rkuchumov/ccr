import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Channels } from '../../api/channels.js';

import Channel from '../components/Channel.jsx';

class Monitor extends Component {

  componentDidMount() {
    this.refs.grid.setAttribute('uk-grid', '');
    this.refs.grid.setAttribute('uk-sortable', 'handle: .sortable-handle');
  }

  renderChannels() {
    return this.props.channels.map((channel) => {
      return (
        <Channel key={channel._id} channel={channel} />
      );
    });
  }

  render() {
    return (
      <div className="uk-container uk-container-expand">
        <div ref="grid" className="channels-grid uk-flex-center uk-grid-small uk-margin-top">
          {this.renderChannels()}
        </div>
      </div>
    );
  }
}

Monitor.propTypes = {
  channels: PropTypes.array.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('channels');

  return {
    channels: Channels.find({}).fetch()
  };
}, Monitor);
