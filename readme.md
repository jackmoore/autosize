## Summary

Autosize is a small, stand-alone script to automatically adjust textarea height to fit text.

## Install

[Download zip](https://github.com/jackmoore/autosize/archive/master.zip)

##### Install via NPM
```bash
npm install autosize
```
##### Install via Bower
```bash
bower install autosize
```

#### Browser compatibility

Chrome | Firefox | IE | Safari | iOS Safari | Android | Opera Mini
------ | --------|----|--------|------------|---------|------------
yes    | yes     | 9  | yes    | yes        | 4       | ?

### Usage

The autosize function accepts a single textarea element, or an array or array-like object (such as a NodeList or jQuery collection) of textarea elements.

```javascript
// from a NodeList
autosize(document.querySelectorAll('textarea'));

// from a single Node
autosize(document.querySelector('textarea'));

// from a jQuery collection
autosize($('textarea'));
```

### Lifecycle Events

##### autosize.update (triggerable)

Once you've assigned autosize to an element, you can manually trigger the resize event by using the 'autosize.update' event. Autosize has no way of knowing when a script has changed the value of a textarea element, or when the textarea element styles have changed, so this event would be used instruct autosize to resize the textarea.


```javascript
var ta = document.querySelector('textarea');

autosize(ta);

// Change the value of the textarea
ta.value = "Something really long";
ta.style.fontSize = '20px';

// Dispatch a 'autosize.update' event to trigger a resize:
var evt = document.createEvent('Event');
evt.initEvent('autosize.update', true, false);
ta.dispatchEvent(evt);
```

##### autosize.destroy (triggerable)

```javascript
var ta = document.querySelector('textarea');

// assign autosize to ta
autosize(ta);

// remove autosize from ta
var evt = document.createEvent('Event');
evt.initEvent('autosize.destroy', true, false);
ta.dispatchEvent(evt);
```

##### autosize.resized (observable)

This event is fired every time autosize adjusts the textarea height.

```javascript
var ta = document.querySelector('textarea');

ta.addEventListener('autosize.resized', function(){
	console.log('textarea height updated');
});

### Differences between v2 and v1

If you need the v1 version for whatever reason, you can find it in the v1 branch on Github:
[https://github.com/jackmoore/autosize/tree/v1](https://github.com/jackmoore/autosize/tree/v1)

Autosize v2 is a smaller, simplier script than v1.  It is now a stand-alone script instead of a jQuery plugin, and support for IE8 and lower has been dropped (legacy IE users will be presented with an unmodified textarea element).  Additionally, Autosize v2 does not take in any optional parameters at this time.

Autosize v2 does not create a mirror textarea element in order to calculate the correct height, which was responsible for much of the original script's complexity.  This should be more efficient and reliable, but the new method prevents using a CSS transition to animate the height change.


### Converting to a jQuery plugin

Autosize does not depend on jQuery, but it can easily be turned into a jQuery plugin if desired.

```javascript
// Create the plugin:
window.jQuery.fn.autosize = function() {
	return autosize(this);
};

// Use the plugin:
jQuery(function($){
	$('textarea').autosize();
});
```

### Known Issues &amp; Solutions

#### Incorrect size with hidden textarea elements

Autosize needs to be able to calculate the width of the textarea element when it is assigned.  JavaScript cannot accurately calculate the width of an element that has been removed from the document flow.  If you want to assign Autosize to a hidden textarea element, be sure to either specify the pixel width of the element in your CSS, or trigger the `autosize.update` event after you reveal the textarea element.

**Possible ways to resolve:**

* Specify an exact width for the textarea element in your stylesheet.
* Wait until after the textarea element has been revealed before assigning Autosize.
* Trigger the `autosize.update` event after the element has been revealed.

```javascript
var ta = document.querySelector('textarea');
ta.style.display = 'none';
autosize(ta);
ta.style.display = '';

// Trigger the autosize.update event to recalculate the size:
var evt = document.createEvent('Event');
evt.initEvent('autosize.update', true, false);
ta.dispatchEvent(evt);
```

* Wait until the textarea has been focused by the user before assigning Autosize.

```javascript
var ta = document.querySelector('textarea');
ta.addEventListener('focus', function(){
	autosize(ta);
});
```

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
