export const homeInput = (state = '', action) => {
  switch (action.type) {
    case 'HOME_UPDATE_INPUT':
      return action.payload;
    default:
      return state;
  }
};

export const homeError = (state = '', action) => {
  switch (action.type) {
    case 'HOME_UPDATE_ERROR':
      return action.payload;
    default:
      return state;
  }
};

export const homeInputPlaceholder = (state = 'Channel id', action) => {
  switch (action.type) {
    case 'HOME_UPDATE_INPUTPLACEHOLDER':
      return action.payload;
    default:
      return state;
  }
};

export const homeSubmitType = (state = 'new', action) => {
  switch (action.type) {
    case 'HOME_UPDATE_SUBMITTYPE':
      return action.payload;
    default:
      return state;
  }
};

export const homeText = (state = '') => state;
