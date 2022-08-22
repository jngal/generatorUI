
const USER_KEY = 'User';

/** @module utils/storage */

/**
 * Initializes session provider.
 * @function sessionProviderInit
 * @param {object} cb Callback
 */
export const sessionProviderInit = (cb) => {
  if (!sessionStorage.length) {
    // Ask other tabs for session storage
    localStorage.setItem('getSession', Date.now());
  };

  window.addEventListener('storage', function (event) {

    if (event.key === 'getSession') {
      // Some tab asked for the sessionStorage -> send it

      localStorage.setItem('session', sessionStorage.getItem('User'));
      localStorage.removeItem('session');

    } else if (event.key === 'session' && !sessionStorage.length) {
      // sessionStorage is empty -> fill it

      // var data = JSON.parse(event.newValue);
      sessionStorage.setItem('User', event.newValue);
      cb();

      // console.log(data)

      // for (const key in data) {
      //   sessionStorage.setItem(key, data[key]);
      // }

    }
  });

  window.onbeforeunload = function () {
    //sessionStorage.clear();
  };
}
/**
 * Returns 'User' from session storage.
 * @function getUser
 * @returns {Object}
 */
export const getUser = () => {
  return getItem(USER_KEY);
}

/**
 * Sets value for 'User' to session storage.
 * @function setUser
 * @param {Object} user value to be set
 */
export const setUser = (user) => {
  setItem(USER_KEY, user);
}

/**
 * Removes 'User' from session storage.
 * @function removeUser
 */
export const removeUser = () => {
  removeItem(USER_KEY);
}

/**
 * Sets item in session storage.
 * @function setItem
 * @param {string} key item key to be set
 * @param {Object} value value to be set
 */
export const setItem = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * Returns item from session storage.
 * @function getItem
 * @param {string} key item key
 * @returns {Object}
 */
export const getItem = (key) => {
  return JSON.parse(sessionStorage.getItem(key));
}

/**
 * Removes item from session storage.
 * @function removeItem
 * @param {string} key key to be removed from session storage
 */
export const removeItem = (key) => {
  sessionStorage.removeItem(key);
}