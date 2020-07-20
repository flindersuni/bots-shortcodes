/**
 * Main for the the Bots Shortcodes package
 */

 class BotsShortcodes {

  /**
   * Create a new BotsShortcodes object
   */
  constructor() {

    this.shortcodes = [];
    this.shotcodeTags = [];

  }

  /**
   * Add a shortcode to the list of ones that will be used to process answers.
   *
   * @param {object} shortcode An instantiated shortcode object ready for use.
   */
  addShortcode( shortcode ) {

    if ( typeof shortcode === "undefined" ) {
      throw new TypeError( "shortcode argument is required" );
    }

    if ( typeof shortcode !== "object" ) {
      throw new TypeError( "shortcode argument must be an object" );
    }

    this.shortcodes.push( shortcode );
    this.tags.push( shortcode.tag );
  }

  /**
   * Return a list of tags configured for use.
   *
   * @returns {Array} an array of shortcode tags
   */
  get tags() {
    return this.getTagNames();
  }

  /**
   * Return a list of tag names configured for use.
   *
   * @returns {Array} an array of shortcode tag names
   */
  getTagNames() {
    return this.shotcodeTags;
  }

  /**
   * Check the answer for all of the configured shortcodes.
   *
   * @param {string} answerContent The content of the answer.
   *
   * @returns {string} The updated answer content.
   */
  async processAnswer( answerContent ) {

    for ( let i = 0; i < this.shortcodes.length; i++ ) {
      // eslint-disable-next-line security/detect-object-injection
      const shortcode = this.shortcodes[ i ];
      answerContent = await shortcode.replace( answerContent );
    }

    return answerContent;
  }

 }

module.exports.BotsShortcodes = BotsShortcodes;
module.exports.LibraryOpenToday = require( "./shortcodes/libraryOpenToday.js" ).LibraryOpenToday;
module.exports.TestingShortcode = require( "./shortcodes/testingShortcode.js" ).TestingShortcode;
