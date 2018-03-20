# Important!

This repository was created to workaround a know bug of autosize plugin on iOS 11 as reported on the original repository.

#### [iOS 11.0.3, input box autosize is overlapping the keypad](https://github.com/jackmoore/autosize/issues/343)

A workaround for this bug appeared in a fork of autosize project: 

#### [Workaround for ios 11 bug](https://github.com/jhubble/autosize/commit/18e747124271c7d59362a4a34455dceebf4ed6b0)

To avoid third part changes, this fork was created for ISAO internal use. And should be abandoned when [autosize](https://github.com/jackmoore/autosize) implements the fix on future versions.

## Summary

Autosize is a small, stand-alone script to automatically adjust textarea height to fit text.

#### Demo

Full documentation and a demo can be found at [jacklmoore.com/autosize](http://jacklmoore.com/autosize)

#### Install via NPM
```bash
npm install autosize
```

#### Browser compatibility

Chrome | Firefox | IE | Safari | iOS Safari | Android | Opera Mini | Windows Phone IE
------ | --------|----|--------|------------|---------|------------|------------------
yes    | yes     | 9  | yes    | yes        | 4       | ?          | 8.1

#### Usage

The autosize function accepts a single textarea element, or an array or array-like object (such as a NodeList or jQuery collection) of textarea elements.

```javascript
// from a NodeList
autosize(document.querySelectorAll('textarea'));

// from a single Node
autosize(document.querySelector('textarea'));

// from a jQuery collection
autosize($('textarea'));
```

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
