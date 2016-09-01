export const channelTitle = (state = '', action) => {
  switch (action.type) {
    case 'CHANNEL_SET_TITLE':
      return action.payload;
    default:
      return state;
  }
};

export const channelID = (state = '', action) => {
  switch (action.type) {
    case 'CHANNEL_SET_ID':
      return action.payload;
    default:
      return state;
  }
};

export const channelInput = (state = '', action) => {
  switch (action.type) {
    case 'CHANNEL_UPDATE_INPUT':
      return action.payload;
    default:
      return state;
  }
};

export const channelNotification = (state = '', action) => {
  switch (action.type) {
    case 'CHANNEL_UPDATE_NOTIFICATION':
      return action.payload;
    default:
      return state;
  }
};

export const liveChanges = (state = false, action) => {
  switch(action.type) {
    case 'CHANNEL_TOGGLE_LIVE_CHANGES':
      return action.payload;
    default:
      return state;
  }
}

export const channelQuestions = (state = [], action) => {
  switch (action.type) {
    case 'CHANNEL_SET_INITIAL_QUESTIONS':
      return action.payload;

    case 'CHANNEL_ADD_QUESTION':
      return channelAddQuestion(state, action.payload);

    case 'CHANNEL_TOGGLE_QUESTION':
      return channelToggleQuestion(
        state,
        action.payload.questionToToggle,
        action.payload.expand
      );

    case 'CHANNEL_ADD_ANSWER':
      return channelAddAnswer(
        state,
        action.payload.question,
        action.payload.answer,
      );

    case 'CHANNEL_UPDATE_QUESTION_ANSWER_INPUT':
      return channelUpdateQuestionAnswerInput(
        state,
        action.payload.question,
        action.payload.answerInput
      );

    default:
      return state;
  }
};

/**
 * @param {Array} the current questions in state
 * @param {Array} Array with the length 1 contining the new question
 */
function channelAddQuestion(currentQuestions, newQuestion) {
  for(let i = 0; i < currentQuestions.length; ++i) {
    if (currentQuestions[i]._id === newQuestion[0]._id) {
      return currentQuestions;
    }
  }
  return newQuestion.concat(currentQuestions);
}

/**
 * @param {Array} the current questions in state
 * @param {Object} the question that should be toggled
 * @param {bool} if the question should be expanded or shrunken
 */
function channelToggleQuestion(currentQuestions, questionToToggle, expandQuestion) {
  return currentQuestions.map((question) => {
    if (question._id === questionToToggle._id) {
      if (question.expanded === false && expandQuestion === true) {
        return Object.assign({}, question, { expanded: true });
      } else if (question.expanded === true && expandQuestion === false) {
        return Object.assign({}, question, { expanded: false });
      }
    }
    return question;
  });
}

/**
 * @param {Array} the current questions in state
 * @param {object} the question the new answer belongs toggled
 * @param {Array} array containing one object representing the new answer
 */
function channelAddAnswer(currentQuestions, parentQuestion, newAnswer) {
  return currentQuestions.map((question) => {
    if (question._id === parentQuestion._id) {
      // Check that the answer is not already stored in state
      for(let i = 0; i < question.answers.length; ++i) {
        if (question.answers[i]._id === newAnswer[0]._id) {
          return question;
        }
      }
      return Object.assign({}, question, {
        answers: question.answers.concat(newAnswer),
      });
    }
    return question;
  });
}

/**
 * @param {Array} the current questions in state
 * @param {objetc} Question that owns the input field that should be updated
 * @param {string} The new input value
 */
function channelUpdateQuestionAnswerInput(currentQuestions, targetQuestion, newAnswerInput) {
  return currentQuestions.map((question) => {
    if (question._id === targetQuestion._id) {
      return Object.assign({}, question, {
        answerInput: newAnswerInput,
      });
    }
    return question;
  });
}

