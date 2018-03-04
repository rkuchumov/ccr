import React, { Component } from 'react';

import client from '../client';

import Caption from './Caption';

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: []
    };
  }

  onCaptionsAdded(cc) {
    if (cc.channel !== this.props.channel._id)
      return;

    var screen = Object.create(this.state.screen);

    var found = false;
    for (var i in screen) {
      if (screen[i].start !== cc.start)
        continue;
      screen[i] = cc;
      found = true;
    }

    if (!found)
      screen.push(cc);

    if (screen.length > 4)
      screen.shift();

    this.setState({screen: screen});
  }

  componentDidMount() {
    this.refs.tab.setAttribute('uk-tab', '');

    // XXX: handling all events is not efficient
    // TODO: implement pub/sub pattern
    const stream = client.service('stream');
    stream.on('created', cc => this.onCaptionsAdded(cc));

    const captions = client.service('captions');
    captions.find({
      query: {
        channel: this.props.channel._id,
        $sort: { start: -1 },
        $limit: 4
      }
    }).then(items => this.setState({screen: items.data}));
  }

  renderCaptions() {
    return this.state.screen.map((caption) => {
      return <Caption key={caption._id} caption={caption} />;
    });
  }

  render() {
    console.log(this.renderCaptions());
    if(this.renderCaptions().length!=0){
      return(
        <div className="uk-width-1@s uk-width-1-2@m uk-width-1-3@l uk-width-large@xl">
          <div className="uk-card uk-card-default uk-padding-small">

            <div className="uk-position-relative sortable-handle">
              <ul ref="tab" className="uk-flex-right uk-margin-remove-bottom">
                <li className="uk-active"><a href="">Captions</a></li>
              </ul>
              <div className="uk-position-top-left">
              <h4 className="uk-h4 uk-margin-remove-top uk-margin-remove-bottom uk-display-inline ">
                  <a ref="editChannel" href="#channel-modal"
                    className="uk-link-muted">
                    {this.props.channel.title}
                  </a>
                </h4>
              </div>
            </div>

            <table className="channel__table uk-table uk-margin-small uk-table-small uk-text-small">
              <tbody>
                {this.renderCaptions()}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return(
      <div className="uk-width-1@s uk-width-1-2@m uk-width-1-3@l uk-width-large@xl">
        <div className="uk-card uk-card-default uk-padding-small">

          <div className="uk-position-relative sortable-handle">
            <ul ref="tab" className="uk-flex-right uk-margin-remove-bottom">
              <li className="uk-active"><a href="">Captions</a></li>
            </ul>
            <div className="uk-position-top-left">
            <h4 className="uk-h4 uk-margin-remove-top uk-margin-remove-bottom uk-display-inline ">
                <a ref="editChannel" href="#channel-modal"
                  className="uk-link-muted">
                  {this.props.channel.title}
                </a>
              </h4>
            </div>
          </div>

          <div className="uk-spinner uk-icon uk-active uk-width-1-1 uk-flex uk-flex-center uk-padding-large">
            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" ratio="1">
              <circle fill="none" stroke="#000" cx="15" cy="15" r="14">
              </circle>
            </svg>
          </div>  
        </div>
      </div>  
    );
  }
}

export default Channel;
