import React from 'react';
import { browserHistory } from 'react-router';
import request from 'superagent';

import Nav from './nav/nav.jsx';

require('./pages.css');


export default class Pages extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
      input: '',
    };

    this.inputWatcher = this.inputWatcher.bind(this);
    this.createChannel = this.createChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
  }

  inputWatcher(evt) {
    this.setState({ input: evt.target.value });
  }

  createChannel(evt) {
    evt.preventDefault();

    if (!this.state.input) {
      this.setState({ error: 'Please enter a name.' });
    } else {
      request
      .post('/api/channelInsert/')
      .send({
        name: this.state.input,
      })
      .end((err, res) => {
        if (err) {
          this.setState({ error: 'Something went wrong, please try again' });
        } else {
          browserHistory.push(`/channel/${res.body.id}`);
        }
      });
    }
  }

  joinChannel(evt) {
    evt.preventDefault();

    if (!this.state.input) {
      this.setState({ error: 'Please enter a channel id' });
    } else {
      request
      .get(`/api/channelJoin/${this.state.input}`)
      .end((err, res) => {
        if (err) {
          this.setState({ error: 'Something went wrong, please try again' });
        } else {
          browserHistory.push(`/channel/${res.body.id}`);
        }
      });
    }
  }

  render() {
    return (
      <div className="pages">
        <div className="pages__nav">
          <Nav />
        </div>
        <div className="pages__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Pages.propTypes = {
  children: React.PropTypes.element.isRequired,
};

