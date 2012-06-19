## Autosize

Small jQuery plugin to allow dynamic resizing of textarea height, so that it grows as based on visitor input.  To use, just call the `.autosize()` method on any textarea element. Example `$('textarea').autosize();`.  See the [project page](http://jacklmoore.com/autosize/) for documentation and a demonstration.  Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

## Changelog

### Master
* Added 'textIndent' to the list of styles considered for size detection.

### Version 1.8 - June 7, 2012
* Added conditional so that autosize cannot be applied twice to the same element
* When autosize is applied to an element, it will have a data property that links it to the mirrored textarea element.  This will make it easier to keep track of and remove unneeded mirror elements.  Example:

    $('textarea.example').data('mirror').remove(); // delete the mirror

    $('textarea.example').remove(); // delete the original

### Version 1.7 - May 3, 2012
* Now supports box-sizing:border-box

### Version 1.6 - February 11, 2012
* added binding to allow autosize to be triggered manually.  Example:
  $('#myTextArea').trigger('autosize');

### Version 1.5 - December 7, 2011
* fixed a regression in detecting FireFox support

### Version 1.4 - November 22, 2011
* added branching to exclude old browsers (FF3- & Safari4-)

### Version 1.3 - November 13, 2011
* fixed a regression in 1.1 relating to Opera.

### Version 1.2 - November 10, 2011
* fixed a regression in 1.1 that broke autosize for IE9.

### Version 1.1 - November 10, 2011
* autosize now follows the max-height of textareas.  OverflowY will be set to scroll once the content height exceeds max-height. 

### Version 1.0 - November 7, 2011
* first release
