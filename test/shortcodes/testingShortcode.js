/*
 * Test the test shortcode
 */
const assert = require( "assert" );

const { TestingShortcode } = require( "../../shortcodes/testingShortcode.js" );

let shortcodeTag;

describe( "TestingShortcode", function() {

  // Set consistent values for testing.
  before( function() {
    shortcodeTag = "bot-shortcode-test";
  } );

  describe( "#constructor", function() {
    it( "should return an object", function() {
      const shortcode = new TestingShortcode();
      assert.strictEqual( typeof shortcode, "object" );
    } );
  } );

  describe( "#tag", function() {
    it( "should return a string", function() {
      const shortcode = new TestingShortcode();
      const tag = shortcode.tag;
      assert.strictEqual( typeof tag, "string" );
    } );

    it( "should return the right value", function() {
      const shortcode = new TestingShortcode();
      const tag = shortcode.tag;
      assert.strictEqual( tag, shortcodeTag );
    } );

    it( "should return the same value as getTagName", function() {
      const shortcode = new TestingShortcode();
      const tag = shortcode.tag;
      const tagName = shortcode.getTagName();
      assert.strictEqual( tag, tagName );
    } );
  } );

  describe( "#getTagName", function() {
    it( "should return a string", function() {
      const shortcode = new TestingShortcode();
      const tagName = shortcode.getTagName();
      assert.strictEqual( typeof tagName, "string" );
    } );

    it( "should return the right value", function() {
      const shortcode = new TestingShortcode();
      const tagName = shortcode.getTagName();
      assert.strictEqual( tagName, shortcodeTag );
    } );

    it( "should return the same value as tag", function() {
      const shortcode = new TestingShortcode();
      const tagName = shortcode.getTagName();
      const tag = shortcode.tag;
      assert.strictEqual( tagName, tag );
    } );
  } );

  describe( "#replace", function() {
    it( "should not replace anything if shortcode is not found", async function() {
      const shortcode = new TestingShortcode();
      const input = "[invalid-shortcode]";

      const output = await shortcode.replace( input );
      assert.strictEqual( output, input );
    } );

    it( "should replace if the shortcode is found", async function() {
      const shortcode = new TestingShortcode();
      const input = "[bot-shortcode-test]";

      const output = await shortcode.replace( input );

      assert.strictEqual( output, "The seething sea ceased to see, then thus sufficeth thus." );
    } );
  } );

} );
