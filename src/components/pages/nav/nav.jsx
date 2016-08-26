import React from 'react';
import { Link, IndexLink } from 'react-router';

require('./nav.css');

export default function Nav() {
  return (
    <ul className="nav">
      <h4 className="nav-heading">ANOA</h4>
      <li className="nav-item"><IndexLink to="/" className="nav-item__link nav-item__link--blue" activeClassName="nav-item__link--active">Home</IndexLink></li>
      <li className="nav-item"><Link to="/about" className="nav-item__link nav-item__link--green" activeClassName="nav-item__link--active">About</Link></li>
    </ul>
  );
}
