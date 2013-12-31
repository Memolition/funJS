/* 
-	Functions for JavaScript(funnJS) By Memolition

-	Copyright 2013 Memolition

-	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

-	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

-	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function (window) {

	var domReadyQueue = [],
		domReady = false,
		domTotReady = function() {
			document.removeEventListener('DOMContentLoaded', domTotReady, false);
			funJS.ready();
		},
		funJS = function(selector) {
			return new funJS.fn.init(selector);
		};

	funJS.fn = funJS.prototype = {
		funJS: true,

		constructor: funJS,
		
		length: 0,

		init: function(selector, container) {
			if(!selector) return this;
			if(selector.nodeType && selector.nodeType == 9) {
				this[0] = document;
				this.length = 1;
			} else if(selector.funJS) {
				return selector;
			} else {
				if(domReady) {
					var elements = [];

					if(!document.all) {
						document.all = document.getElementsByTagName('*');
					}

					var searchInto = document.all;

					if(container) {
						searchInto = container;
					}

					if(typeof selector == "string") {
						for(var i = 0; i < document.all.length; i++) {
							if(searchInto[i] && funJS.elemToStr(searchInto[i]).indexOf(selector) >= 0) {
								elements.push(searchInto[i]);
							}
						}
					} else if(typeof selector == "object") {
						for(var i = 0; i < searchInto.length; i++) {
							if(searchInto[i] && searchInto[i] == selector) {
								elements.push(searchInto[i]);
							}
						}

						if(!elements.length) {
							for(var elem in selector) {
								if(selector[elem] && typeof selector[elem] == "object" && selector[elem].nodeType == 1) {
									for(var i = 0; i < searchInto.length; i++) {
										if(searchInto[i] && searchInto[i] == selector[elem]) {
											elements.push(searchInto[i]);
										}
									}
								}	
							}
						}
					}

					if(typeof selector == "string" && !elements.length &&
						selector.length > 3 && selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">"){	
						var docFrag = document.createDocumentFragment();
						docFrag.appendChild(document.createElement('div'));
						docFrag.firstChild.innerHTML = selector;

						return docFrag.firstChild.firstChild;
						
					}

					this.length = elements.length;
					funJS.arrayMerge(this, elements);
				}
			}
			return this;
		},

		ready: function(fn) {
			if(this.length > 0) {
				this.splice(0, this.length);
			}
			this[0] = document;
			if(typeof fn === "function") domReadyQueue.push(fn);
			if(domReady && domReadyQueue && domReadyQueue.length) {
				for(var i = 0; i < domReadyQueue.length; i++) {
					domReadyQueue[i].apply(this);
					domReadyQueue.pop(i);
				}
			} else {
				funJS.ready.wait();
			}
			return this;
		},

		get: function(num) {
			if(num && num == "*") {
				var elements = []
				for(i = 0; i < this.length; i++) {
					elements[i] = this[i];
				}
				return elements;
			} else if(!isNaN(parseInt(num))) {
				return this[num];
			} else {
				return this[0] ? this[0] : [];
			}
		},
		
		forElems: function(fn, args) {
			var changedElements = [];

			if(this.get("*").length && arguments.length) {
				if(typeof fn === "function") {
					var target = this.get("*");
					for(var i = 0; i < target.length; i++) {
						if(target[i]) {
							fn.apply(target[i], args);
							changedElements.push(target[i]);
						}
					}
				}
			}
			return changedElements;
		}
	}

	funJS.fn.init.prototype = funJS.fn;

	funJS.extend = funJS.fn.extend = function(object) {
		for (arg in object) {
			if(object[arg]) {
				this[arg] = object[arg];
			}
		}
	}

	funJS.fn.extend({
		style: function(prop, val) {
			this.forElems(function() { this.style[prop] = val; }, [prop, val]);
			return;
		},

		event: function(event, handler){
			return this.forElems(function() {
				this.addEventListener(event, handler, false);
			}, [event, handler]);
		},
		remEvent: function(event, handler) {
			return this.forElems(function() {
				this.removeEventListener(event, handler, false);
			}, [event, handler]);
		},

		getElemsFrom: function(selector, container) {
			return new funJS.fn.init(selector, container).get("*");
		},

		children: function(selector) {
			if(typeof selector == "string" && this[0]) {
				return funJS().getElemsFrom(selector, this[0].childNodes).length ? this.getElemsFrom(selector, this[0].childNodes) : false;
			}
			return this[0].childNodes;
		},
		
		prevSib: function(selector) {
			if(typeof selector == "string" && this[0]) {
				var nowSib = this[0].previousSibling ? this[0].previousSibling : false;
				if(nowSib && funJS.elemToStr(nowSib).indexOf(selector) < 0) {
					for(var i = 0; i < this[0].parentNode.childNodes.length; i++) {
						nowSib = nowSib.previousSibling ? nowSib.previousSibling : false;
						if(nowSib && funJS.elemToStr(nowSib).indexOf(selector) >= 0) {
							return nowSib;
						}
					}
				}
				
				return nowSib;
			}
			return this[0].previousSibling;
		},

		nextSib: function(selector) {
			if(typeof selector == "string" && this[0]) {
				var nowSib = this[0].nextSibling ? this[0].nextSibling : false;
				if(nowSib && funJS.elemToStr(nowSib).indexOf(selector) < 0) {
					for(var i = 0; i < this[0].parentNode.childNodes.length; i++) {
						nowSib = nowSib.nextSibling ? nowSib.nextSibling : false;
						if(nowSib && funJS.elemToStr(nowSib).indexOf(selector) >= 0) {
							return nowSib;
						}
					}
				}

				return nowSib;
			}
			return this[0].previousSibling;
		},
		
		aReq: function(url, send, method) {
			var method = method || "post",
				send = send || null;

			if(typeof url !== "string") {
				return false;
			}

			if(typeof send === "string") {
				method = send || "post",
				send = null;
			}

			if(window.XMLHttpRequest) {
				var xmlRequest = new XMLHttpRequest;
			} else {
				var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}

			var data = serializeForm(e.target),
				nowAction = e.target.action.replace(/^\s+|\s+$/g, "").split('/')[e.target.action.split('/').length - 1];
			if(nowAction == "#login") {
				xmlRequest.onreadystatechange = function() {
				if(xmlRequest.readyState == 4 && xmlRequest.status == 200) {
				}
			}
		}
	
			xmlRequest.open(method, url, true);
			xmlRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlRequest.send(send);
		},
		
		form: function() {
			return new Forms(this[0]);
		}
	});

	function Forms(form) {
		this[0] = form;
	}
	Forms.prototype = {
		serialize: function() {
			var data = '',
				nowForm = this[0];
			for(var elementsCount = 0; elementsCount < nowForm.elements.length; elementsCount++) {
				if(nowForm.elements[elementsCount].type != 'submit') {
					if(nowForm.elements[elementsCount].name.length >= 1) {
						data += '&&' + nowForm.elements[elementsCount].name + '=' + nowForm.elements[elementsCount].value;
					} else if(nowForm.elements[elementsCount].id.length >= 1) {
						data += '&&' + nowForm.elements[elementsCount].id + '=' + nowForm.elements[elementsCount].value;
					}
				}
			}
			return data.replace(/^[\s&]*|[&\s]*$/g, "");
		}
	}

	funJS.extend({
		elemToStr: function(element) {
			if(element.nodeType && element.nodeType == 9) {
				return document;
			}
			if(typeof element === "string") {
				if(funJS.trim(element).length > 3 && funJS.trim(element).charAt(0) === "<" && funJS.trim(element).charAt(funJS.trim(element).length - 1) === ">"){
					this.elem = funJS.trim(element).match(/^<[\w]+/)[0].slice(1);

					var elemMatch = (element.match(/([\w]*="[\s\w]*")/g));
					for(var matchNo in elemMatch) {
						if(typeof elemMatch[matchNo] !== "undefined") {
							switch(elemMatch[matchNo].match(/^[\w]+=/)[0]) {
								case 'id=':
									this.elem += "#" +elemMatch[matchNo].match(/"[\w]*"/)[0].replace(/^"|"$/g, '');
								break;
								case 'class=':
									if(elemMatch[matchNo].match(/"[\s\w]*"/)[0].indexOf(" ") > 0) {
										var classArray = elemMatch[matchNo].match(/"[\s\w]*"/)[0].replace(/^"|"$/g, '').split(" ");
										for(var classSing in classArray) {
											this.elem += "." + classArray[classSing];
										}
									} else {
										this.elem += "." + elemMatch[matchNo].match(/"[\s\w]*"/)[0].replace(/^"|"$/g, '');
									}
								break;
							}
						}
					}
					return this.elem;
				}
			} else if(typeof element === "object") {
				this.elem = typeof element.tagName !== "undefined" ? element.tagName.toLowerCase() : typeof element.nodeName !== "undefined" ? element.nodeName.toLowerCase() : "";
				if(typeof element.id === "string" && funJS.trim(element.id).length) {
					this.elem += "#" + element.id;
				}
				if(typeof element.className == "string" && funJS.trim(element.className).length) {
					if(element.className.indexOf(" ") > 0) {
						var classArray = element.className.split(" ");
						for(var classSing in classArray) {
							this.elem += "." + classArray[classSing];
						}
					} else {
						this.elem += "." + element.className;
					}
				}
				return this.elem;
			}
		},
		
		trim: function(string) {
			return string.replace(/^\s|\s$/g, '');
		},

		ready: function(fn) {
			domReady = true;
			funJS().ready();
		},
		
		arrayMerge: function(target, src) {
			for(var element in src) {
				target[element] = src[element]
			}
		}
	});

	funJS.ready.wait = function() {
		document.addEventListener('DOMContentLoaded', domTotReady, false);
		return false;
	}
	if ( typeof window === "object" && typeof window.document === "object" ) {
		window.funJS = funJS;
	}
})(window);
