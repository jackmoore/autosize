## Changelog

##### v.3.0.0 - 2015-04-15
* added new methods for updating and destroying:
	autosize.update(elements)
	autosize.destroy(elements)
	
* renamed custom events as to not use jQuery's custom events namespace:
	autosize.resized renamed to autosize:resized
	autosize.update renamed to autosize:update
	autosize.destroy renamed to autosize:destroy

##### v.2.0.1 - 2015-04-15
* version bump for NPM publishing purposes

##### v.2.0.0 - 2015-02-25

* smaller, simplier code-base
* new API.  Example usage: `autosize(document.querySelectorAll(textarea));`
* dropped jQuery dependency
* dropped IE7-IE8 support
* dropped optional parameters
* closes #98, closes #106, closes #123, fixes #129, fixes #132, fixes #139, closes #140, closes #166, closes #168, closes #192, closes #193, closes #197