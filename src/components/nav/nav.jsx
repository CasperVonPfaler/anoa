import React from 'react';
import { IndexLink } from 'react-router';

require('./nav.css');

export default function Nav(props) {
  return (
    <ul className="nav">
      <h4 className="nav-heading"><IndexLink to="/" className="nav-item__link" activeClassName="nav-item__link--active">ANOA</IndexLink></h4>
      <li className="nav-item nav-item__icon" onClick={props.toggleNightMode} >
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>
        </svg>
      </li>
    </ul>
  );
}

Nav.propTypes = {
  toggleNightMode: React.PropTypes.func.isRequired,
};
