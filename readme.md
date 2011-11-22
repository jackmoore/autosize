## Autosize

Small jQuery plugin to allow dynamic resizing of textarea height, so that it grows as based on visitor input.  To use, just call the `.autosize()` method on any textarea element. Example `$('textarea').autosize();`.  See the [project page](http://jacklmoore.com/autosize/) for documentation and a demonstration.  Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

## Changelog

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
