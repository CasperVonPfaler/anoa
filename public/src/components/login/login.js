const request = require('superagent');

import React from 'react';
import { browserHistory } from 'react-router';

export default class Login extends React.Component {
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
    } else if (!grecaptcha.getResponse()) {
      this.setState({ error: 'Please make sure that you are not a robot.' });
    } else {
      request
      .post('/api/channelInsert/')
      .send({
        name: this.state.input,
        captcha: grecaptcha.getResponse(),
      })
      .end((err, res) => {
        if (err) this.setState({ error: 'Something went wrong, please try again' });
        else browserHistory.push(`/channel/${res.body.id}`);
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
        if (err) this.setState({ error: 'Something went wrong, please try again' });
        else browserHistory.push(`/channel/${res.body.id}`);
      });
    }
  }

  render() {
    return (
      <div className="login-channel-wrapper">
        <div className="login-channel">
          <h2 className="login-channel__title">ANOA</h2>
          <form className="login-channel__form">
            <input type="text" className="login-channel__form-input" placeholder="channel name or id" onChange={this.inputWatcher}></input>
            <button type="submit" className="login-channel__form-button login-channel__form-button--create" onClick={this.createChannel} >Create channel</button>
            <button type="submit" className="login-channel__form-button login-channel__form-button-join" onClick={this.joinChannel} >Join channel</button>
            <div className="login-channel__error-notification">{this.state.error}</div>
            <div className="g-recaptcha" data-sitekey="6Ld7iSUTAAAAAP94hCGVPTxE2JE1lAsHmV6Y56ON" async defer></div>
            <div className="login-channel__captcha-label">Only needed when creating a channel</div>
          </form>
        </div>
      </div>
    );
  }
}
