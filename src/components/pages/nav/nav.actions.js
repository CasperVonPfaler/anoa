
/**
 * Swap between night and day mode
 */
export function toggleNightModeAction() {
  return (dispatch, getState) => {
    const { nightMode } = getState();
    
    if(!nightMode) {
      document.documentElement.className = 'night-mode';

      dispatch({
        type: 'NAV_TOGGLE_NIGHT_MODE',
        payload: true,
      });
    } else {
      document.documentElement.className = '';

      dispatch({
        type: 'NAV_TOGGLE_NIGHT_MODE',
        payload: false,
      })
    }
  }
}