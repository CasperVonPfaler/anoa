import React from 'react';
import classNames from 'classnames';

require('./pricing-bubble.css');


export default function PricingBubble(props) {
  return (
    <div className="pricing-bubble" className={classNames('pricing-bubble', { 'pricing-bubble--active': props.active })} onClick={props.click}>
      <h3 className="pricing-bubble__title">{props.options.title}</h3>
      <ul className="pricing-bubble__features">
        {props.options.features}
      </ul>
      <div className="pricing-bubble__price">{props.options.price}</div>
    </div>
  );
}

PricingBubble.propTypes = {
  active: React.PropTypes.bool,
  options: React.PropTypes.object.isRequired,
  click: React.PropTypes.func,
};
