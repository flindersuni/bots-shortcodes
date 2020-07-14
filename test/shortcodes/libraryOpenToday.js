/*
 * Test the LibraryOpenToday shortcode
 */
const assert = require( "assert" );

const { LibraryOpenToday } = require( "../../shortcodes/libraryOpenToday.js" );


// eslint-disable-next-line node/no-unpublished-require
const nock = require( "nock" );
const path = require( "path" );

let institutionID;
let shortcodeTag;

describe( "LibraryOpenToday", function() {

  // Set consistent institution id for testing.
  before( function() {
    institutionID = 1234;
    shortcodeTag = "library-open-today";
  } );

  describe( "#constructor", function() {
    it( "should return an object", function() {
      const shortcode = new LibraryOpenToday( institutionID );
      assert.strictEqual( typeof shortcode, "object" );
    } );

    it( "should accept one argument", function() {
      assert.doesNotThrow(
        () => {
          // eslint-disable-next-line no-unused-vars
          const shortcode = new LibraryOpenToday( institutionID );
        },
        TypeError
      );
    } );

    it( "should throw an error when iid argument is not provided", function() {
      assert.throws(
        () => {
          // eslint-disable-next-line no-unused-vars
          const shortcode = new LibraryOpenToday();
        },
        TypeError
      );
    } );

    it( "should throw an error when iid argument is not a number", function() {
      assert.throws(
        () => {
          // eslint-disable-next-line no-unused-vars
          const shortcode = new LibraryOpenToday( "1" );
        },
        TypeError
      );
    } );
  } );

  describe( "#tag", function() {
    it( "should return a string", function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const tag = shortcode.tag;
      assert.strictEqual( typeof tag, "string" );
    } );

    it( "should return the right value", function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const tag = shortcode.tag;
      assert.strictEqual( tag, shortcodeTag );
    } );

    it( "should return the same value as getTagName", function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const tag = shortcode.tag;
      const tagName = shortcode.getTagName();
      assert.strictEqual( tag, tagName );
    } );
  } );

  describe( "#getTagName", function() {
    it( "should return a string", function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const tagName = shortcode.getTagName();
      assert.strictEqual( typeof tagName, "string" );
    } );

    it( "should return the right value", function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const tagName = shortcode.getTagName();
      assert.strictEqual( tagName, shortcodeTag );
    } );

    it( "should return the same value as tag", function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const tagName = shortcode.getTagName();
      const tag = shortcode.tag;
      assert.strictEqual( tagName, tag );
    } );
  } );

  describe( "#replace", function() {
    it( "should not replace anything if shortcode is not found", async function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const input = "[invalid-shortcode]";

      const output = await shortcode.replace( input );
      assert.strictEqual( output, input );
    } );

    it( "should replace with an error if required attribute is missing", async function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const input = "[library-open-today]";
      const expected = "Missing 'library' attribute";

      const output = await shortcode.replace( input );
      assert.strictEqual( output, expected );
    } );

    it( "should replace with an error if library is unknown", async function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const input = "[library-open-today library=\"bodleian\"]";
      const expected = "Unknown library 'bodleian'";

      const output = await shortcode.replace( input );
      assert.strictEqual( output, expected );
    } );

  } );

  describe( "#replace - with API call", function() {

    // Setup nock library to mock the fetch requests.
    before( function() {

      // Disable all http net connections to avoid unexpected outside calls.
      nock.disableNetConnect();

      // eslint-disable-next-line no-unused-vars
      const nockScope = nock( "https://api3-au.libcal.com/" )
        .get( "/api_hours_today.php" )
        .query( {
          format: "json",
          systemTime: "1",
          iid: institutionID
        } )
        .replyWithFile(
          200,
          path.join( __dirname, "../artefacts/libcal-api-hours-today.json" ),
          {
            "Content-Type": "application/json"
          }
        ).persist();
    } );

    // Restore environment so that fetch requests are no longer mocked.
    after( function() {
      nock.cleanAll();
      nock.enableNetConnect();
    } );

    it( "should replace with the opening times if the library is known", async function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const input = "[library-open-today library=\"Central library\"]";

      const output = await shortcode.replace( input );

      assert.ok( output.startsWith( "*Physical collections (Central)*" ) );
    } );

    it( "should replace with the opening times in longer text", async function() {
      const shortcode = new LibraryOpenToday( institutionID );
      const input = "The central library is located in Bedford Park campus [library-open-today library=\"Central library\"]";

      const output = await shortcode.replace( input );

      assert.ok( output.startsWith( "The central library is located in Bedford Park campus" ) );
      assert.ok( output.indexOf( "*Physical collections (Central)*" ) > 1 );
    } );
  } );
} );
