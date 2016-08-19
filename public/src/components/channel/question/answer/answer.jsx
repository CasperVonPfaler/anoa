import React from 'react';

require('./answer.css');

export default function Answer(props) {
  return (
    <li className="answer">{props.text}</li>
  );
}
