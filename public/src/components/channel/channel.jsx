import React from 'react';
import request from 'superagent';
import io from 'socket.io-client';
import classNames from 'classnames';

import Question from './question/question.jsx';
import Answer from './question/answer/answer.jsx';
import util from '../../common/util.js';

require('./channel.css');

export default class Channel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.params.id,
      title: '',
      questions: [],
      questionInput: '',
      questionInputNotification: '',
      shortID: '',
      socket: undefined,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.questionInputWatcher = this.questionInputWatcher.bind(this);
    this.storeQuestion = this.storeQuestion.bind(this);
    this.appendNewQuestion = this.appendNewQuestion.bind(this);
    this.toggleLive = this.toggleLive.bind(this);
    this.sortQuestions = this.sortQuestions.bind(this);
  }

  componentDidMount() {
    this.fetchChannel();
  }

  fetchChannel(callback) {
    request
    .get(`/api/channelGet/${this.state.id}`)
    .end((err, res) => {
      if (err) {
        // do something about error
      } else {
        this.setState({
          title: res.body.name,
          questions: res.body.questions.length > 0 ? this.sortQuestions(res.body.questions) : [],
          shortID: res.body.shortID,
        });

        if (util.isFunction(callback)) callback();
      }
    });
  }

  // this qould be extended to accept another parameter and sort differently
  // depending on it
  sortQuestions(questions) {
    return questions.sort((a, b) => new Date(b.time) - new Date(a.time));
  }

  appendNewQuestion(question) {
    this.setState({
      questionInput: '',
      questions: [question].concat(this.state.questions),
    });
  }

  newQuestionElement(question) {
    const props = {
      text: question.text,
      initialAnswers: question.answers ? question.answers.map((answer) => this.newAnswerElement(answer)) : [],
      time: util.timeSince(Date.parse(question.time)),
      channel: this.state.id,
      id: question.id,
      key: question.id,
      ref: question.id,
      socket: this.state.socket,
      newAnswerElement: this.newAnswerElement,
    };

    return <Question {...props} />;
  }

  questionInputWatcher(evt) {
    this.setState({
      questionInput: evt.target.value,
    });
  }

  newAnswerElement(answer) {
    const props = {
      text: answer.text,
      key: answer.id,
    };

    return [<Answer {...props} />];
  }

  storeQuestion() {
    if (!this.state.questionInput) {
      this.setState({ questionInputNotification: 'Please enter a question' });
    } else {
      request
      .post('/api/questionInsert')
      .type('json')
      .send({
        id: this.state.id,
        question: this.state.questionInput,
      })
      .end((err, res) => {
        if (err) {
          this.setState({
            questionInputNotification: 'Something went wrong while storing your question',
          });
        } else {
          if (!this.state.socket) this.appendNewQuestion(res.body);
          this.setState({
            questionInputNotification: 'Success.',
          });
        }
      });
    }
  }

  toggleLive() {
    if (!this.state.socket) {
      this.fetchChannel(() => {
        this.setState({
          socket: io(),
        }, () => {
          this.state.socket.on('connectionSuccess', () => {
            this.state.socket.emit('channelSubscribe', { id: this.state.id });
            this.state.socket.on('newQuestion', (changes) => {
              this.appendNewQuestion(changes);
            });
            this.state.socket.on('newAnswer', (changes) => {
              this.refs[changes.id].appendNewAnswer(changes.answers[changes.answers.length - 1]);
            });
          });
        });
      });   
    } else {
      this.state.socket.disconnect();
      this.setState({
        socket: undefined,
      });
    }
  }

  render() {
    return (
      <div className="channel">
        <div className="channel__top-bar">
          <h2 className="channel__top-bar__title">{this.state.title}</h2>
          <span className="channel__top-bar__id"> id: {this.state.shortID}</span>
          <span className={classNames('channel__top-bar__live-toggle', { 'channel__top-bar__live-toggle--active': this.state.socket })} onClick={this.toggleLive}> Live</span>
          <a className="channel__create-or-join-new" href="/">Home</a>
        </div>
        <div className="channel__new-question">
          <textarea className="channel__new-question__textarea" onChange={this.questionInputWatcher} value={this.state.questionInput} placeholder="Your question." />
          <button className="channel__new-question__button" onClick={this.storeQuestion}>Ask</button>
          <div className="channel__new-question__error">{this.state.questionInputNotification}</div>
        </div>
        {this.state.questions.length > 0 ? (
          <ul className="channel__question-list">
            {this.state.questions.map((question) => this.newQuestionElement(question))}
          </ul>
        ) : <h2 className="channel__no-questions">Be the first to ask something!</h2>}
      </div>
    );
  }
}

Channel.propTypes = {
  params: React.PropTypes.object,
};