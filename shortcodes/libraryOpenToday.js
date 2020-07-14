/**
 * A class to expose a short code for the inclusion of library opening times
 * for a an answer returned from the QnA Maker service
 */

const { LibCal } = require( "../services/libCal.js" );

// eslint-disable-next-line node/no-unpublished-require
const WPShortcodeSystem = require( "@wordpress/shortcode" );

class LibraryOpenToday {

  /**
   * Create a LibraryOpenToday object.
   *
   * @param {number} iid A unique institution id.
   */
  constructor( iid ) {
    if ( typeof iid === "undefined" ) {
      throw new TypeError( "iid argument is required" );
    }

    if ( typeof iid !== "number" ) {
      throw new TypeError( "iid argument must be a number" );
    }

    this.iid = iid;
    this.libCal = undefined;
  }

  get tag() {
    return this.getTagName();
  }

  getTagName() {
    return "library-open-today";
  }

  /**
   * Function to return the content to replace the shortcode
   *
   * @param {string} answerContent The content of the answer to check.
   *
   * @returns {string} The content to be used in place of the shortcode.
   */
  async replace( answerContent ) {

    if ( this.libCal === undefined ) {
      this.libCal = new LibCal( this.iid );
    }

    // See if there is a matching shortcode in the content.
    const match = WPShortcodeSystem.next(
      this.tag,
      answerContent
    );

    if ( match === undefined ) {
      return answerContent;
    }

    if ( match.shortcode.attrs.named.library === undefined ) {
      return "Missing 'library' attribute";
    }

    // eslint-disable-next-line max-len
    if ( this.libCal.getLibraryNames().includes( match.shortcode.attrs.named.library ) === false ) {
      return `Unknown library '${match.shortcode.attrs.named.library}'`;
    }

    const openTimes = await this.libCal.getTodayTimes(
      match.shortcode.attrs.named.library
    );

    answerContent = WPShortcodeSystem.replace(
      this.tag,
      answerContent,
      () => openTimes
    );

    return answerContent;
  }
}

module.exports.LibraryOpenToday = LibraryOpenToday;
