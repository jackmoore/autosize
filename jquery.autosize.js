// Autosize 1.0 - jQuery plugin for textareas
// (c) 2011 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php

(function ($, undefined) {
    // IE7/IE8 doesn't copy correct value for line-height.
    var copy = [
        'fontFamily',
        'fontSize',
        'fontWeight',
        'fontStyle',
        'letterSpacing',
        'textTransform',
        'wordSpacing'
    ];

    $.fn.autosize = function (className) {
        return this.each(function () {
            var 
            ta = this,
            $ta = $(ta),
            mirror = $('<textarea>').addClass(className || 'autosizejs')[0],
            originalHeight = $ta.height(),
            maxHeight = $ta.css('maxHeight'),
            i,
            active = false;

            maxHeight = maxHeight === 'none' ? 0 : parseInt(maxHeight, 10);

            // Using mainly bare JS in this function because it is going
            // to fire very often while typing, and needs to very efficient.
            function adjust() {
                // the active flag keeps IE from tripping all over itself.  Otherwise
                // actions in the adjust function will cause IE to call adjust again.
                if (!active) {
                    active = true;

                    mirror.value = ta.value;

                    // Update the width in case the original textarea has
                    // a percent based width, which could change at any time.
                    mirror.style.width = $ta.css('width');

                    // Needed for IE to reliably return the correct scrollHeight
                    mirror.scrollTop = 0;

                    // Set a very high value for scrollTop to be sure the 
                    // mirror is scrolled all the way to the bottom.
                    mirror.scrollTop = 9e4;

                    ta.style.height = mirror.scrollTop + 'px';
                    
                    active = false;
                }
            }

            // mirror is a duplicate textarea located off-screen that
            // is automatically updated to contain the same text as the 
            // original textarea.  mirror always has a height of 0.
            // This gives a cross-browser supported way getting the actual
            // height of the text, through the scrollTop property.
            mirror.style.cssText = 'position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; height:0 !important; min-height:0 !important; overflow:hidden';
            for (i = 0; copy[i]; i++) {
                mirror.style[copy[i]] = $ta.css(copy[i]);
            }
            $('body').append(mirror);

            $(window).resize(adjust);

            $ta
                .css({minHeight: originalHeight, overflow: 'hidden'})
                .bind('onpropertychange' in ta ? 'propertychange' : 'input', adjust);

            // Call adjust in case the textarea already contains text.
            adjust();
        });
    };
}(jQuery));