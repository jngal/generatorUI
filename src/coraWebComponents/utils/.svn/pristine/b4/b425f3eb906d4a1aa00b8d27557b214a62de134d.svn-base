/** @module utils/coraError */

/** Class extending an error. 
 * @extends Error
*/
export default class CoraError extends Error {
    /**
     * Creates an error.
     * @param {Object} coraResponse response
     */
    constructor(coraResponse) {
        super(coraResponse.UserMessage);
        this.message = coraResponse.UserMessage;
        this.code = coraResponse.Code;
        this.developerMessage = coraResponse.DeveloperMessage;
        this.coraResponse = coraResponse;
    } 
    /**
     * Get the value of message.
     * @return {*} message value
     */
    get message() {
      return this.message;
    }
}