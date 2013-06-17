## Autosize

Small jQuery plugin to allow dynamic resizing of textarea height, so that it grows as based on visitor input.  To use, just call the `.autosize()` method on any textarea element. Example `$('textarea').autosize();`.  See the [project page](http://jacklmoore.com/autosize/) for documentation, caveats, and a demonstration.  Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

## Changelog

### Master
* If you would like to force a mirror to be reconstructed (perhaps you have changed the original textarea's styles at runtime) you can fire the `autosize.textareaStyleChanged` event on the original textarea. Example:

        $('textarea.example').css('text-indent', 25);
        $('textarea.example').trigger('autosize.textareaStyleChanged');

### v1.16.17 - 2013/6/12
* Fixed a compatability issue with jQuery versions before 1.9 introduced in the previous update.

### v1.16.16 - 2013/6/11
* Fixed an issue where the calculated height might be slightly off in modern browsers when the width of the textarea has a subpixel value.

### v1.16.15 - 2013/6/7
* Reduced how frequently autosize is triggered when resizing the window. Added resizeDelay property so that the frequency can be adjusted or disabled.

### v1.16.14 - 2013/6/6
* Fixed an issue with autosize working poorly if the mirror element has a transition applied to it's width.

### v1.16.13 - 2013/6/4
* Fixed a Chrome cursor position issue introduced with the reflow workaround added in 1.16.10.

### v1.16.12 - 2013/5/31
* Much better efficiency and smoothness for IE8 and lower.

### v1.16.11 - 2013/5/31
* Fixed a default height issue in IE8 and lower.

### v1.16.10 - 2013/5/30
* Dropped scrollHeight for scrollTop. This fixed a height problem relating to padding. (Fixes #70)
* Re-added workaround to get Chrome to reflow text after hiding overflow.

### v1.16.9 - 2013/5/20
* Reverted change from 1.16.8 as it caused an issue in IE8. (Fixes #69)

### v1.16.8 - 2013/5/7
* Fixed issue where autosize was creating a horizontal scrollbar for a user

### v1.16.7 - 2013/3/20
* Added workaround for a very edge-case iOS bug (Fixes #58).

### v1.16.6 - 2013/3/12
* Replaced jQuery shorthand methods with on() in anticipation of jQuery 2.0 conditional builds

### v1.16.5 - 2013/3/12
* Fixed a bug where triggering the autosize event immediately after assigning autosize had no effect.

### v1.16.4 - 2013/1/29
* Fixed a conflict with direction:ltr pages.

### v1.16.3 - 2013/1/23
* Added minified file back to repository

### v1.16.2 - 2013/1/20
* Minor box-sizing issue dealing with min-heights.

### v1.16.1 - 2013/1/20
* Added to plugins.jquery.com

### v1.15 - 2012/11/16
* Reworked to only create a single mirror element, instead of one for each textarea.
* Dropped feature detection for FF3 and Safari 4.

### v1.14 - 2012/10/6
* Added 'append' option for appending whitespace to the end of the height calculation (an extra newline improves the apperance when animating).
* Added a demonstration of animating the height change using a CSS transition.

### v1.13 - 2012/9/21
* Added optional callback that fires after resize.

### v1.12 - 2012/9/3
* Fixed a bug I introduced in the last update.

### v1.11 - 2012/8/8
* Added workaround to get Chrome to reflow default text better.

### v1.10 - 2012/4/30
* Added 'lineHeight' to the list of styles considered for size detection.

### v1.9 - 2012/6/19
* Added 'textIndent' to the list of styles considered for size detection.
* Added vender prefixes to box-sizing detection

### v1.8 - 2012/6/7
* Added conditional so that autosize cannot be applied twice to the same element
* When autosize is applied to an element, it will have a data property that links it to the mirrored textarea element.  This will make it easier to keep track of and remove unneeded mirror elements.  Example:

    $('textarea.example').data('mirror').remove(); // delete the mirror

    $('textarea.example').remove(); // delete the original

### v1.7 - 2012/5/3
* Now supports box-sizing:border-box

### v1.6 - 2012/2/11
* added binding to allow autosize to be triggered manually.  Example:
  $('#myTextArea').trigger('autosize');

### v1.5 - 2011/12/7
* fixed a regression in detecting FireFox support

### v1.4 - 2011/11/22
* added branching to exclude old browsers (FF3- & Safari4-)

### v1.3 - 2011/11/13
* fixed a regression in 1.1 relating to Opera.

### v1.2 - 2011/11/10
* fixed a regression in 1.1 that broke autosize for IE9.

### v1.1 - 2011/11/10
* autosize now follows the max-height of textareas.  OverflowY will be set to scroll once the content height exceeds max-height.

### v1.0 - 2011/11/7
* first release
