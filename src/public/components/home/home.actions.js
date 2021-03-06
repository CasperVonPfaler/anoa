import shortid from 'shortid';
import { browserHistory } from 'react-router';
import {
  createNewDatabase,
  setDatabaseMeta,
  setDatabaseInState,
  useExistingDatabase,
  checkForRemoteDatabase,
} from '../../database/database.actions';

function navigateToChannel(dispatch, id) {
  browserHistory.push(`/channel/${id}`);

  dispatch({
    type: 'HOME_UPDATE_INPUT',
    payload: '',
  });

  dispatch({
    type: 'HOME_UPDATE_ERROR',
    payload: '',
  });

  dispatch({
    type: 'HOME_UPDATE_LOADING',
    payload: false,
  });
}

/**
 * @Param {func} dispatch function for redux
 * @Param {string} id of the channel to join
 */
function joinChannel(dispatch, id) {
  if (!id) {
    dispatch({
      type: 'HOME_UPDATE_ERROR',
      payload: 'Please enter a channel id.',
    });
  } else {
    useExistingDatabase(id)
    .then((database) => checkForRemoteDatabase(database))
    .then(() => {
      navigateToChannel(dispatch, id);
    })
    .catch(() => {
      dispatch({
        type: 'HOME_UPDATE_ERROR',
        payload: 'Channel not found, did you mean to create a new one?',
      });
    });
  }
}

/**
 * @Param {func} dispatch function for redux
 * @Param {string} name for the new channel
 */
function newChannel(dispatch, name) {
  if (!name) {
    dispatch({
      type: 'HOME_UPDATE_ERROR',
      payload: 'Please enter a channel name.',
    });
  } else {
    dispatch({
      type: 'HOME_UPDATE_LOADING',
      payload: true,
    });

    const id = shortid.generate();

    createNewDatabase(id)
    .then((database) => setDatabaseMeta(database, name))
    .then((database) => setDatabaseInState(dispatch, database))
    .then(() => {
      navigateToChannel(dispatch, id);
    })
    .catch(() => {
      dispatch({
        type: 'HOME_UPDATE_ERROR',
        payload: 'Something went wrong, please try again.',
      });
      dispatch({
        type: 'HOME_UPDATE_LOADING',
        payload: false,
      });
    });
  }
}

export function submitHomeForm() {
  return (dispatch, getState) => {
    const { homeInput, homeSubmitType } = getState();

    if (homeSubmitType === 'join') {
      joinChannel(dispatch, homeInput);
    } else if (homeSubmitType === 'new') {
      newChannel(dispatch, homeInput);
    } else {
      dispatch({
        type: 'HOME_UPDATE_ERROR',
        payload: 'Something has gone wrong, please try to reaload the page',
      });
    }
  };
}

/**
 * @Param {string} identifier of the submitType to set as active
 */
export function toggleSubmitType(newSubmitType) {
  return (dispatch, getState) => {
    const { homeSubmitType } = getState();

    if (homeSubmitType === newSubmitType) {
      return;
    } else if (newSubmitType === 'new' || newSubmitType === 'join') {
      dispatch({
        type: 'HOME_UPDATE_SUBMITTYPE',
        payload: newSubmitType,
      });
      dispatch({
        type: 'HOME_UPDATE_INPUTPLACEHOLDER',
        payload: newSubmitType === 'new' ? 'Channel name' : 'Channel id',
      });
    } else {
      dispatch({
        type: 'HOME_UPDATE_ERROR',
        payload: 'Something has gone wrong, please try to reaload the page',
      });
    }
  };
}

/**
 * @Param {string} new value for the form input field
 */
export function updateHomeInput(payload) {
  return {
    type: 'HOME_UPDATE_INPUT',
    payload,
  };
}

