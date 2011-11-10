// Autosize 1.2 - jQuery plugin for textareas
// (c) 2011 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php

(function ($, undefined) {
    $.fn.autosize = function (className) {

        // line-height was omitted because IE7/IE8 doesn't return the correct value.
        var 
        hidden = 'hidden',
        copy = '<textarea style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden">',
        copyStyle = [
            'fontFamily',
            'fontSize',
            'fontWeight',
            'fontStyle',
            'letterSpacing',
            'textTransform',
            'wordSpacing'
        ],
        i = copyStyle.length;

        return this.each(function () {
            var 
            ta = this,
            $ta = $(ta).css({
                overflow: hidden, 
                overflowY: hidden, 
                wordWrap: 'break-word'
            }),
            mirror = $(copy).addClass(className || 'autosizejs')[0],
            minHeight = $ta.height(),
            maxHeight = parseInt($ta.css('maxHeight'), 10) || 9e4,
            active;

            // Using mainly bare JS in this function because it is going
            // to fire very often while typing, and needs to very efficient.
            function adjust() {
                var height, overflow;
                // the active flag keeps IE from tripping all over itself.  Otherwise
                // actions in the adjust function will cause IE to call adjust again.
                if (!active) {
                    active = true;

                    mirror.value = ta.value;

                    mirror.style.overflowY = ta.style.overflowY;

                    // Update the width in case the original textarea has
                    // a percent based width, which could change at any time.
                    mirror.style.width = $ta.css('width');


                    // Needed for IE to reliably return the correct scrollHeight
                    mirror.scrollTop = 0;

                    // Set a very high value for scrollTop to be sure the 
                    // mirror is scrolled all the way to the bottom.
                    mirror.scrollTop = 9e4;

                    height = mirror.scrollTop;
                    overflow = hidden;
                    if (height > maxHeight) {
                        height = maxHeight;
                        overflow = 'scroll';
                    } else if (height < minHeight) {
                        height = minHeight;
                    }
                    ta.style.overflowY = overflow;

                    // Setting the minHeight and maxHeight will restrict webkit resize 
                    // to only resizing the width.
                    ta.style.height = ta.style.minHeight = ta.style.maxHeight = height + 'px';
                    
                    // This small timeout gives IE a chance to draw it's scrollbar
                    // before adjust can be run again (prevents an infinite loop).
                    setTimeout(function () {
                        active = false;
                    }, 1);
                }
            }

            // mirror is a duplicate textarea located off-screen that
            // is automatically updated to contain the same text as the 
            // original textarea.  mirror always has a height of 0.
            // This gives a cross-browser supported way getting the actual
            // height of the text, through the scrollTop property.
            while (i--) {
                mirror.style[copyStyle[i]] = $ta.css(copyStyle[i]);
            }

            $('body').append(mirror);

            $(window).resize(adjust);

            if ('onpropertychange' in ta) {
                if ('oninput' in ta) {
                    // This catches IE9.  It does not fire onpropertychange or oninput for deletions,
                    // so binding to onkeyup to catch most of those occassions.  There is no way that I
                    // know of to detect something like 'cut' in IE9.
                    ta.oninput = adjust;
                    ta.onkeyup = adjust;
                } else {
                    // IE7 / IE8
                    ta.onpropertychange = adjust;
                }
            } else {
                // Modern Browsers
                ta.oninput = adjust;
            }

            // Call adjust in case the textarea already contains text.
            adjust();
        });
    };
}(jQuery));