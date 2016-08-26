import React from 'react';

require('./about.css');

export default function About({ text }) {
  return (
    <p className="about">
      {text}
    </p>
  );
}

About.propTypes = {
  text: React.PropTypes.string.isRequired,
};
