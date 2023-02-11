const assignedElements = new Map();

function assign(ta) {
	if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || assignedElements.has(ta)) return;

	let previousHeight = null;

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

	const computed = window.getComputedStyle(ta);

	function update(cachedTextAlign = null) {
		let initialOverflowY = computed.overflowY;

		if (ta.scrollHeight === 0) {
			// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
			return;
		}

		// ensure the scrollTop values of parent elements are not modified as a consequence of calculating the textarea height
		const restoreScrollTops = cacheScrollTops(ta);

		ta.style.height = ''; // this is necessary for to scrollHeight to accurately reflect situations where the textarea should shrink

		// disallow vertical resizing
		if (computed.resize === 'vertical') {
			ta.style.resize = 'none';
		} else if (computed.resize === 'both') {
			ta.style.resize = 'horizontal';
		}

		let newHeight;

		if (computed.boxSizing === 'content-box') {
			newHeight = ta.scrollHeight - (parseFloat(computed.paddingTop)+parseFloat(computed.paddingBottom));
		} else {
			newHeight = ta.scrollHeight + parseFloat(computed.borderTopWidth)+parseFloat(computed.borderBottomWidth);
		}

		if (computed.maxHeight !== 'none' && newHeight > parseFloat(computed.maxHeight)) {
			if (computed.overflowY === 'hidden') {
				ta.style.overflow = 'scroll';
			}
			newHeight = parseFloat(computed.maxHeight);
		} else if (computed.overflowY !== 'hidden') {
			ta.style.overflow = 'hidden';
		}

		ta.style.height = newHeight+'px';

		if (cachedTextAlign) {
			ta.style.textAlign = cachedTextAlign;
		}

		restoreScrollTops();

		if (previousHeight !== newHeight) {
			ta.dispatchEvent(new Event('autosize:resized', {bubbles: true}));
			previousHeight = newHeight;
		}

		if (initialOverflowY !== computed.overflow && !cachedTextAlign) {
			const textAlign = computed.textAlign;

			if (computed.overflow === 'hidden') {
				// Webkit fails to reflow text after overflow is hidden,
				// even if hiding overflow would allow text to fit more compactly.
				// The following is intended to force the necessary text reflow.
				ta.style.textAlign = textAlign === 'start' ? 'end' : 'start';
			}

			update(textAlign);
		}
	}

	const destroy = (style => {
		window.removeEventListener('resize', update, false);
		ta.removeEventListener('input', update, false);
		ta.removeEventListener('keyup', update, false);
		ta.removeEventListener('autosize:destroy', destroy, false);
		ta.removeEventListener('autosize:update', update, false);
		Object.keys(style).forEach(key => ta.style[key] = style[key]);
		assignedElements.delete(ta);
	}).bind(ta, {
		height: ta.style.height,
		resize: ta.style.resize,
		textAlign: ta.style.textAlign,
		overflowY: ta.style.overflowY,
		overflowX: ta.style.overflowX,
		wordWrap: ta.style.wordWrap,
	});

	ta.addEventListener('autosize:destroy', destroy, false);

	window.addEventListener('resize', update, false);
	ta.addEventListener('input', update, false);
	ta.addEventListener('autosize:update', update, false);
	ta.style.overflowX = 'hidden';
	ta.style.wordWrap = 'break-word';

	assignedElements.set(ta, {
		destroy,
		update,
	});

	update();
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
