# Flinders bots shortcodes

![Node.js CI](https://github.com/flindersuni/bots-shortcodes/workflows/Node.js%20CI/badge.svg)

This is a small library of shortcodes, building on an idea popularised by
blogging systems such as [WordPress] and their shortcode system.

The intent is use shortcodes to enhance answers returned from the
[QnA Maker][qnamaker] service with dynamic content.

## Available shortcodes

### LibraryOpenToday

The `[library-open-today]` shortcode is used to lookup today's opening times
for one of the libraries at Flinders. The shortcode uses a single parameter to identify the library. For example:

```bash
[library-open-today library="Central library"]
```

Valid library names are listed in the `resources/libraries.json` file.

### TestingShortcode

The `[bot-shortcode-test]` shortcode is designed to support unit testing of the
shortcode system in other projects. It is not intended for, or useful in, production
scenarious.

## Chatbots at Flinders University

Exploring the use of chatbots at [Flinders University][flinders] is a project currently
underway by the [Business Improvement team][biteam], in collaboration with stakeholders
across the university.

[biteam]: https://staff.flinders.edu.au/colleges-and-services/ids/dbs/business-improvement
[flinders]: https://www.flinders.edu.au
[qnamaker]: https://www.qnamaker.ai/
[wordpress]: https://wordpress.org/
