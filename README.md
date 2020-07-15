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

[qnamaker]: https://www.qnamaker.ai/
[wordpress]: https://wordpress.org/
