(function( global, factory ) {
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
		factory( global, true ) :
		function( w ) {
			if ( !w.document ) {
				throw new Error( "jQuery requires a window with a document" );
			}
			return factory( w );
		};
	} else {
		factory( global );
	};
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	var jQuery = function(target) {
		return new jQuery.fn.init(target);	
	};
	window.$ = jQuery;

	jQuery.fn = jQuery.prototype = {
		constructor: jQuery,

		// 이벤트 추가
		on : function(event_name, callback) {
			let event_array = event_name.split(" ");
			event_array.forEach(item => {
				this.selector.addEventListener(item, callback);
			});
		},

		// 텍스트 변경
		text : function(text) {
			if(this.selector.length > 1) {
				this.selector.forEach(function(item) {
					item.innerHTML = text;
				});
			}else{
				if(this.selector.tagName === "INPUT" || this.selector.tagName === "TEXTAREA")
					return this.selector.value = text;

				return this.selector.innerHTML = text;
			};
		},

		// 하위 요소 찾기
		find : function(node) {
			console.log(this.selector, node, this.selector.childNodes);
			array = [];
			this.selector.childNodes.forEach(function(item, index) {
				if(index % 2 != 0) {
					if(item.nodeName == node.toUpperCase()) array.push(item);
				};
			});
			return array;
		},

		// 스타일 변경
		css: function(attribute, value) {
			
		},

		// 속성 추가/변경
		attr: function(attribute, value) {
			if(this.selector.length !== 1) {
				return this.selector.forEach(function(item) {
					item.setAttribute(attribute, value)
				});
			};

			return this.selector[0].setAttribute(attribute, value);
		},
	};
	jQuery.extend = jQuery.fn.extend = obj => {
		$[Object.keys(obj)[0]] = $.prototype[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
	};
	
	var init = jQuery.fn.init = target => {
		if(target === document) this[0] = document;
		else{
			if(target.indexOf("#") === 0) this[0] = document.querySelector(target);
			else this[0] = this.makeArray(document.querySelectorAll(target));
		};

		this.context = document;
		this.selector = target;

		return this;
	};
	init.prototype = jQuery.fn;

	jQuery.extend({
		Deferred: func => {
			deferred = {};
			then = funcs => {
				return new Promise((resolve, reject) => {
					resolve(func);
				});
			};
			deferred.done = then;
			return deferred;
		}
	});

	jQuery.extend({
		ajax: options => {
			options = options || {};
			result = {
				res:  null,
				err:  null
			};
			jqxhr = {
				done: null,
				fail: null
			};

			xhr = new XMLHttpRequest();
			xhr.onreadystatechange = _ => {
				if(this.readyState === 4) {
					if(this.status === 200) {
						options.success(xhr.response);
					}else {
						options.error(xhr.statusText);
					};
				};
			};

			xhr.open(options.type, encodeURI(options.url), true);
			xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

			if(options.type.toUpperCase() === "POST") xhr.send(options.data);
			else xhr.send();

			jqxhr.done = callback => {
				callback(result);
			};
			jqxhr.fail = err => {
				jqxhr.fail = function() {return false;};
				jqxhr.error = jqxhr.fail;

				return err;
			};

			return jqxhr;
		}
	});

	return jQuery;
}));