import React from 'react';
import { browserHistory } from 'react-router';
import request from 'superagent';

require('./home.css');

export default class Home extends React.Component {
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
      <fieldset className="pages-fieldset login-form">
        <form className="pages-fieldset__form">
          <input type="text" className="pages-fieldset__form__input" placeholder="channel id" onChange={this.inputWatcher} />
          <button type="submit" className="pages-fieldset__form__button" onClick={this.joinChannel} >Go</button>
          <div className="pages-fieldset__form__error-notification">{this.state.error}</div>
        </form>
        <p className="login-form__caption">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          Sed posuere interdum sem. Quisque ligula eros ullamcorper quis,
          lacinia quis facilisis sed sapien.
          Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae,
          consectetuer et venenatis eget velit. Sed augue orci,
          lacinia eu tincidunt et eleifend nec lacus.
          Donec ultricies nisl ut felis,
          suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis,
          ipsum erat vehicula risus, eu suscipit sem libero nec erat.
          Aliquam erat volutpat. Sed congue augue vitae neque.
          Nulla consectetuer porttitor pede.
          Fusce purus morbi tortor magna condimentum vel,
          placerat id blandit sit amet tortor.
          <br />
          <br />
          Mauris sed libero. Suspendisse facilisis nulla in lacinia laoreet,
          lorem velit accumsan velit vel mattis libero nisl et sem.
          Proin interdum maecenas massa turpis sagittis in,
          interdum non lobortis vitae massa. Quisque purus lectus,
          posuere eget imperdiet nec sodales id arcu.
          Vestibulum elit pede dictum eu, viverra non tincidunt eu ligula.
        </p>
      </fieldset>
    );
  }
}
