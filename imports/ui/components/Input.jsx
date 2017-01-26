import React, { Component, PropTypes } from 'react';

import { Random } from 'meteor/random';

export default class InputText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = Random.id();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  value() {
    return this.state.value;
  }

  setValue(value) {
    if (!value)
      value = '';

    this.setState({value: value});
  }

  render() {
    return (
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor={this.id}>{this.props.label}</label>
        <div className="uk-form-controls">
          {this.props.type == 'textarea' ? (
            <textarea
              className="uk-textarea"
              id={this.id}
              rows={this.props.rows}
              placeholder={this.props.placeholder}
              value={this.state.value}
              onChange={this.handleChange}>
            </textarea>
          ) : (
            <input
              className="uk-input" id={this.id}
              type="text"
              placeholder={this.props.placeholder}
              name={this.props.name}
              value={this.state.value}
              onChange={this.handleChange}
            />
          )}
        </div>
      </div>
    );
  }
}

InputText.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};

