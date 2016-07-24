import React from 'react';
import request from 'superagent';

export default class Question extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      answerInput: '',
      answers: this.props.initialAnswers,
    };

    this.expand = this.expand.bind(this);
    this.shrink = this.shrink.bind(this);
    this.storeAnswer = this.storeAnswer.bind(this);
    this.appendNewAnswer = this.appendNewAnswer.bind(this);
    this.answerInputWatcher = this.answerInputWatcher.bind(this);
  }

  expand() {
    this.setState({
      expanded: true,
    });
  }

  shrink() {
    this.setState({
      expanded: false,
    });
  }

  answerInputWatcher(evt) {
    this.setState({
      answerInput: evt.target.value,
    });
  }

  storeAnswer() {
    if (this.state.answerInput) {
      request
      .post('/api/answerInsert')
      .send({
        answer: this.state.answerInput,
        channelID: this.props.channel,
        questionID: this.props.id,
      })
      .end((err, res) => {
        if (err) {
          // Do something about daz error
        }
        if (!this.props.socket) {
          this.setState({
            answers: this.state.answers.concat(this.props.newAnswerElement(res.body)),
            answerInput: '',
          });
        } else {
          this.setState({
            answerInput: '',
          });
        }
      });
    }
  }

  appendNewAnswer(newAnswer) {
    this.setState({
      answers: this.state.answers.concat(this.props.newAnswerElement(newAnswer)),
      answerInput: '',
    });
  }

  render() {
    return (
      <li className="question">
        <div className="question__text" onClick={this.expand}>{this.props.text}</div>
        {this.state.expanded ? <div className="question__close" onClick={this.shrink}>x</div> : null}
        <div className="question__meta">
          <span className="question__meta__answers-count">
            Answers: <span className="question__meta__answers-count__number">{this.state.answers.length}</span>
          </span>
          <span className="question__meta__time">{this.props.time}</span>
        </div>
        {this.state.expanded ? (
          <div className="question__expand">
            <ul className="question__answer-list">
            {this.state.answers}
            </ul>
            <div className="question__new-answer">
              <h5 className="question__new-answer__title">Your Answer</h5>
              <textarea className="question__new-answer__textarea" onChange={this.answerInputWatcher} value={this.state.answerInput}></textarea>
              <button className="question__new-answer__button" onClick={this.storeAnswer} >Answer</button>
            </div>
          </div>
          ) : null}
      </li>
    );
  }
}

Question.propTypes = {
  text: React.PropTypes.string,
  initialAnswers: React.PropTypes.array,
  time: React.PropTypes.any,
  channel: React.PropTypes.string,
  id: React.PropTypes.string,
  appendNewAnswer: React.PropTypes.any,
  socket: React.PropTypes.any,
  newAnswerElement: React.PropTypes.any,
};
