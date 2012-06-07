// Autosize 1.7 - jQuery plugin for textareas
// (c) 2011 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php
(function(a,b){var c="hidden",d='<textarea style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden">',e=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing"],f="oninput",g="onpropertychange",h=a(d)[0];h.setAttribute(f,"return");if(a.isFunction(h[f])||g in h){a.fn.autosize=function(b){return this.each(function(){function p(){var a,b;if(!m){m=true;j.value=h.value;j.style.overflowY=h.style.overflowY;j.style.width=i.css("width");j.scrollTop=0;j.scrollTop=9e4;a=j.scrollTop;b=c;if(a>l){a=l;b="scroll"}else if(a<k){a=k}h.style.overflowY=b;h.style.height=h.style.minHeight=h.style.maxHeight=a+o+"px";setTimeout(function(){m=false},1)}}if(a(this).data("autosize-used")==true)return;a(this).data("autosize-used",true);var h=this,i=a(h).css({overflow:c,overflowY:c,wordWrap:"break-word"}),j=a(d).addClass(b||"autosizejs")[0],k=i.height(),l=parseInt(i.css("maxHeight"),10),m,n=e.length,o=i.css("box-sizing")==="border-box"?i.outerHeight()-i.height():0;l=l&&l>0?l:9e4;while(n--){j.style[e[n]]=i.css(e[n])}a("body").append(j);if(g in h){if(f in h){h[f]=h.onkeyup=p}else{h[g]=p}}else{h[f]=p}a(window).resize(p);i.bind("autosize",p);p()})}}else{a.fn.autosize=function(){return this}}})(jQuery)