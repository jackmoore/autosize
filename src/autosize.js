const assignedElements = new Map();

function assign(ta) {
	if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || assignedElements.has(ta)) return;

	let heightOffset = null;
	let clientWidth = null;
	let cachedHeight = null;

	function init() {
		const style = window.getComputedStyle(ta);

		if (style.resize === 'vertical') {
			ta.style.resize = 'none';
		} else if (style.resize === 'both') {
			ta.style.resize = 'horizontal';
		}

		if (style.boxSizing === 'content-box') {
			heightOffset = -(parseFloat(style.paddingTop)+parseFloat(style.paddingBottom));
		} else {
			heightOffset = parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
		}
		// Fix when a textarea is not on document body and heightOffset is Not a Number
		if (isNaN(heightOffset)) {
			heightOffset = 0;
		}

		update();
	}

	function changeOverflow(value) {
		{
			// Chrome/Safari-specific fix:
			// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
			// made available by removing the scrollbar. The following forces the necessary text reflow.
			const width = ta.style.width;
			ta.style.width = '0px';
			// Force reflow:
			/* jshint ignore:start */
			ta.offsetWidth;
			/* jshint ignore:end */
			ta.style.width = width;
		}

		ta.style.overflowY = value;
	}

	function cacheScrollTops(el) {
		const arr = [];

		while (el && el.parentNode && el.parentNode instanceof Element) {
			if (el.parentNode.scrollTop) {
				arr.push([el.parentNode, el.parentNode.scrollTop]);
			}
			el = el.parentNode;
		}

		return ()=> arr.forEach(([node, scrollTop]) => {
			node.style.scrollBehavior = 'auto';
			node.scrollTop = scrollTop;
			node.style.scrollBehavior = null;
		});
	}

	function resize() {
		if (ta.scrollHeight === 0) {
			// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
			return;
		}

		// ensure the scrollTop values of parent elements are not modified as a consequence of calculating the textarea height
		const restoreScrollTops = cacheScrollTops(ta);

		ta.style.height = ''; // this is necessary for getting an accurate scrollHeight on the next line
		ta.style.height = (ta.scrollHeight+heightOffset)+'px';

		// used to check if an update is actually necessary on window.resize
		clientWidth = ta.clientWidth;

		restoreScrollTops();
	}

	function update() {
		resize();

		const styleHeight = parseFloat(ta.style.height);
		const computed = window.getComputedStyle(ta);

		var actualHeight = parseFloat(computed.height);

		// The actual height not matching the style height (set via the resize method) indicates that
		// the max-height has been exceeded, in which case the overflow should be allowed.
		if (actualHeight < styleHeight) {
			if (computed.overflowY === 'hidden') {
				changeOverflow('scroll');
				resize();
				actualHeight = parseFloat(window.getComputedStyle(ta).height);
			}
		} else {
			// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
			if (computed.overflowY !== 'hidden') {
				changeOverflow('hidden');
				resize();
				actualHeight = parseFloat(window.getComputedStyle(ta).height);
			}
		}

		if (cachedHeight !== actualHeight) {
			cachedHeight = actualHeight;
			ta.dispatchEvent(new Event('autosize:resized', {bubbles: true}));
		}
	}

	const pageResize = () => {
		if (ta.clientWidth !== clientWidth) {
			update();
		}
	};

	const destroy = (style => {
		window.removeEventListener('resize', pageResize, false);
		ta.removeEventListener('input', update, false);
		ta.removeEventListener('keyup', update, false);
		ta.removeEventListener('autosize:destroy', destroy, false);
		ta.removeEventListener('autosize:update', update, false);

		Object.keys(style).forEach(key => {
			ta.style[key] = style[key];
		});

		assignedElements.delete(ta);
	}).bind(ta, {
		height: ta.style.height,
		resize: ta.style.resize,
		overflowY: ta.style.overflowY,
		overflowX: ta.style.overflowX,
		wordWrap: ta.style.wordWrap,
	});

	ta.addEventListener('autosize:destroy', destroy, false);

	window.addEventListener('resize', pageResize, false);
	ta.addEventListener('input', update, false);
	ta.addEventListener('autosize:update', update, false);
	ta.style.overflowX = 'hidden';
	ta.style.wordWrap = 'break-word';

	assignedElements.set(ta, {
		destroy,
		update,
	});

	init();
}

function destroy(ta) {
	const methods = assignedElements.get(ta);
	if (methods) {
		methods.destroy();
	}
}

function update(ta) {
	const methods = assignedElements.get(ta);
	if (methods) {
		methods.update();
	}
}

let autosize = null;

// Do nothing in Node.js environment
if (typeof window === 'undefined') {
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
