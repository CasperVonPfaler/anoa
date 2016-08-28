export function toggleNightModeAction() {
  return (dispatch, getState) => {
    const { nightMode } = getState();
    const htmlTag = document.documentElement;
    

    if(!nightMode) {
      htmlTag.className = 'night-mode';

      dispatch({
        type: 'NAV_TOGGLE_NIGHT_MODE',
        payload: true,
      });
    } else {
      htmlTag.className = '';

      dispatch({
        type: 'NAV_TOGGLE_NIGHT_MODE',
        payload: false,
      })
    }
  }
}