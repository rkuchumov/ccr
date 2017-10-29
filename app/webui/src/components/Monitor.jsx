import React, { Component } from 'react';

import client from '../client';

import Channel from './Channel';

class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: []
    };
  }

  componentDidMount() {
    this.refs.grid.setAttribute('uk-grid', '');
    this.refs.grid.setAttribute('uk-sortable', 'handle: .sortable-handle');

    const channels = client.service('channels');

    channels.find().then(items => {
      this.setState({
        channels: items.data
      });
    });

    // XXX: in the current setup 'created' event is not emitted
    channels.on('created', channel => this.setState({
      channels: this.state.channels.concat(channel)
    }));
  }

  renderChannels() {
    return this.state.channels.map(channel => {
      return (<Channel key={channel._id} channel={channel} />);
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

export default Monitor;
