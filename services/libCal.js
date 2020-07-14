/**
 * Provide access to the LibCal API
 * [more info]{@link https://ask.springshare.com/libcal/}
 */

const fetch = require( "node-fetch" );
const escapeStringRegexp = require( "escape-string-regexp" );

class LibCal {

  /**
   * Create a LibCal object.
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

    // Declare other class properties.
    this.apiHost = "https://api3-au.libcal.com/";
    this.apiTodayHours = "api_hours_today.php?format=json&systemTime=1&iid=";

    // Load the list of libraries
    this.libraries = require( "../resources/libraries.json" );
  }

  /**
   * Get the list of library names
   *
   * @returns {string[]} An array of library names
   */
  getLibraryNames() {
    let libraries = new Array();

    this.libraries.forEach( function( library ) {
      libraries.push( library.name );
    } );

    return libraries;
  }

  /**
   * Get the opening hours for today.
   *
   * @param {string} library The name, or part of the name, of a library.
   *
   * @returns {string} The opening times for the library
   */
  async getTodayTimes( library ) {
    if ( typeof library === "undefined" ) {
      throw new TypeError( "library argument is required" );
    }

    if ( typeof library !== "string" ) {
      throw new TypeError( "library argument must be a string" );
    }

    const url = this.apiHost + this.apiTodayHours + this.iid;
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regexMatcher = new RegExp( escapeStringRegexp( library ), "i" );

    // Find the required library ids.
    let lids = new Array();

    // Set an appropriate default value for the opening times.
    let openTimes = undefined;

    // Fetch the opening times for the libraries.
    const calData = await this.getData( url );

    // Return the default value if the call failed.
    if ( calData !== undefined ) {

      this.libraries.forEach( function( library ) {
        if ( library.name.match( regexMatcher ) !== null ) {
          lids = library.lids;
        }
      } );

      if ( lids.length !== 0 ) {

        openTimes = "";

        lids.forEach( lid => {
          calData.locations.forEach( location => {
            if ( location.lid === lid ) {
              openTimes += "*" + location.name + "*\n" + location.rendered + "\n\n";
            }
          } );
        } );
      }
    }

    return openTimes;
  }

  /**
   * Call the API and return the data provided.
   *
   * @param {string} url The URL of the API endpoint to use.
   * @returns {object} The parsed JSON response from the API.
   */
  async getData( url ) {
    if ( typeof url === "undefined" ) {
      throw new TypeError( "url argument is required" );
    }

    if ( typeof url !== "string" ) {
      throw new TypeError( "url argument must be a string" );
    }

    // TODO: add caching to reduce load on endpoints.
    try {
      const response = await fetch( url );
      const json = await response.json();
      return json;
    } catch ( error ) {
      return undefined;
    }
  }
}

module.exports.LibCal = LibCal;
