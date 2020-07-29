/*
 * Test the LibCal service
 */
const assert = require( "assert" );

// eslint-disable-next-line node/no-unpublished-require
const nock = require( "nock" );
const path = require( "path" );

const { LibCal } = require( "../../services/libCal.js" );

let institutionID;
const libraryKey = "central";

/**
 * Consistently set up the mock API response
 */
function setupMockApiResponse() {

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

}

/**
 * Consistently tear down the mock API response
 */
function teardownMockApiResponse() {
  nock.cleanAll();
  nock.enableNetConnect();
}

describe( "LibCal", function() {

  // Set consistent institution id for testing.
  before( function() {
    institutionID = 1234;
  } );

  describe( "#constructor", function() {
    it( "should return an object", function() {
      const libCal = new LibCal( 1 );
      assert.strictEqual( typeof libCal, "object" );
    } );

    it( "should accept one argument", function() {
      assert.doesNotThrow(
        () => {
          // eslint-disable-next-line no-unused-vars
          const libCal = new LibCal( 1 );
        },
        TypeError
      );
    } );

    it( "should throw an error when iid argument is not provided", function() {
      assert.throws(
        () => {
          // eslint-disable-next-line no-unused-vars
          const libCal = new LibCal();
        },
        TypeError
      );
    } );

    it( "should throw an error when iid argument is not a number", function() {
      assert.throws(
        () => {
          // eslint-disable-next-line no-unused-vars
          const libCal = new LibCal( "1" );
        },
        Error
      );
    } );
  } );

  describe( "#getLibraryNames", function() {

    it( "should return an array with the right number of elements", function() {
      const libCal = new LibCal( 1 );
      const libraries = libCal.getLibraryNames();

      assert.strictEqual(
        libraries.length,
        3
      );
    } );

    it( "should return an array with the right elements", function() {
      const libCal = new LibCal( 1 );
      const libraries = libCal.getLibraryNames();

      const expected = [
        "Central library",
        "Sturt library",
        "Medical library"
      ];

      assert.deepStrictEqual(
        libraries,
        expected
      );
    } );

  } );

  describe( "#getTodayTimes", function() {

    // Setup nock library to mock the fetch requests.
    before( function() {
      setupMockApiResponse();
    } );

    // Restore environment so that fetch requests are no longer mocked.
    after( function() {
      teardownMockApiResponse();
    } );

    it( "should accept one argument", async function() {
      await assert.doesNotReject(
        async() => {
          const libCal = new LibCal( institutionID );
          libCal.getTodayTimes( libraryKey );
        },
        TypeError
      );
    } );

    it( "should throw an error when library argument is not provided", async function() {
      await assert.rejects(
        async() => {
          const libCal = new LibCal( 1 );
          await libCal.getTodayTimes();
        },
        TypeError
      );
    } );

    it( "should throw an error when library argument is not a string", async function() {
      await assert.rejects(
        async() => {
          const libCal = new LibCal( 1 );
          await libCal.getTodayTimes( 1 );
        },
        TypeError
      );
    } );

    it( "should return the right rendered times for a valid library", async function() {
      const libCal = new LibCal( institutionID );
      const libraryTimes = await libCal.getTodayTimes( libraryKey );

      assert.ok(
        libraryTimes.startsWith( "*Physical collections (Central)*" )
      );
    } );

    it( "should return undefined for an invalid library", async function() {
      const libCal = new LibCal( institutionID );
      const libraryTimes = await libCal.getTodayTimes( libraryKey + "invalid" );
      assert.strictEqual( libraryTimes, undefined );
    } );

    it( "should return the right rendered times for a valid library from the cache when available", async function() {
      const libCal = new LibCal( institutionID );
      let libraryTimes = await libCal.getTodayTimes( libraryKey );

      assert.ok(
        libraryTimes.startsWith( "*Physical collections (Central)*" )
      );

      libraryTimes = await libCal.getTodayTimes( libraryKey );

      assert.ok(
        libraryTimes.startsWith( "*Physical collections (Central)*" )
      );

      const cacheObj = libCal.getCacheStats();

      assert.strictEqual( cacheObj.hits, 2 );
      assert.strictEqual( cacheObj.misses, 1 );
    } );
  } );

  describe( "#getData", function() {

    // Setup nock library to mock the fetch requests.
    before( function() {

      // Disable all http net connections to avoid unexpected outside calls.
      nock.disableNetConnect();

      // eslint-disable-next-line no-unused-vars
      const nockScope = nock( "https://example.com" )
        .get( "/" )
        .reply(
          200,
          {
            example: "Example json content"
          }
        );
    } );

    // Restore environment so that fetch requests are no longer mocked.
    after( function() {
      nock.cleanAll();
      nock.enableNetConnect();
    } );

    it( "should accept one argument", async function() {
      await assert.doesNotReject(
        async() => {
          const libCal = new LibCal( 1 );
          await libCal.getData( "https://example.com" );
        },
        TypeError
      );
    } );

    it( "should throw an error when url argument is not provided", async function() {
      await assert.rejects(
        async() => {
          const libCal = new LibCal( 1 );
          await libCal.getData();
        },
        TypeError
      );
    } );

    it( "should throw an error when url argument is not a string", async function() {
      await assert.rejects(
        async() => {
          const libCal = new LibCal( 1 );
          await libCal.getData( 1 );
        },
        TypeError
      );
    } );
  } );

  describe( "#getCacheStats", function() {

    // Setup nock library to mock the fetch requests.
    before( function() {
      setupMockApiResponse();
    } );

    // Restore environment so that fetch requests are no longer mocked.
    after( function() {
      teardownMockApiResponse();
    } );


    it( "should return an object containing stats from the memory cache",  async function() {
      const libCal = new LibCal( institutionID );
      await libCal.getTodayTimes( libraryKey );
      const cacheObj = libCal.getCacheStats();

      assert.ok( typeof cacheObj === "object" );

    } );

    it( "should return an object containing the right stats",  async function() {
      const libCal = new LibCal( institutionID );
      await libCal.getTodayTimes( libraryKey );
      await libCal.getTodayTimes( libraryKey );
      const cacheObj = libCal.getCacheStats();

      assert.strictEqual( cacheObj.hits, 2 );
      assert.strictEqual( cacheObj.misses, 1 );

    } );

  } );

  describe( "#getTodayTimes - server error", function() {

    it( "should return an empty string when a server error occurs", async function() {

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
        .replyWithError( {
          message: "something awful happened",
          code: "AWFUL_ERROR"
        } );

      const libCal = new LibCal( institutionID );
      const libraryTimes = await libCal.getTodayTimes( libraryKey );
      assert.strictEqual( libraryTimes, undefined );

      nock.cleanAll();
      nock.enableNetConnect();
    } );
  } );

  describe( "#getTodayTimes - http error", function() {

    it( "should return an empty string when a http error occurs", async function() {

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
        .reply( 404 );

      const libCal = new LibCal( institutionID );
      const libraryTimes = await libCal.getTodayTimes( libraryKey );
      assert.strictEqual( libraryTimes, undefined );

      nock.cleanAll();
      nock.enableNetConnect();
    } );
  } );
} );
