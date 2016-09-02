import { connect } from 'react-redux';
import { toggleNightModeAction } from './nav.actions';
import Nav from './nav.jsx';

const mapStateToProps = (state) => ({
  nightMode: state.nightMode,
});

const mapDispatchToProps = (dispatch) => ({
  toggleNightMode: () => {
    dispatch(toggleNightModeAction());
  },
});

const NavContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false } // https://github.com/reactjs/react-router/issues/3536
)(Nav);

export default NavContainer;
