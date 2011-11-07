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
            i;

            // Using mainly bare JS in this function because it is going
            // to fire very often while typing, and needs to very efficient.
            function adjust(e) {
                mirror.value = ta.value;

                // Update the width in case the original textarea has
                // a percent based width, which could change at any time.
                mirror.style.width = $ta.css('width');

                if (e && e.keyCode !== undefined) {
                    // Little work-arounds to fix the height for IE.
                    if (e.keyCode === 13 && e.type === 'keydown') {
                        mirror.value += '\n';
                    } else {
                        mirror.value += 'x';
                    }
                    // Set to 0 to fix an issue in IE7 / IE8 where bad
                    // scrollTop data is returned when the textarea is 
                    // taller than the viewport.
                    mirror.scrollTop = 0;
                }

                // Set a very high value for scrollTop to be sure the 
                // mirror is scrolled all the way to the bottom.
                mirror.scrollTop = 9e4;
                ta.style.height = ta.style.maxHeight = mirror.scrollTop + 'px';
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

            $ta.css({
                overflow: 'hidden',
                minHeight: originalHeight
            });

            $(window).resize(adjust);

            // Using the oninput event is more efficient than binding to 
            // onkeyup and onkeydown and can support actions like drag/drop 
            // copy/paste, spelling-correct, etc.

            // oninput is not supported in IE6-IE8, and in IE9 the event does 
            // not fire for deletions so key presses reluctantly used for IE.
            if ('onpropertychange' in ta) {
                if ('oninput' in ta) {
                    // IE9
                    $ta.bind('keyup input', adjust);
                } else {
                    // IE6-8
                    $ta.bind('keyup keydown', adjust);
                    // IE does not give the right scrollTop when adjust
                    // is originally called, it has to be called twice.
                    adjust();
                }
            } else {
                $ta.bind('input', adjust);
            }
            
            // Call adjust in case the textarea already contains text.
            adjust();
        });
    };
}(jQuery));