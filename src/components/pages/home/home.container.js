import { connect } from 'react-redux';
import { updateHomeInput, submitHomeForm, toggleSubmitType } from './home.actions';
import Home from './home.jsx';

const mapStateToProps = (state) => ({
  error: state.homeError,
  inputPlaceholder: state.homeInputPlaceholder,
  text: state.homeText,
  input: state.homeInput,
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
