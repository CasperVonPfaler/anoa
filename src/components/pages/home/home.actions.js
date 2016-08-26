import shortid from 'shortid';
import { browserHistory } from 'react-router';
import {
  createNewDatabase,
  setDatabaseMeta,
  setDatabaseInState,
  setLocalDatabseFromRemote,
} from '../../../database/database.actions';

function dispatchAction(type, payload) {
  return {
    type,
    payload,
  };
}

/**
 * Join a channel
 *
 * @Param {func} dispatch function for redux
 * @Param {string} id of the channel to join
 */
function joinChannel(dispatch, id) {
  if (!id) {
    dispatch(dispatchAction('HOME_UPDATE_ERROR', 'please enter a channel id.'));
  } else {
    setLocalDatabseFromRemote(id)
    .then((database) => setDatabaseInState(database, dispatch))
    .then(() => {
      browserHistory.push(`/channel/${id}`);
    })
    .catch(() => {
      dispatch(dispatchAction('HOME_UPDATE_ERROR', 'Something has gone horribly wrong, please try again.')); //eslint-disable-line
    });
  }
}

/**
 * Create a new channel
 *
 * @Param {func} dispatch function for redux
 * @Param {string} name for the new channel
 */
function newChannel(dispatch, name) {
  if (!name) {
    dispatch(dispatchAction('HOME_UPDATE_ERROR', 'Please enter a name for the channel.')); //eslint-disable-line
  } else {
    const id = shortid.generate();

    createNewDatabase(id)
    .then((database) => setDatabaseMeta(database, name))
    .then((database) => setDatabaseInState(dispatch, database))
    .then(() => {
      browserHistory.push(`/channel/${id}`);
    })
    .catch((err) => {
      console.log(err);
      dispatch(dispatchAction('HOME_UPDATE_ERROR', 'Something has gone horribly wrong, please try again.')); //eslint-disable-line
    });
  }
}

/**
 * Submit the homescreen form.
 * Determines if a new channel should be created
 * or if should try joining a existing one
 */
export function submitHomeForm() {
  return (dispatch, getState) => {
    const { homeInput, homeSubmitType } = getState();

    if (homeSubmitType === 'join') {
      joinChannel(dispatch, homeInput);
    } else if (homeSubmitType === 'new') {
      newChannel(dispatch, homeInput);
    } else {
      dispatch(dispatchAction('HOME_UPDATE_ERROR', 'Something has gone horribly wrong, try to reload the page.')); //eslint-disable-line
    }
  };
}

/**
 * Change between the different submitTypes of the form
 *
 * @Param {string} identifier of the submitType to set as active
 */
export function toggleSubmitType(newSubmitType) {
  return (dispatch, getState) => {
    const { homeSubmitType } = getState();

    if (homeSubmitType === newSubmitType) {
      return;
    } else if (newSubmitType === 'new' || newSubmitType === 'join') {
      dispatch(dispatchAction('HOME_UPDATE_SUBMITTYPE', newSubmitType));
    } else {
      dispatch(dispatchAction('HOME_UPDATE_ERROR','Something has gone horribly wrong, try to reload the page.')); //eslint-disable-line
    }
  };
}

/**
 * Notifies the store of updates to the input
 * on the home page
 */
export function updateHomeInput(payload) {
  return (dispatch) => dispatch(dispatchAction('HOME_UPDATE_INPUT', payload));
}

