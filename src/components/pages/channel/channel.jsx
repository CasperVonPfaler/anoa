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
          <svg className="channel__top-bar__icon" onClick={this.props.refreshChannel(this.props.params.id)} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        </div>
        <div className="channel__new-question">
          <textarea className="channel__new-question__textarea" onChange={this.props.inputWatcher} value={this.props.channelInput} placeholder="Your question..." />
          <button className="channel__new-question__button" onClick={this.props.storeQuestion(this.props.params.id)}>Ask</button>
          <div className="channel__new-question__notification">{this.props.notification}</div>
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
  storeAnswer: React.PropTypes.func.isRequired,
  answerInputWatcher: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  live: React.PropTypes.any.isRequired,
  toggleLive: React.PropTypes.func.isRequired,
  questions: React.PropTypes.array.isRequired,
  inputWatcher: React.PropTypes.func.isRequired,
  storeQuestion: React.PropTypes.func.isRequired,
  notification: React.PropTypes.string.isRequired,
  initializeChannel: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  channelInput: React.PropTypes.string.isRequired,
};
