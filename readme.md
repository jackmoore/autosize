## Autosize

Small jQuery plugin to allow dynamic resizing of textarea height, so that it grows as based on visitor input.  To use, just call the `.autosize()` method on any textarea element. Example `$('textarea').autosize();`.  See the [project page](http://jacklmoore.com/autosize/) for documentation, caveats, and a demonstration.  Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

## Changelog

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
* Minor boxsizing issue dealing with min-heights.

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
