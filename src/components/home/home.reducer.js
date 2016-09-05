export function homeInput(state = '', action) {
  switch (action.type) {
    case 'HOME_UPDATE_INPUT':
      return action.payload;
    default:
      return state;
  }
}

export function homeLoading(state = false, action) {
  switch (action.type) {
    case 'HOME_UPDATE_LOADING':
      return action.payload;
    default:
      return state;
  }
}

export function homeError(state = '', action) {
  switch (action.type) {
    case 'HOME_UPDATE_ERROR':
      return action.payload;
    default:
      return state;
  }
}

export function homeInputPlaceholder(state = 'Channel id', action) {
  switch (action.type) {
    case 'HOME_UPDATE_INPUTPLACEHOLDER':
      return action.payload;
    default:
      return state;
  }
}

export function homeSubmitType(state = 'join', action) {
  switch (action.type) {
    case 'HOME_UPDATE_SUBMITTYPE':
      return action.payload;
    default:
      return state;
  }
}
