import { connect } from 'react-redux';
import Home from './home.jsx';
import {
  updateHomeInput,
  submitHomeForm,
  toggleSubmitType,
} from './home.actions';

const mapStateToProps = (state) => ({
  error: state.homeError,
  inputPlaceholder: state.homeInputPlaceholder,
  text: state.homeText,
  input: state.homeInput,
  loading: state.homeLoading,
  submitType: state.homeSubmitType,
});

const mapDispatchToProps = (dispatch) => ({
  inputWatcher: (evt) => {
    dispatch(updateHomeInput(evt.target.value));
  },
  submitHandler: (evt) => {
    evt.preventDefault();
    dispatch(submitHomeForm());
  },
  setSubmitTypeJoin: () => {
    dispatch(toggleSubmitType('join'));
  },
  setSubmitTypeNew: () => {
    dispatch(toggleSubmitType('new'));
  },
});

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default HomeContainer;
