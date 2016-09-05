import React from 'react';
import classNames from 'classnames';

require('./home.css');

export default function Home({
  inputWatcher,
  submitHandler,
  error,
  inputPlaceholder,
  submitType,
  setSubmitTypeNew,
  setSubmitTypeJoin,
  input,
  loading,
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
        <button type="submit" className={classNames('pages-fieldset__form__button', { 'pages-fieldset__form__button--hidden': loading })} onClick={submitHandler} > Go</button>
        <svg className={classNames('pages-fieldset__loading', { 'pages-fieldset__loading--visible': loading })} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
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
  input: React.PropTypes.string,
  loading: React.PropTypes.bool.isRequired,
  inputPlaceholder: React.PropTypes.string,
};
