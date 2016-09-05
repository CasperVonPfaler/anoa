import { connect } from 'react-redux';
import Channel from './channel.jsx';
import {
  initializeChannelAction,
  addNewQuestion,
  updateQuestionInput,
  updateQuestionAnswerInput,
  toggleQuestion,
  storeQuestionAnswer,
  toggleLiveChanges,
   } from './channel.actions';

const mapStateToProps = (state) => ({
  title: state.channelTitle,
  id: state.channelID,
  live: state.liveChanges,
  input: state.channelInput,
  notification: state.channelNotification,
  questions: state.channelQuestions,
  channelInput: state.channelInput,
});

const mapDispatchToProps = (dispatch) => ({
  inputWatcher: (evt) => {
    dispatch(updateQuestionInput(evt.target.value));
  },
  storeQuestion: (id) => () => {
    dispatch(addNewQuestion(id));
  },
  toggleLive: () => {
    dispatch(toggleLiveChanges());
  },
  initializeChannel: (id) => {
    dispatch(initializeChannelAction(id));
  },
  refreshChannel: (id) => () => {
    dispatch(initializeChannelAction(id));
  },
  expandQuestion: (question) => () => {
    dispatch(toggleQuestion(question));
  },
  storeAnswer: (question) => () => {
    dispatch(storeQuestionAnswer(question));
  },
  answerInputWatcher: (question) => (evt) => {
    dispatch(updateQuestionAnswerInput(question, evt.target.value));
  },
});

const ChannelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Channel);

export default ChannelContainer;
