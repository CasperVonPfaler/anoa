export const nightMode = (state = false, action) => {
  switch (action.type) {
    case 'NAV_TOGGLE_NIGHT_MODE':
      return action.payload;
    default:
      return state;
  }
}