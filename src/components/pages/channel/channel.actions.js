import shortid from 'shortid';
import { timeSince } from '../../../utils/util';
import {
  setDatabaseInState,
  setLocalDatabseFromRemote,
  getDatabaseMeta,
  storeQuestionInDatabase,
  storeAnswerInDatabase,
} from '../../../database/database.actions';

function setChannelMeta(meta, id, dispatch) {
  return new Promise((resolve) => {
    dispatch({
      type: 'CHANNEL_SET_TITLE',
      payload: meta.name,
    });
    dispatch({
      type: 'CHANNEL_SET_ID',
      payload: id,
    });
    resolve();
  });
}

function getChannelQuestions(localDatabase) {
  return localDatabase.allDocs({
    startkey: 'question_',
    endkey: 'question_\uffff',
    include_docs: true,
  });
}

function getQuestionAnswers(questions, localDatabase) {
  if (questions.rows <= 0) {
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  return Promise.all(questions.rows.map((questionDoc) => localDatabase.allDocs({
      startkey: `answer_${questionDoc.doc._id}`,
      endkey: `answer_${questionDoc.doc._id}\uffff`,
      include_docs: true,
    })
    .then((questionAnswers) => new Promise((resolve) => {
      if (questionAnswers.rows <= 0) {
        resolve(Object.assign({}, questionDoc.doc, {
          answers: [],
          expanded: false,
          time: timeSince(Date.parse(questionDoc.doc.time)),
          answerInput: '',
        }));
      } else {
        resolve(Object.assign({}, questionDoc.doc, {
          answers: questionAnswers.rows.map((answerDoc) => answerDoc.doc),
          expanded: false,
          time: timeSince(Date.parse(questionDoc.doc.time)),
          answerInput: '',
        }));
      }
    }))
  ));
}

function setChannelInitialState(dispatch, state, id) {
  const { local } = state.database;

  getDatabaseMeta(local)
  .then((meta) => setChannelMeta(meta, id, dispatch))
  .then(() => getChannelQuestions(local))
  .then((questions) => getQuestionAnswers(questions, local))
  .then((questionsWithAnswers) => {
    dispatch({
      type: 'CHANNEL_SET_INITIAL_QUESTIONS',
      payload: questionsWithAnswers,
    });
  });
}

export function initializeChannelAction(id) {
  return (dispatch, getState) => {
    setLocalDatabseFromRemote(id)
    .then((database) => setDatabaseInState(dispatch, database))
    .then(() => {
      setChannelInitialState(dispatch, getState(), id);
    });
  };
}

export function toggleQuestion(questionToToggle) {
  return {
    type: 'CHANNEL_TOGGLE_QUESTION',
    payload: {
      questionToToggle,
      expand: !questionToToggle.expanded,
    },
  };
}

export function addNewQuestion() {
  return (dispatch, getState) => {
    if (!getState().database.local) {
      return;
    }

    if (!getState().channelInput) {
      return;
    }

    const newQuestion = {
      _id: `question_${shortid.generate()}`,
      text: getState().channelInput,
      time: new Date(),
    };

    storeQuestionInDatabase(getState().database, newQuestion)
    .then(() => {
      dispatch({
        type: 'CHANNEL_ADD_QUESTION',
        payload: [].concat(Object.assign({}, newQuestion, {
          expanded: false,
          answers: [],
          time: '0 seconds ago',
          answerInput: '',
        })),
      });
      dispatch(updateQuestionInput(''));
      dispatch({
        type: 'CHANNEL_UPDATE_NOTIFICATION',
        payload: 'Question stored.'
      });
    })
    .catch(() => {
      dispatch({
        type: 'CHANNEL_UPDATE_NOTIFICATION',
        payload: 'Something went wrong, please try again.'
      });
    });
  };
}

export function storeQuestionAnswer(targetQuestion) {
  return (dispatch, getState) => {
    if (!getState().database.local) {
      return;
    }

    if (!targetQuestion.answerInput) {
      return;
    }

    const newAnswer = {
      _id: `answer_${targetQuestion._id}${shortid.generate()}`,
      text: targetQuestion.answerInput,
      time: new Date(),
    };

    storeAnswerInDatabase(getState().database, newAnswer)
    .then(() => {
      dispatch({
        type: 'CHANNEL_ADD_ANSWER',
        payload: {
          question: targetQuestion,
          answer: [newAnswer],
        },
      });
      dispatch(updateQuestionAnswerInput(targetQuestion, ''));
    });
  };
}


/**
 * 
 * TODO: Need to add a sync handler ref to state and check it to know
 * if we want to start or stop syncing
 * 
 */
export function toggleLiveChanges() {
  return (dispatch, getState) => {
    const { local, remote, liveChanges } = getState().database;

    if(!local || !remote) {
      return;
    }

    if(liveChanges) {
      // call .cacnel() on the sync handler 'liveChanges' and then
      // dispatch an action to set the sync handler as undefined
      return;
    }

    local.sync(remote, { live: true })
    .on('change', (change) => {
      
    })
    .on('error', () => {

    })
  }
}

export function updateQuestionAnswerInput(question, answerInput) {
  return {
    type: 'CHANNEL_UPDATE_QUESTION_ANSWER_INPUT',
    payload: {
      question,
      answerInput,
    },
  };
}

export function updateQuestionInput(payload) {
  return {
    type: 'CHANNEL_UPDATE_INPUT',
    payload,
  };
}
