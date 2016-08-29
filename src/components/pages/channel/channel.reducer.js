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
      for(let i = 0; i < state.length; ++i) {
        if (state[i]._id === action.payload[0]._id) {
          return state;
        }
      }
      return action.payload.concat(state);
    case 'CHANNEL_TOGGLE_QUESTION':
      return state.map((question) => {
        if (question === action.payload.questionToToggle) {
          if (question.expanded === false && action.payload.expand === true) {
            return Object.assign({}, question, { expanded: true });
          } else if (question.expanded === true && action.payload.expand === false) {
            return Object.assign({}, question, { expanded: false });
          }
        }
        return question;
      });
    case 'CHANNEL_ADD_ANSWER':
      return state.map((question) => {
        if (question._id === action.payload.question._id) {
          for(let i = 0; i < question.answers.length; ++i) {
            if (question.answers[i]._id === action.payload.answer[0]._id) {
              return question;
            }
          }
          return Object.assign({}, question, {
            answers: question.answers.concat(action.payload.answer),
          });
        }
        return question;
      });
    case 'CHANNEL_UPDATE_QUESTION_ANSWER_INPUT':
      return state.map((question) => {
        if (question._id === action.payload.question._id) {
          return Object.assign({}, question, {
            answerInput: action.payload.answerInput,
          });
        }
        return question;
      });
    default:
      return state;
  }
};

