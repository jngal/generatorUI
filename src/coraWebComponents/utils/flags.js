/** @module utils/flags */
/** Object containing flags. 
 * @type {Object} */
const flags = {
  ADD: 1,
  DELETEALL: 2,
  CANCEL: 4,
  COPY: 8,
  SORT: 16,
  FILTER: 32,
  PAGING: 64,
  ONLY_SELECT: 128,
  SELECT: 143, // ONLY_SELECT + COPY + CANCEL + DELETEALL + ADD
  PRINT: 256,
  RESET: 512,
  EDIT: 1024,
  EDITALL: 2048,
  DELETE: 4098, // DELETE + DELETEALL
  EDITCELL: 8192,
  LEFT_TOOLBAR: 16384,
  TOOLBAR: 32768,
  COLUMN_MENU: 65536,
  COLUMN_SELECTED: 131072,
  USER_FILTER: 262144,
  SORT_DIALOG: 524288
}

export default flags;