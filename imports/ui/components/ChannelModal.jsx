import React, { Component, PropTypes } from 'react';

import Input from '../components/Input.jsx';

export default class ChannelModal extends Component {
  constructor(props) {
    super(props);

    this.state = { isNew: true, channelTitle: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.refs.modal.setAttribute('uk-modal', 'center: true');
    this.refs.close.setAttribute('uk-close', '');
  }

  setChannel(channel) {
    if (channel) {
      this.setState({ isNew: false, channelTitle: channel.title });

      this.refs.id.setValue(channel._id);
      this.refs.title.setValue(channel.title);
      this.refs.location.setValue(channel.location);
      this.refs.language.setValue(channel.language);
      this.refs.link.setValue(channel.link);
      this.refs.tags.setValue(channel.tags);
      this.refs.description.setValue(channel.description);

    } else {
      this.setState({ isNew: true, channelTitle: '' });

      this.refs.id.setValue('');
      this.refs.title.setValue('');
      this.refs.location.setValue('');
      this.refs.language.setValue('');
      this.refs.link.setValue('');
      this.refs.tags.setValue('');
      this.refs.description.setValue('');
    }
  }

  handleSubmit() {
    var channel = {
      _id: this.refs.id.value(),
      title: this.refs.title.value(),
      location: this.refs.location.value(),
      language: this.refs.language.value(),
      link: this.refs.link.value(),
      tags: this.refs.tags.value(),
      description: this.refs.description.value(),
    };

    Meteor.call('channel.upsert', channel);
  }

  render() {
    return (
      <div ref="modal" id="channel-modal">
        <div className="uk-modal-dialog">
          <button ref="close" className="uk-modal-close-default" type="button"></button>

            <div className="uk-modal-header">
              <h3 className="uk-modal-title">
                { this.state.isNew ? 'New Channel' : this.state.channelTitle }
              </h3>
            </div>

            <div className="uk-modal-body">
              <form className="uk-form-stacked" onSubmit={(e) => {e.preventDefault()}}>

                <Input label="Channel ID" ref="id" />
                <Input label="Title" ref="title" />

                <Input label="Location" ref="location" />
                <Input label="Language" ref="language"/>
                <Input label="Site link" ref="link"/>
                <Input label="Tags" ref="tags"/>

                <Input type="textarea" label="Description" ref="description" />
              </form>
            </div>

            <div className="uk-modal-footer uk-text-right">
              <button className="uk-button uk-button-default uk-modal-close" type="button" >Cancel</button>
              <button
                className="uk-button uk-button-primary uk-margin-left"
                type="button"
                onClick={this.handleSubmit}
              >
                { this.state.isNew ? 'Create' : 'Update' }
              </button>

            </div>

          </div>
        </div>
    );
  }
}

