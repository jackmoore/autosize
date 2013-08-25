/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
/*jslint white: true vars: true browser: true todo: true */
/*global jQuery:true $:true bililiteRange:true */

/* jQuery Simulate Key-Sequence Plugin 1.1.6
 * http://github.com/j-ulrich/jquery-simulate-ext
 * 
 * Copyright (c) 2013 Jochen Ulrich
 * Licensed under the MIT license (MIT-LICENSE.txt).
 * 
 * The plugin is an extension and modification of the jQuery sendkeys plugin by Daniel Wachsstock.
 * Therefore, the original copyright notice and license follow below.
 */

// insert characters in a textarea or text input field
// special characters are enclosed in {}; use {{} for the { character itself
// documentation: http://bililite.com/blog/2008/08/20/the-fnsendkeys-plugin/
// Version: 2.0
// Copyright (c) 2010 Daniel Wachsstock
// MIT license:
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

;(function($, undefined){
	"use strict";
	
	var quirks = {
		/**
		 * When simulating with delay in non-input elements,
		 * all spaces are simulated at the end of the sequence instead
		 * of the correct position.
		 */
		delayedSpacesInNonInputGlitchToEnd: false
	};

	$.extend($.simulate.prototype,
			
	/**
	 * @lends $.simulate.prototype
	 */		
	{
		
		/**
		 * Simulates sequencial key strokes.
		 * 
		 * @see https://github.com/j-ulrich/jquery-simulate-ext/blob/master/doc/key-sequence.md
		 * @public
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		simulateKeySequence: function() {
			var target = this.target,
				$target = $(target),
				opts = $.extend({
					sequence: "",
					triggerKeyEvents: true,
					delay: 0,
					callback: undefined
				}, this.options),
				sequence = opts.sequence;
				
			opts.delay = parseInt(opts.delay,10);

			var localkeys = {};

			// Fix for #6 (https://github.com/j-ulrich/jquery-simulate-ext/issues/6)
			/* Since feature detection would be too complicated Although using browser detection instead of feature detection is bad,
			 * it 
			 */
			if (quirks.delayedSpacesInNonInputGlitchToEnd && !$target.is('input,textarea')) {
				$.extend(localkeys, {
					' ': function(rng, s, opts) {
						var internalOpts = $.extend({}, opts, {
							triggerKeyEvents: false,
							delay: 0,
							callback: undefined
						});
						$.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, '\xA0', internalOpts);
						$.simulate.prototype.simulateKeySequence.defaults['{leftarrow}'](rng, s, internalOpts);
						$.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, s, opts);
						$.simulate.prototype.simulateKeySequence.defaults['{del}'](rng, s, internalOpts);
					}
				});
			}

			$.extend(localkeys, opts, $target.data('simulate-keySequence')); // allow for element-specific key functions

			// most elements to not keep track of their selection when they lose focus, so we have to do it for them
			var rng = $.data (target, 'simulate-keySequence.selection');
			if (!rng){
				rng = bililiteRange(target).bounds('selection');
				$.data(target, 'simulate-keySequence.selection', rng);
				$target.bind('mouseup.simulate-keySequence', function(){
					// we have to update the saved range. The routines here update the bounds with each press, but actual keypresses and mouseclicks do not
					$.data(target, 'simulate-keySequence.selection').bounds('selection');
				}).bind('keyup.simulate-keySequence', function(evt){
					// restore the selection if we got here with a tab (a click should select what was clicked on)
					if (evt.which === 9){
						// there's a flash of selection when we restore the focus, but I don't know how to avoid that.
						$.data(target, 'simulate-keySequence.selection').select();
					}else{
						$.data(target, 'simulate-keySequence.selection').bounds('selection');
					}	
				});
			}
			target.focus();
			if (typeof sequence === 'undefined') { // no string, so we just set up the event handlers
				return;
			}
			sequence = sequence.replace(/\n/g, '{enter}'); // turn line feeds into explicit break insertions
			
			/**
			 * Informs the rest of the world that the sequences is finished.
			 * @fires simulate-keySequence
			 * @requires target
			 * @requires sequence
			 * @requires opts
			 * @inner
			 * @author julrich
			 * @since 1.0
			 */
			function sequenceFinished() {
				$target.trigger({type: 'simulate-keySequence', sequence: sequence});
				if ($.isFunction(opts.callback)) {
					opts.callback.apply(target, [{
						sequence: sequence
					}]);
				}
			}
			
			/**
			 * Simulates the key stroke for one character (or special sequence) and sleeps for
			 * <code>opts.delay</code> milliseconds.
			 * @requires lastTime
			 * @requires now()
			 * @requires tokenRegExp
			 * @requires opts
			 * @requires rng
			 * @inner
			 * @author julrich
			 * @since 1.0
			 */
			function processNextToken() {
				var timeElapsed = now() - lastTime; // Work-around for Firefox "bug": setTimeout can fire before the timeout
				if (timeElapsed >= opts.delay) {
					var match = tokenRegExp.exec(sequence);
					if ( match !== null ) {
						var s = match[0];
						(localkeys[s] || $.simulate.prototype.simulateKeySequence.defaults[s] || $.simulate.prototype.simulateKeySequence.defaults.simplechar)(rng, s, opts);
						setTimeout(processNextToken, opts.delay);
					}
					else {
						sequenceFinished();
					}
					lastTime = now();
				}
				else {
					setTimeout(processNextToken, opts.delay - timeElapsed);
				}
			}

			if (!opts.delay || opts.delay <= 0) {
				// Run as fast as possible
				sequence.replace(/\{[^}]*\}|[^{]+/g, function(s){
					(localkeys[s] || $.simulate.prototype.simulateKeySequence.defaults[s] || $.simulate.prototype.simulateKeySequence.defaults.simplechar)(rng, s, opts);
				});
				sequenceFinished();
			}
			else {
				var tokenRegExp = /\{[^}]*\}|[^{]/g; // This matches curly bracket expressions or single characters
				var now = Date.now || function() { return new Date().getTime(); },
					lastTime = now();
				
				processNextToken();
			}
			
		}
	});

	$.extend($.simulate.prototype.simulateKeySequence.prototype,
			
	/**
	 * @lends $.simulate.prototype.simulateKeySequence.prototype
	 */		
	{
		
			/**
			 * Maps special character char codes to IE key codes (covers IE and Webkit)
			 * @author julrich
			 * @since 1.0
			 */
			IEKeyCodeTable: {
				 33: 49,	// ! -> 1
				 64: 50,	// @ -> 2
				 35: 51,	// # -> 3
				 36: 52,	// $ -> 4
				 37: 53,	// % -> 5
				 94: 54,	// ^ -> 6
				 38: 55,	// & -> 7
				 42: 56,	// * -> 8
				 40: 57,	// ( -> 9
				 41: 48,	// ) -> 0
				
				 59: 186,	// ; -> 186
				 58: 186,	// : -> 186
				 61: 187,	// = -> 187
				 43: 187,	// + -> 187
				 44: 188,	// , -> 188
				 60: 188,	// < -> 188
				 45: 189,	// - -> 189
				 95: 189,	// _ -> 189
				 46: 190,	// . -> 190
				 62: 190,	// > -> 190
				 47: 191,	// / -> 191
				 63: 191,	// ? -> 191
				 96: 192,	// ` -> 192
				126: 192,	// ~ -> 192
				 91: 219,	// [ -> 219
				123: 219,	// { -> 219
				 92: 220,	// \ -> 220
				124: 220,	// | -> 220
				 93: 221,	// ] -> 221
				125: 221,	// } -> 221
				 39: 222,	// ' -> 222
				 34: 222	// " -> 222
			},
			
			/**
			 * Tries to convert character codes to key codes.
			 * @param {Numeric} character - A character code
			 * @returns {Numeric} The key code corresponding to the given character code,
			 * based on the key code table of InternetExplorer. If no corresponding key code
			 * could be found (which will be the case for all special characters except the common
			 * ones), the character code itself is returned. However, <code>keyCode === charCode</code>
			 * does not imply that no key code was found because some key codes are identical to the
			 * character codes (e.g. for uppercase characters).
			 * @requires $.simulate.prototype.simulateKeySequence.prototype.IEKeyCodeTable
			 * @see $.simulate.prototype.simulateKeySequence.prototype.IEKeyCodeTable
			 * @author julrich
			 * @since 1.0
			 */
			charToKeyCode: function(character) {
				var specialKeyCodeTable = $.simulate.prototype.simulateKeySequence.prototype.IEKeyCodeTable;
				var charCode = character.charCodeAt(0);
		
				if (charCode >= 64 && charCode <= 90 || charCode >= 48 && charCode <= 57) {
					// A-Z and 0-9
					return charCode;
				}
				else if (charCode >= 97 && charCode <= 122) {
					// a-z -> A-Z
					return character.toUpperCase().charCodeAt(0);
				}
				else if (specialKeyCodeTable[charCode] !== undefined) {
					return specialKeyCodeTable[charCode];
				}
				else {
					return charCode;
				}
			}
	});

	// add the functions publicly so they can be overridden
	$.simulate.prototype.simulateKeySequence.defaults = {
		
		/**
		 * Simulates key strokes of "normal" characters (i.e. non-special sequences).
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @param {String} s - String of (simple) characters to be simulated. 
		 * @param {Object} opts - The key-sequence options.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		simplechar: function (rng, s, opts){
			rng.text(s, 'end');
			if (opts.triggerKeyEvents) {
				for (var i =0; i < s.length; i += 1){
					var charCode = s.charCodeAt(i);
					var keyCode = $.simulate.prototype.simulateKeySequence.prototype.charToKeyCode(s.charAt(i));
					// a bit of cheating: rng._el is the element associated with rng.
					$(rng._el).simulate('keydown', {keyCode: keyCode});
					$(rng._el).simulate('keypress', {keyCode: charCode, which: charCode, charCode: charCode});
					$(rng._el).simulate('keyup', {keyCode: keyCode});
				}
			}
		},
		
		/**
		 * Simulates key strokes of a curly opening bracket. 
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @param {String} s - Ignored. 
		 * @param {Object} opts - The key-sequence options.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		'{{}': function (rng, s, opts){
			$.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, '{', opts);
		},
		
		/**
		 * Simulates hitting the enter button.
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @param {String} s - Ignored. 
		 * @param {Object} opts - The key-sequence options.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		'{enter}': function (rng, s, opts){
			rng.insertEOL();
			rng.select();
			if (opts.triggerKeyEvents === true) {
				$(rng._el).simulate('keydown', {keyCode: 13});
				$(rng._el).simulate('keypress', {keyCode: 13, which: 13, charCode: 13});
				$(rng._el).simulate('keyup', {keyCode: 13});
			}
		},
		
		/**
		 * Simulates hitting the backspace button.
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @param {String} s - Ignored. 
		 * @param {Object} opts - The key-sequence options.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		'{backspace}': function (rng, s, opts){
			var b = rng.bounds();
			if (b[0] === b[1]) { rng.bounds([b[0]-1, b[0]]); } // no characters selected; it's just an insertion point. Remove the previous character
			rng.text('', 'end'); // delete the characters and update the selection
			if (opts.triggerKeyEvents === true) {
				$(rng._el).simulate('keydown', {keyCode: 8});
				$(rng._el).simulate('keyup', {keyCode: 8});
			}
		},
		
		/**
		 * Simulates hitting the delete button.
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @param {String} s - Ignored. 
		 * @param {Object} opts - The key-sequence options.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		'{del}': function (rng, s, opts){
			var b = rng.bounds();
			if (b[0] === b[1]) { rng.bounds([b[0], b[0]+1]); } // no characters selected; it's just an insertion point. Remove the next character
			rng.text('', 'end'); // delete the characters and update the selection
			if (opts.triggerKeyEvents === true) {
				$(rng._el).simulate('keydown', {keyCode: 46});
				$(rng._el).simulate('keyup', {keyCode: 46});
			}
		},
		
		/**
		 * Simulates hitting the right arrow button.
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @param {String} s - Ignored. 
		 * @param {Object} opts - The key-sequence options.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		'{rightarrow}':  function (rng, s, opts){
			var b = rng.bounds();
			if (b[0] === b[1]) { b[1] += 1; } // no characters selected; it's just an insertion point. Move to the right
			rng.bounds([b[1], b[1]]).select();
			if (opts.triggerKeyEvents === true) {
				$(rng._el).simulate('keydown', {keyCode: 39});
				$(rng._el).simulate('keyup', {keyCode: 39});
			}
		},
		
		/**
		 * Simulates hitting the left arrow button.
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @param {String} s - Ignored. 
		 * @param {Object} opts - The key-sequence options.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		'{leftarrow}': function (rng, s, opts){
			var b = rng.bounds();
			if (b[0] === b[1]) { b[0] -= 1; } // no characters selected; it's just an insertion point. Move to the left
			rng.bounds([b[0], b[0]]).select();
			if (opts.triggerKeyEvents === true) {
				$(rng._el).simulate('keydown', {keyCode: 37});
				$(rng._el).simulate('keyup', {keyCode: 37});
			}
		},
		
		/**
		 * Selects all characters in the target element.
		 * @param {Object} rng - bililiteRange object of the simulation target element.
		 * @author Daniel Wachsstock, julrich
		 * @since 1.0
		 */
		'{selectall}' : function (rng){
			rng.bounds('all').select();
		}
	};
	
	
		
	
	//####### Quirk detection #######
	// delayedSpacesInNonInputGlitchToEnd
	$(document).ready(function() {
		/* Append a div to the document (bililiteRange needs the element to be in the document), simulate
		 * a delayed sequence containing a space in the middle and check if the space moves to the end.
		 */
		var testDiv = $('<div/>').css({height: 1, width: 1, position: 'absolute', left: -1000, top: -1000}).appendTo('body');
		testDiv.simulate('key-sequence', {sequence: '\xA0 \xA0', delay:1, callback: function() {
			quirks.delayedSpacesInNonInputGlitchToEnd = (testDiv.text().indexOf(' ') > 1);
			testDiv.remove();
		}});
	});

})(jQuery);