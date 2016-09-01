import React from 'react';
import classNames from 'classnames';

require('./home.css');

export default function Home({
  inputWatcher,
  submitHandler,
  error,
  text,
  inputPlaceholder,
  submitType,
  setSubmitTypeNew,
  setSubmitTypeJoin,
  input,
}) {
  return (
    <fieldset className="pages-fieldset">
      <div className="pages-fieldset__top-buttons">
        <p className="pages-fieldset__top-buttons__paragraph">
          Create a channel or join an existing one.
        </p>
        <button className={classNames('pages-fieldset__top-buttons__button', { 'pages-fieldset__top-buttons__button--active': submitType === 'join' })} onClick={setSubmitTypeJoin}>Join</button>
        <button className={classNames('pages-fieldset__top-buttons__button', { 'pages-fieldset__top-buttons__button--active': submitType === 'new' })} onClick={setSubmitTypeNew}>New</button>
      </div>
      <form className="pages-fieldset__form">
        <input type="text" className="pages-fieldset__form__input" placeholder={inputPlaceholder} value={input} onChange={inputWatcher} />
        <button type="submit" className="pages-fieldset__form__button" onClick={submitHandler} > Go</button>
        <div className="pages-fieldset__form__error-notification">{error}</div>
      </form>
    </fieldset>
  );
}

Home.propTypes = {
  submitType: React.PropTypes.string.isRequired,
  setSubmitTypeNew: React.PropTypes.func.isRequired,
  setSubmitTypeJoin: React.PropTypes.func.isRequired,
  inputWatcher: React.PropTypes.func.isRequired,
  submitHandler: React.PropTypes.func.isRequired,
  error: React.PropTypes.string.isRequired,
  text: React.PropTypes.string,
  input: React.PropTypes.string,
  inputPlaceholder: React.PropTypes.string,
};
