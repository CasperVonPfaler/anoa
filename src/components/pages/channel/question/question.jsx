import React from 'react';
import classNames from 'classnames';
import Answer from './answer/answer.jsx';

require('./question.css');

export default function Question({
  text,
  answers,
  time,
  expand,
  shrink,
  expanded,
  answerInputWatcher,
  answerInput,
  storeAnswer,
}) {
  return (
    <li className="question">
      <div className="question__text" onClick={expand}>
        <span className={classNames('question__title', { 'question__title--active' : expanded })}>{text}</span>
        <div className="question__meta">
          <span className="question__meta__answers-count">
            Answers:<span className="question__meta__answers-count__number"> {answers.length}</span>
          </span>
          <span className="question__meta__time">{time}</span>
        </div>
      </div>
      {expanded ? (
        <div className="question__expand">
          <ul className="question__answer-list">
          {answers.map((answer) =>
            <Answer text={answer.text} key={answer._id} />
           )}
          </ul>
          <div className="question__new-answer">
            <textarea className="question__new-answer__textarea" onChange={answerInputWatcher} value={answerInput} placeholder="my awesome answer..."/>
            <button className="question__new-answer__button" onClick={storeAnswer} >Answer</button>
          </div>
        </div>
        ) : null}
    </li>
  );
}

Question.propTypes = {
  text: React.PropTypes.string.isRequired,
  answers: React.PropTypes.array.isRequired,
  time: React.PropTypes.string.isRequired,
  expand: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired,
  answerInputWatcher: React.PropTypes.func.isRequired,
  answerInput: React.PropTypes.string.isRequired,
  storeAnswer: React.PropTypes.func.isRequired,
};
