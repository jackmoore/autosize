function assign(ta, {setOverflowX = true, setOverflowY = true} = {}) {
	if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || ta.hasAttribute('data-autosize-on')) return;

	let heightOffset = null;
	let overflowY = 'hidden';
    var maxHeight, minHeight;
    var paddingHeight, borderHeight;

	function init() {
		const style = window.getComputedStyle(ta, null);

		maxHeight = style.maxHeight !== 'none' ? parseFloat(style.maxHeight) : null;
		minHeight = style.minHeight !== 'none' ? parseFloat(style.minHeight) : null;
		paddingHeight = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
		borderHeight = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

		if (style.resize === 'vertical') {
			ta.style.resize = 'none';
		} else if (style.resize === 'both') {
			ta.style.resize = 'horizontal';
		}

		if (style.boxSizing === 'content-box' || style.MozBoxSizing === 'content-box') {
			heightOffset = -paddingHeight;
		} else {
			heightOffset = borderHeight;
		}

		update();
	}

	function changeOverflow(value) {
		overflowY = value;

		if (setOverflowY) {
			ta.style.overflowY = value;
		}
	}

	function update() {
		const htmlTop = window.pageYOffset;
		const bodyTop = document.body.scrollTop;
		const originalHeight = ta.style.height;
        const hasPadding = ta.offsetHeight - borderHeight === ta.clientHeight;
        var scrollHeight;

		ta.style.height = 'auto';

		scrollHeight = ta.scrollHeight;

		let endHeight = scrollHeight + heightOffset;

        // Padding in old version of firefox are not taken in scrollHeight calculation.
        // this is an issue with box sizing border-box
        if (!hasPadding) {
            endHeight += paddingHeight;
        }

		if (ta.scrollHeight === 0) {
			// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
			ta.style.height = originalHeight;
			return;
		}

		if (minHeight !== null) {
			endHeight = Math.max(endHeight, minHeight);
		}

        ta.style.height = endHeight + 'px';

		// prevents scroll-position jumping
		document.documentElement.scrollTop = htmlTop;
		document.body.scrollTop = bodyTop;

        if (maxHeight !== null && maxHeight < endHeight) {
            if (overflowY !== 'visible') {
                changeOverflow('visible');
                return;
            }
        } else {
            if (overflowY !== 'hidden') {
                changeOverflow('hidden');
                return;
            }
        }

		if (originalHeight !== endHeight + 'px') {
			const evt = document.createEvent('Event');
			evt.initEvent('autosize:resized', true, false);
			ta.dispatchEvent(evt);
		}
	}

	const destroy = style => {
		window.removeEventListener('resize', update);
		ta.removeEventListener('input', update);
		ta.removeEventListener('keyup', update);
		ta.removeAttribute('data-autosize-on');
		ta.removeEventListener('autosize:destroy', destroy);

		Object.keys(style).forEach(key => {
			ta.style[key] = style[key];
		});
	}.bind(ta, {
		height: ta.style.height,
		resize: ta.style.resize,
		overflowY: ta.style.overflowY,
		overflowX: ta.style.overflowX,
		wordWrap: ta.style.wordWrap,
	});

	ta.addEventListener('autosize:destroy', destroy);

	// IE9 does not fire onpropertychange or oninput for deletions,
	// so binding to onkeyup to catch most of those events.
	// There is no way that I know of to detect something like 'cut' in IE9.
	if ('onpropertychange' in ta && 'oninput' in ta) {
		ta.addEventListener('keyup', update);
	}

	window.addEventListener('resize', update);
	ta.addEventListener('input', update);
	ta.addEventListener('autosize:update', update);
	ta.setAttribute('data-autosize-on', true);

	if (setOverflowY) {
		ta.style.overflowY = 'hidden';
	}
	if (setOverflowX) {
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';
	}

	init();
}

function destroy(ta) {
	if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
	const evt = document.createEvent('Event');
	evt.initEvent('autosize:destroy', true, false);
	ta.dispatchEvent(evt);
}

function update(ta) {
	if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
	const evt = document.createEvent('Event');
	evt.initEvent('autosize:update', true, false);
	ta.dispatchEvent(evt);
}

let autosize = null;

// Do nothing in Node.js environment and IE8 (or lower)
if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
	autosize = el => el;
	autosize.destroy = el => el;
	autosize.update = el => el;
} else {
	autosize = (el, options) => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], x => assign(x, options));
		}
		return el;
	};
	autosize.destroy = el => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], destroy);
		}
		return el;
	};
	autosize.update = el => {
		if (el) {
			Array.prototype.forEach.call(el.length ? el : [el], update);
		}
		return el;
	};
}

export default autosize;
