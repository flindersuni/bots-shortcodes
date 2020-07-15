/**
 * Test the main class of the library
 */

const assert = require( "assert" );

// eslint-disable-next-line node/no-unpublished-require
const nock = require( "nock" );
const path = require( "path" );

const { BotsShortcodes, LibraryOpenToday } = require( "../index.js" );

let institutionID;
let shortcodeTag;
let shortcodeTagList;

describe( "BotsShortcodes", function() {

  before( function() {
    institutionID = 1234;
    shortcodeTag = "library-open-today";
    shortcodeTagList = [ shortcodeTag ];
  } );

  describe( "#addShortcode", function() {

    it( "should accept one argument", function() {

      const shortcodeSystem = new BotsShortcodes();

      assert.doesNotThrow(
        () => {
          // eslint-disable-next-line no-unused-vars
          shortcodeSystem.addShortcode( new Object() );
        },
        TypeError
      );
    } );

    it( "should throw an error when shortcode argument is not provided", function() {

      const shortcodeSystem = new BotsShortcodes();

      assert.throws(
        () => {
          // eslint-disable-next-line no-unused-vars
          shortcodeSystem.addShortcode();
        },
        TypeError
      );
    } );

    it( "should throw an error when shortcode argument is not an object", function() {

      const shortcodeSystem = new BotsShortcodes();

      assert.throws(
        () => {
          // eslint-disable-next-line no-unused-vars
          shortcodeSystem.addShortcode( "not an object" );
        },
        TypeError
      );
    } );
  } );

  describe( "#tags", function() {
    it( "should return an empty array when no shortcodes are added", function() {

      const shortcodeSystem = new BotsShortcodes();
      assert.strictEqual( shortcodeSystem.tags.length, 0 );

    } );

    it( "should return the same number of tags as added shortcodes", function() {
      const shortcodeSystem = new BotsShortcodes();
      shortcodeSystem.addShortcode( new LibraryOpenToday( institutionID ) );

      assert.strictEqual( shortcodeSystem.tags.length, 1 );
      assert.deepStrictEqual( shortcodeSystem.tags, shortcodeTagList );

    } );

  } );

  describe( "#getTagNames", function() {
    it( "should return an empty array when no shortcodes are added", function() {

      const shortcodeSystem = new BotsShortcodes();

      assert.strictEqual( shortcodeSystem.getTagNames().length, 0 );

    } );

    it( "should return the same number of tags as added shortcodes", function() {
      const shortcodeSystem = new BotsShortcodes();
      shortcodeSystem.addShortcode( new LibraryOpenToday( institutionID ) );

      assert.strictEqual( shortcodeSystem.tags.length, 1 );
      assert.deepStrictEqual( shortcodeSystem.getTagNames(), shortcodeTagList );

    } );

  } );

  describe( "#processAnswer", function() {

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
          path.join( __dirname, "./artefacts/libcal-api-hours-today.json" ),
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

    it( "should return the updated answer content", async function() {
      const shortcodeSystem = new BotsShortcodes();
      shortcodeSystem.addShortcode( new LibraryOpenToday( institutionID ) );

      const input = "[library-open-today library=\"Central library\"]";

      const output = await shortcodeSystem.processAnswer( input );

      assert.ok( output.startsWith( "*Physical collections (Central)*" ) );

    } );

    it( "should return the updated answer content for longer answers", async function() {
      const shortcodeSystem = new BotsShortcodes();
      shortcodeSystem.addShortcode( new LibraryOpenToday( institutionID ) );

      const input = "The central library is located in Bedford Park campus [library-open-today library=\"Central library\"]";

      const output = await shortcodeSystem.processAnswer( input );

      assert.ok( output.startsWith( "The central library is located in Bedford Park campus" ) );
      assert.ok( output.indexOf( "*Physical collections (Central)*" ) > 1 );

    } );
  } );
} );
