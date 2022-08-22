import _ from 'lodash';

/** @module utils/helper */

/**
 * Checks if input string is null or empty.
 * e.g., '' -> true
 * @function stringIsNullOrEmpty
 * @param {string} string string input
 * @returns {boolean}
 */
export const stringIsNullOrEmpty = (string) => {
    return (!string || string.length === 0 || !string.trim() || /^\s*$/.test(string));
}

/**
 * Returns url as string which is corrected by set theme.
 * @function buildUrl
 * @param {string} name url
 * @returns {(string|void)}
 */
export const buildUrl = (name) => {
  const theme = document.body.className;
  if(name){
    switch(theme){
      case 'theme-dark':
        name = name.replace(".svg", "-dark.svg");
        break;
        case 'theme-pink':
        name = name.replace(".svg", "-pink.svg");
        break;
        case 'theme-underwater':
        name = name.replace(".svg", "-underwater.svg");
        break;
        case 'theme-army':
        name = name.replace(".svg", "-army.svg");
        break;
        default:
          return name;
    }
    return name;
  }
}

/**
 * Returns Google OAuth url
 * @function buildGoogleOauthUrl
 * @param {string} redirectURI - Redirect url
 * @param {string} state - State
 * @returns {string}
 */
export const buildGoogleOauthUrl = (redirectURI, state) => {
  return `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&response_type=code&redirect_uri=${redirectURI}&client_id=${window.config.google.id}${state !== undefined ? `&state=${state}` : ''}`;
}

/**
 * Returns version of client as string.
 * @function getClientVersion
 * @returns {string}
 */
export const getClientVersion = () => {
  return process.env.REACT_APP_VERSION.substring(0, 4) + '.' + process.env.REACT_APP_VERSION.substring(4);
}

/**
 * Executes every function in child elements.
 * @function eachDeep
 * @param {Array} columns array object
 * @param {Object} parent parent object
 * @param {Function} fn function to be executed
 */
export var eachDeep = (columns, parent, fn) => {
  if (!_.isArray(columns)) return;
  columns.forEach(item => {
    eachDeep(item.schema, item, fn);
    fn(item, parent);  
  });
}

/**
 * Copy string to clipboard.
 * @function copyToClipboard
 * @param {string} data string input
 */
export var copyToClipboard = (data) => {
  var actEl = document.activeElement;
  var el = document.createElement("textarea");
  el.value = data;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  actEl.focus();
}

/**
 * Replaces diacritical mark letters in input string with letters without diacritical mark.
 * @function removeAccents
 * @param {string} str string input
 * @returns {string}
 */
export var removeAccents = (str) => {
  var accents = 'ÁÄáäÓÔóôÉéČčĎďÍíÚúŇňŠšÝýŽžĹĽĺľŕŤť';
  var accentsOut = "AAaaOOooEeCcDdIiUuNnSsYyZzLLllrTt";
  str = str.split('');
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str[i])) !== -1) {
          str[i] = accentsOut[x];
      }
  }
  return str.join('');
}

/**
 * Returns new filter for input object.
 * @function buildFilter
 * @param {Object} input input object schema
 * @param {Array} schema
 * @returns {Object}
 */
export const buildFilter = (input, schema) => {
  let newFilter = []
  for (let [key, value] of Object.entries(input)) {
    if (value || value === false) {
      const field = key.replace(/(Value|Operator)$/, '');
      const column = schema.find(item => item.field === field || (item.filter === 'container' && (item.field + '.' + item.textField) === field));

      let oldItem = newFilter.find(item => item.field === field);
      if (oldItem) {
        oldItem.field + 'Operator' === key ? oldItem.operator = value : oldItem.value = value
        newFilter = [...newFilter]
      }
      else {
        let newFilterItem
        if (key.search("Value") !== -1) {
          newFilterItem = {
            field: field,
            operator: column.filter && ['numeric', 'date', 'boolean'].includes(column.filter) ? 'eq' : 'contains',
            value: value
          }
        }
        else {
          newFilterItem = {
            field: field,
            operator: value,
            value: null
          }
        }
        newFilter = [...newFilter, newFilterItem]
      }
    }
  }
  newFilter = {
    logic: "and",
    filters: [
      ...newFilter,
    ]
  }
  return newFilter;
}

/**
 * Returns boolean that determines whether the email is valid. 
 * @function validEmail
 * @param {string} email string input which is going to be validated
 * @returns {boolean}
 */
export const validEmail = (email) => { return /\S+@\S+\.\S+/.test(email); }

/**
 * Adds target route to route history.
 * @function onMenuSelect
 * @param {string} targetRoute target of route
 * @param {string} currLocation current location
 * @param {Array} routeHistory history of route
 */
export const onMenuSelect = (targetRoute, currLocation, routeHistory) => {
  if (targetRoute === undefined || currLocation === undefined)
    return;

  if (currLocation !== targetRoute)
    routeHistory.push(targetRoute);
}

/**
 * Returns object of url params from string. 
 * @function getURLParams
 * @param {Array} names array of names of params.
 * @returns {Object}
 */
export const getURLParamsByNames = (names) => {
  const urlParamsPart = window.location.href.split('?')[1];
  if (urlParamsPart === undefined)
      return {};

  const paramsWithValues = urlParamsPart.split('&');
  let URLParams = {};

  names.forEach(name => {
    const paramWithValue = paramsWithValues.find(p => p.includes(name));
    if (paramWithValue) 
        URLParams[name] = paramWithValue.split('=')[1];
  });
  return URLParams;
}

  /**
 * After Login handle
 * @function getURLParams
 * @param {string} username user name to log in.
 * @returns {Object}
 */
export const afterLoginHandle = (props, username) => {
  let {
    rememberDisabled,
    afterLoginlocation,
    location,
    history
  } = props;

  if (!rememberDisabled) {
    if (username) {
      localStorage.setItem('username', username);
    }
    else {
      localStorage.removeItem('username');
    }
  }

  afterLoginlocation = afterLoginlocation ? afterLoginlocation : { from: { pathname: '/' }};
  if (location && location.state && location.state.from) {
    const { pathname } = location.state.from;
    if(pathname !== "/" && !pathname.includes("/prihlasenie") && !pathname.includes("/login")) 
      afterLoginlocation = location.state;
  }

  const { from } = afterLoginlocation;
  history.replace(from);
}