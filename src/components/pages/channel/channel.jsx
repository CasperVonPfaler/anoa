import React, { Component } from 'react';
import classNames from 'classnames';
import Question from './question/question.jsx';

require('./channel.css');

export default class Channel extends Component {
  componentDidMount() {
    this.props.initializeChannel(this.props.params.id);
  }

  render() {
    return (
      <div className="channel">
        <div className="channel__top-bar">
          <h2 className="channel__top-bar__title">{this.props.title}</h2>
          <span className="channel__top-bar__id"> id: {this.props.id}</span>
          <span className={classNames('channel__top-bar__live-toggle', { 'channel__top-bar__live-toggle--active': this.props.live })} onClick={this.props.toggleLive}> Live</span>
        </div>
        <div className="channel__new-question">
          <textarea className="channel__new-question__textarea" onChange={this.props.inputWatcher} value={this.props.channelInput} placeholder="Your question." />
          <button className="channel__new-question__button" onClick={this.props.storeQuestion(this.props.params.id)}>Ask</button>
          <div className="channel__new-question__error">{this.props.notification}</div>
        </div>
        {this.props.questions.length > 0 ? (
          <ul className="channel__question-list">
            {this.props.questions.map(question =>
              <Question
                key={question._id}
                text={question.text}
                time={question.time}
                expanded={question.expanded}
                answers={question.answers}
                answerInput={question.answerInput}
                expand={this.props.expandQuestion(question)}
                shrink={this.props.shrinkQuestion(question)}
                storeAnswer={this.props.storeAnswer(question)}
                answerInputWatcher={this.props.answerInputWatcher(question)}
              />
            )}
          </ul>
        ) : <h2 className="channel__no-questions">Be the first to ask something!</h2>}
      </div>
    );
  }
}

Channel.propTypes = {
  expandQuestion: React.PropTypes.func.isRequired,
  shrinkQuestion: React.PropTypes.func.isRequired,
  storeAnswer: React.PropTypes.func.isRequired,
  answerInputWatcher: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  live: React.PropTypes.bool.isRequired,
  toggleLive: React.PropTypes.func.isRequired,
  questions: React.PropTypes.array.isRequired,
  inputWatcher: React.PropTypes.func.isRequired,
  storeQuestion: React.PropTypes.func.isRequired,
  notification: React.PropTypes.string.isRequired,
  initializeChannel: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  channelInput: React.PropTypes.string.isRequired,
};
