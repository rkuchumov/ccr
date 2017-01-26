import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Channels } from '../../api/channels.js';

import ChannelModal from '../components/ChannelModal.jsx';
import Channel from '../components/Channel.jsx';

class Monitor extends Component {

  componentDidMount() {
    this.refs.grid.setAttribute('uk-grid', '');
    this.refs.grid.setAttribute('uk-sortable', 'handle: .sortable-handle');
    this.refs.newChannel.setAttribute('uk-toggle', 'target: #channel-modal');
  }

  renderChannels() {
    return this.props.channels.map((channel) => {
      return (
        <Channel
          key={channel._id}
          channel={channel}
          onChannelEdit={(channel) => {this.refs.channelModal.setChannel(channel)}}
        />
      );
    });
  }

  render() {
    return (
      <div className="uk-container uk-container-expand">
        <div className="uk-margin-top uk-width-1">
          <a ref="newChannel"
            className="uk-button uk-button-primary uk-button-small"
            onClick={() => {this.refs.channelModal.setChannel(null);}}
            href="#">
            New Channel
          </a>
        </div>
        <div ref="grid" className="channels-grid uk-flex-center uk-grid-small uk-margin-top">
          {this.renderChannels()}
        </div>
        <ChannelModal ref="channelModal" />
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
