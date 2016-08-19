import React from 'react';
import { browserHistory } from 'react-router';
import request from 'superagent';

import PricingBubble from './pricing-bubble/pricing-bubble.jsx';

require('./new.css');

export default class New extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
      input: '',
      activeTier: 'Free',
      freeTier: {
        title: 'Free',
        price: 'nada strad',
        features: [
          <li className="pricing-bubble__features__item" key="0">-</li>,
          <li className="pricing-bubble__features__item" key="1">-</li>,
          <li className="pricing-bubble__features__item" key="2">-</li>,
        ],
      },
      proTier: {
        title: 'Pro',
        price: '2 rocks and 5 sticks',
        features: [
          <li className="pricing-bubble__features__item" key="0">-</li>,
          <li className="pricing-bubble__features__item" key="1">-</li>,
          <li className="pricing-bubble__features__item" key="2">-</li>,
        ],
      },
      subscriptionTier: {
        title: 'Subscribe',
        price: '5 unicorns / week',
        features: [
          <li className="pricing-bubble__features__item" key="0">-</li>,
          <li className="pricing-bubble__features__item" key="1">-</li>,
          <li className="pricing-bubble__features__item" key="2">-</li>,
        ],
      },
    };

    this.inputWatcher = this.inputWatcher.bind(this);
    this.createChannel = this.createChannel.bind(this);
    this.createFreeChannel = this.createFreeChannel.bind(this);
    this.setActiveTier = this.setActiveTier.bind(this);
  }

  setActiveTier(newTier) {
    return () => this.setState({ activeTier: newTier });
  }

  inputWatcher(evt) {
    this.setState({ input: evt.target.value });
  }

  createChannel(evt) {
    evt.preventDefault();
    if (this.state.activeTier === 'Pro') {
      return; // Handle pro channel creation
    } else if (this.state.activeTier === 'Free') {
      this.createFreeChannel();
    }
  }

  createFreeChannel() {
    if (!this.state.input) {
      this.setState({ error: 'Please enter a name.' });
    } else {
      request
      .post('/api/channelInsert/')
      .send({
        name: this.state.input,
      })
      .end((err, res) => {
        if (err) this.setState({ error: 'Something went wrong, please try again' });
        else browserHistory.push(`/channel/${res.body.id}`);
      });
    }
  }

  render() {
    return (
      <fieldset className="pages-fieldset new-fieldset">
        <div className="new-fieldset__pricing" onClick={this.setActiveTier}>
          <PricingBubble options={this.state.freeTier} active={this.state.activeTier === this.state.freeTier.title} click={this.setActiveTier('Free')} />
          <PricingBubble options={this.state.proTier} active={this.state.activeTier === this.state.proTier.title} click={this.setActiveTier('Pro')} />
          <PricingBubble options={this.state.subscriptionTier} active={this.state.activeTier === this.state.subscriptionTier.title} click={this.setActiveTier('Subscribe')} />
        </div>
        <form className="pages-fieldset__form">
          <input type="text" className="pages-fieldset__form__input" placeholder="channel name" onChange={this.inputWatcher} />
          <button type="submit" className="pages-fieldset__form__button" onClick={this.createChannel} >Go</button>
          <div className="pages-fieldset__form__error-notification">{this.state.error}</div>
        </form>
      </fieldset>
    );
  }
}
