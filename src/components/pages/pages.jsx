import React from 'react';
import NavContainer from './nav/nav.container';

require('./pages.css');

export default function Pages({ children }) {
  return (
    <div className="pages">
      <div className="pages__nav">
        <NavContainer />
      </div>
      <div className="pages__content">
         {children}
      </div>
    </div>
  );
}

Pages.propTypes = {
  children: React.PropTypes.element.isRequired,
};

