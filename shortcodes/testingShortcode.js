/**
 * A class to expose a short code for testing purposes
 */

 // eslint-disable-next-line node/no-unpublished-require
const WPShortcodeSystem = require( "@wordpress/shortcode" );

class TestingShortcode {

  get tag() {
    return this.getTagName();
  }

  getTagName() {
    return "bot-shortcode-test";
  }

  /**
   * Function to return the content to replace the shortcode
   *
   * @param {string} answerContent The content of the answer to check.
   *
   * @returns {string} The content to be used in place of the shortcode.
   */
  async replace( answerContent ) {

    // See if there is a matching shortcode in the content.
    const match = WPShortcodeSystem.next(
      this.tag,
      answerContent
    );

    if ( match === undefined ) {
      return answerContent;
    }

    answerContent = WPShortcodeSystem.replace(
      this.tag,
      answerContent,
      () => "The seething sea ceased to see, then thus sufficeth thus."
    );

    return answerContent;
  }
}

module.exports.TestingShortcode = TestingShortcode;
