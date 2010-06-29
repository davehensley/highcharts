// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/** 
 * @license Name:    Highcharts
 * Version: 2.0 Prerelease, merged with data from 1.2.6 (2010-06-17)
 * Author:  Torstein Hønsi
 * Support: www.highcharts.com/support
 * License: www.highcharts.com/license
 */

// JSLint options:
/*jslint forin: true */
/*global document, window, navigator, setInterval, clearInterval, location, jQuery, $, $each, $merge, Events, Event, Fx, Request */

(function() {

// encapsulated variables
var doc = document,
	win = window,
	math = Math,
	mathRound = math.round,
	mathFloor = math.floor,
	mathMax = math.max,
	mathAbs = math.abs,
	mathCos = math.cos,
	mathSin = math.sin,	
	
	
	// some variables
	userAgent = navigator.userAgent,
	isIE = /msie/i.test(userAgent) && !win.opera,
	isWebKit = /AppleWebKit/.test(userAgent),
	hasSVG = win.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
	colorCounter,
	symbolCounter,
	symbolSizes = {},
	idCounter = 0,
	timeFactor = 1, // 1 = JavaScript time, 1000 = Unix time
	garbageBin,
	defaultOptions,
	dateFormat, // function
	
	
	// some constants for frequently used strings
	UNDEFINED,
	DIV = 'div',
	ABSOLUTE = 'absolute',
	RELATIVE = 'relative',
	HIDDEN = 'hidden',
	PREFIX = 'highcharts-',
	VISIBLE = 'visible',
	PX = 'px',
	NONE = 'none',
	M = 'M',
	L = 'L',
	TRACKER_FILL = 'rgba(192,192,192,0.005)', // invisible but clickable
	NORMAL_STATE = '',
	HOVER_STATE = 'hover',
	SELECT_STATE = 'select',
	
	// time methods, changed based on whether or not UTC is used
	makeTime,
	getMinutes,
	getHours,
	getDay,
	getDate,
	getMonth,
	getFullYear,
	setMinutes,
	setHours,
	setDate,
	setMonth,
	setFullYear,
	
	// check for a custom HighchartsAdapter defined prior to this file
	globalAdapter = win.HighchartsAdapter,
	adapter = globalAdapter || {}, 
	
	// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
	// and all the utility functions will be null. In that case they are populated by the 
	// default adapters below.
	each = adapter.each,
	grep = adapter.grep,
	map = adapter.map,
	merge = adapter.merge,
	hyphenate = adapter.hyphenate,
	addEvent = adapter.addEvent,
	removeEvent = adapter.removeEvent,
	fireEvent = adapter.fireEvent,
	animate = adapter.animate,
	getAjax = adapter.getAjax,
	
	// lookup over the types and the associated classes
	seriesTypes = {};
	
	
/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
function extend(a, b) {
	if (!a) {
		a = {};
	}
	for (var n in b) {
		a[n] = b[n];
	}
	return a;
}

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
function defined (obj) {
	return obj !== UNDEFINED && obj !== null;
}

/**
 * Set or get an attribute or an object of attributes. Can't use jQuery attr because
 * it attempts to set expando properties on the SVG element, which is not allowed.
 * 
 * @param {Object} elem The DOM element to receive the attribute(s)
 * @param {String|Object} prop The property or an abject of key-value pairs
 * @param {String} value The value if a single property is set
 */
function attr(elem, prop, value) {
	var key,
		setAttribute = 'setAttribute',
		ret;
	
	// if the prop is a string
	if (typeof prop == 'string') {
		// set the value
		if (defined(value)) {
			elem[setAttribute](prop, value);
		
		// get the value
		} else if (elem.getAttribute) {
			ret = elem.getAttribute(prop);
		}
	
	// else if prop is defined, it is a hash of key/value pairs
	} else if (defined(prop) && typeof prop == 'object') {
		for (key in prop) {
			elem[setAttribute](key, prop[key]);
		}
	}

	return ret;
}
/**
 * Check if an element is an array, and if not, make it into an array. Like
 * MooTools' $.splat.
 */
function splat(obj) {
	if (!obj || obj.constructor != Array) {
		obj = [obj];
	}
	return obj; 
}



/**
 * Return the first value that is defined. Like MooTools' $.pick.
 */
function pick() {
	var args = arguments,
		i,
		arg;
	for (i = 0; i < args.length; i++) {
		arg = args[i];
		if (defined(arg)) {
			return arg;
		}
	}
}

function serializeCSS(style) {
	var s = '', 
		key;
	// serialize the declaration
	for (key in style) {
		s += hyphenate(key) +':'+ style[key] + ';';
	}
	return s;
	
}

function css (el, styles) {
	if (isIE) {
		if (styles.opacity !== UNDEFINED) {
			styles.filter = 'alpha(opacity='+ (styles.opacity * 100) +')';
		}	
	}
	extend(el.style, styles);
}

function createElement (tag, attribs, styles, parent, nopad) {
	var el = doc.createElement(tag);
	if (attribs) {
		extend(el, attribs);
	}
	if (nopad) {
		css(el, {padding: 0, border: NONE, margin: 0});
	}
	if (styles) {
		css(el, styles);
	}
	if (parent) {
		parent.appendChild(el);
	}	
	return el;
}

// the jQuery adapter
if (!globalAdapter && win.jQuery) {
	var jQ = jQuery;
	
	
	each = function(arr, fn) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (fn.call(arr[i], arr[i], i, arr) === false) {
				return i;
			}
		}
	};
	
	grep = jQ.grep;
	
	map = function(arr, fn){
		//return jQuery.map(arr, fn);
		var results = [];
		for (var i = 0, len = arr.length; i < len; i++) {
			results[i] = fn.call(arr[i], arr[i], i, arr);
		}
		return results;
		
	};
	
	merge = function(){
		var args = arguments;
		return jQ.extend(true, null, args[0], args[1], args[2], args[3]);
	};
	
	hyphenate = function (str) {
		return str.replace(/([A-Z])/g, function(a, b){ return '-'+ b.toLowerCase(); });
	};
	
	addEvent = function (el, event, fn){
		jQ(el).bind(event, fn);
	};
	
	/**
	 * Remove event added with addEvent
	 * @param {Object} el The object
	 * @param {String} eventType The event type. Leave blank to remove all events.
	 * @param {Function} handler The function to remove
	 */
	removeEvent = function(el, eventType, handler) {
		try { // http://forum.jquery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jquery-1-4-2
			jQ(el).unbind(eventType, handler);
		} catch (e) {}
	};
	
	fireEvent = function(el, type, eventArguments, defaultFunction) {
		var event = jQ.Event(type),
			detachedType = 'detached'+ type;
		extend(event, eventArguments);
		
		// Prevent jQuery from triggering the object method that is named the
		// same as the event. For example, if the event is 'select', jQuery
		// attempts calling el.select and it goes into a loop.
		if (el[type]) {
			el[detachedType] = el[type];
			el[type] = null;	
		}
		
		// trigger it
		jQ(el).trigger(event);
		
		// attach the method
		if (el[detachedType]) {
			el[type] = el[detachedType];
			el[detachedType] = null;
		}
		
		if (defaultFunction && !event.isDefaultPrevented()) {
			defaultFunction(event);
		}	
	};

	animate = function (el, params, options) {
		jQ(el).animate(params, options);
	};
	
	getAjax = function (url, callback) {
		jQ.get(url, null, callback);
	};
	
	// extend jQuery
	jQ.extend( jQ.easing, {
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
	});
					
	// extend the animate function to allow SVG animations
	var oldStepDefault = jQuery.fx.step._default, 
		oldCur = jQuery.fx.prototype.cur;
	
	// do the step
	jQ.fx.step._default = function(fx){
		var elem = fx.elem;
		if (elem.attr) { // is SVG element wrapper					
			elem.attr(fx.prop, fx.now);			
		} else {
			oldStepDefault.apply(this, arguments);
		}
	};
	// get the current value
	jQ.fx.prototype.cur = function() {
		var elem = this.elem,
			r;
		if (elem.attr) { // is SVG element wrapper
			r = elem.attr(this.prop);
		} else {
			r = oldCur.apply(this, arguments);
		}
		return r;
	};
	
// the MooTools adapter
} else if (!globalAdapter && win.MooTools) {
	
	each = $each;
	
	map = function (arr, fn){
		return arr.map(fn);
	};
	
	grep = function(arr, fn) {
		return arr.filter(fn);
	};
	
	merge = $merge;
	
	hyphenate = function (str){
		return str.hyphenate();
	};
	
	addEvent = function (el, type, fn) {
		if (typeof type == 'string') { // chart broke due to el being string, type function
		
			if (type == 'unload') { // Moo self destructs before custom unload events
				type = 'beforeunload';
			}

			// if the addEvent method is not defined, el is a custom Highcharts object
			// like series or point
			if (!el.addEvent) {
				if (el.nodeName) {
					el = $(el); // a dynamically generated node
				} else {
					extend(el, new Events()); // a custom object
				}
			}
			
			el.addEvent(type, fn);
		}
	};
	
	removeEvent = function(el, type, fn) {
		if (type) {
			if (type == 'unload') { // Moo self destructs before custom unload events
				type = 'beforeunload';
			}


			el.removeEvent(type, fn);
		}
	};
	
	fireEvent = function(el, event, eventArguments, defaultFunction) {
		// create an event object that keeps all functions		
		event = new Event({ 
			type: event,
			target: el
		});
		event = extend (event, eventArguments);
		// override the preventDefault function to be able to use
		// this for custom events
		event.preventDefault = function() {
			defaultFunction = null;
		};
		// if fireEvent is not available on the object, there hasn't been added
		// any events to it above
		if (el.fireEvent) {
			el.fireEvent(event.type, event);
		}
		
		// fire the default if it is passed and it is not prevented above
		if (defaultFunction) {
			defaultFunction(event);
		}		
	};
	
	animate = function (el, params, options) {
		var isSVGElement = el.attr,
			myEffect;
		
		if (isSVGElement && !el.setStyle) {
			// add setStyle and getStyle methods for internal use in Moo
			el.setStyle = el.getStyle = el.attr;
			// dirty hack to trick Moo into handling el as an element wrapper
			el.$family = el.uid = true;
		}
		
		
		// define and run the effect
		myEffect = new Fx.Morph(
			isSVGElement ? el : $(el), 
			extend(options, {
				transition: Fx.Transitions.Quad.easeInOut
			})
		);
		myEffect.start(params);
	};
	
	getAjax = function (url, callback) {
		(new Request({
			url: url,
			method: 'get',
			onSuccess: callback
		})).send();			
	};
	
} 

/**
 * Dynamically add a CSS rule to the page
 * @param {String} selector
 * @param {Object} declaration
 * @param {Boolean} print Whether to add the styles only to print media. IE only.
 */
/*
function addCSSRule(selector, declaration, print) {
	
	var key,
		serialized ,
		styleSheets,
		styleSheet,
		index,
		last,
		media = print ? 'print' : '',
		createStyleTag = function(print) {
			return createElement(
				'style', { 
					type: 'text/css',
					media: print ? 'print' : ''
				}, 
				null, 
				doc.getElementsByTagName('HEAD')[0]
			);

		};
	
	// add the style tag the first time
	if (!styleTag) {
		styleTag = createStyleTag();
	}
		
	// serialize the declaration
	serialized = serializeCSS(declaration);
	
	if (!isIE) { // create a text node in the style tag
		styleTag.appendChild(
			doc.createTextNode(
				selector + " {" + serialized + "}\n"
			)
		);
	} else { // get the last stylesheet and add rules
		styleSheets = doc.styleSheets;
			
		if (print) { // only in IE for now
			createStyleTag(true);
		}
		
		index = styleSheets.length - 1;
		while (index >= 0 && styleSheets[index].media != media) {
			index--;
		} 
		
		styleSheet = styleSheets[index];
		styleSheet.addRule(selector, serialized);
	}
}
*/

/**
 * Set the time methods globally based on the useUTC option. Time method can be either 
 * local time or UTC (default).
 */
function setTimeMethods() {
	var useUTC = defaultOptions.global.useUTC;
	
	makeTime = useUTC ? Date.UTC : function(year, month, date, hours, minutes, seconds) {
		return new Date(
			year, 
			month, 
			pick(date, 1), 
			pick(hours, 0), 
			pick(minutes, 0), 
			pick(seconds, 0)
		).getTime();
	};
	getMinutes = useUTC ? 'getUTCMinutes' : 'getMinutes';
	getHours = useUTC ? 'getUTCHours' : 'getHours';
	getDay = useUTC ? 'getUTCDay' : 'getDay';
	getDate = useUTC ? 'getUTCDate' : 'getDate';
	getMonth = useUTC ? 'getUTCMonth' : 'getMonth';
	getFullYear = useUTC ? 'getUTCFullYear' : 'getFullYear';
	setMinutes = useUTC ? 'setUTCMinutes' : 'setMinutes';
	setHours = useUTC ? 'setUTCHours' : 'setHours';
	setDate = useUTC ? 'setUTCDate' : 'setDate';
	setMonth = useUTC ? 'setUTCMonth' : 'setMonth';
	setFullYear = useUTC ? 'setUTCFullYear' : 'setFullYear';
		
}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
function setOptions(options) {
	defaultOptions = merge(defaultOptions, options);
	
	// apply UTC
	setTimeMethods();
	
	return defaultOptions;
}

/**
 * Discard an element by moving it to the bin and delete
 * @param {Object} The HTML node to discard
 */
function discardElement(element) {
	// create a garbage bin element, not part of the DOM
	if (!garbageBin) {
		garbageBin = createElement(DIV);
	}
	
	// move the node and empty bin
	if (element) {
		garbageBin.appendChild(element);
	}
	garbageBin.innerHTML = '';
}

var //defaultFont = 'normal 12px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',

defaultLabelOptions = {
	enabled: true,
	// rotation: 0,
	align: 'center',
	x: 0,
	y: 15,
	/*formatter: function() {
		return this.value;
	},*/
	style: {
		color: '#666',
		//font: defaultFont.replace('12px', '11px')
		fontSize: '11px' // docs 
		//'10px bold "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'	
	}
};

defaultOptions = {
	colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', 
		'#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
				'August', 'September', 'October', 'November', 'December'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		decimalPoint: '.',
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ','
	},
	global: {
		useUTC: true
	},
	chart: {
		//alignTicks: false,
		//className: null,
		//events: { load, selection },
		margin: [50, 50, 70, 80], // docs
		borderColor: '#4572A7',
		//borderWidth: 0,
		borderRadius: 5,		
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		style: { // docs
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
			fontSize: '12px'
		},
		//backgroundColor: null,
		//plotBackgroundColor: null,
		plotBorderColor: '#C0C0C0'
		//plotBorderWidth: 0,
		//plotShadow: false,
		//zoomType: ''
	},
	title: {
		text: 'Chart title',
		x: 0,//docs
		y: 20,// docs
		align: 'center',//docs
		style: {
			color: '#3E576F',
			fontSize: '16px'
		}

	},
	subtitle: {
		text: '',
		x: 0,//docs
		y: 40,// docs
		align: 'center',//docs
		style: {
			//font: defaultFont,
			color: '#6D869F'
		}
	},
	
	plotOptions: {
		line: { // base series options
			allowPointSelect: false,
			//allowDrag: false, // point dragging - not yet implemented
			//dragType: 'y',
			showCheckbox: false,
			animation: true,
			//cursor: 'default',
			//enableMouseTracking: true,
			events: {},
			lineWidth: 2,
			shadow: true,
			// stacking: null,
			marker: { 
				enabled: true,
				//symbol: null, docs
				lineWidth: 0,
				radius: 4,
				lineColor: '#FFFFFF',
				//fillColor: null, docs
				states: { // states for a single point
					hover: {
						//radius: base + 2
					},
					select: {
						fillColor: '#FFFFFF',
						lineColor: '#000000', //docs
						lineWidth: 2
					}					
				}
			},
			point: {
				events: {}
			},
			dataLabels: merge(defaultLabelOptions, {
				enabled: false,
				y: -6,
				formatter: function() {
					return this.y;
				}
			}),
			
			//pointStart: 0,
			//pointInterval: 1,
			showInLegend: true,
			states: { // states for the entire series
				hover: {
					//enabled: false,
					lineWidth: 3,
					marker: {
						// lineWidth: base + 1,
						// radius: base + 1
					}
				},
				select: {
					marker: {}
				}
			}
		}
	},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: ABSOLUTE,
			color: '#3E576F'
		}
	},
	legend: {
		enabled: true,
		align: 'center', // docs
		layout: 'horizontal',
		labelFormatter: function() {
			return this.name;
		},
		// lineHeight: 16, // docs
		borderWidth: 1, // docs
		borderColor: '#909090',
		borderRadius: 5,
		//reversed: false, // docs
		shadow: false, // docs
		// backgroundColor: null,
		style: {
			//bottom: '10px', deprecated
			//left: '80px', deprecated
			padding: '5px'
		},
		itemStyle: {
			//listStyle: NONE, deprecated
			//margin: 0, deprecated
			// n/a in SVG padding: '0 2em 0 0', // make room for the checkbox
			//font: defaultFont,
			cursor: 'pointer',
			color: '#3E576F'
			//position: RELATIVE deprecated
		},
		itemHoverStyle: {
			color: '#000000'
		},
		itemHiddenStyle: {
			color: '#C0C0C0'
		},
		itemCheckboxStyle: {
			position: ABSOLUTE
		},
		// itemWidth: null, // docs
		symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom', // docs
		// width: null // docs
		// x: 0, // docs
		y: -15 // docs
	},
	
	loading: {
		hideDuration: 100,
		labelStyle: {
			fontWeight: 'bold',
			position: RELATIVE,
			top: '1em'
		},
		showDuration: 100,
		style: {
			position: ABSOLUTE,
			backgroundColor: 'white',
			opacity: 0.5,
			textAlign: 'center'
		}
	},
	
	tooltip: {
		enabled: true,
		formatter: function() {
			var pThis = this,
				series = pThis.series,
				xAxis = series.xAxis,
				x = pThis.x;
			return '<b>'+ (pThis.point.name || series.name) +'</b><br/>'+
				(defined(x) ? 
					'X value: '+ (xAxis && xAxis.options.type == 'datetime' ? 
						dateFormat(null, x) : x) +'<br/>':
					'')+
				'Y value: '+ pThis.y;
		},
		backgroundColor: 'rgba(255, 255, 255, .85)',
		borderWidth: 2,
		borderRadius: 5,
		shadow: true,
		snap: 10,
		style: {
			color: '#333333',
			//font: defaultFont,
			fontSize: '12px',
			padding: '5px',
			whiteSpace: 'nowrap'
		}
	},
	
	toolbar: {
		itemStyle: {
			color: '#4572A7',
			//font: defaultFont,
			cursor: 'pointer'
		}
	},
	
	credits: {
		enabled: true,
		text: 'Highcharts.com',
		href: 'http://www.highcharts.com',
		style: {
			cursor: 'pointer',
			color: '#909090',
			fontSize: '10px'
		},
		target: '_self'
	}
};

// Axis defaults
//defaultOptions.xAxis = merge(defaultOptions.axis);
var defaultXAxisOptions =  {
	// allowDecimals: null, // docs
	// alternateGridColor: null,
	// categories: [],
	dateTimeLabelFormats: {
		second: '%H:%M:%S',
		minute: '%H:%M',
		hour: '%H:%M',
		day: '%e. %b',
		week: '%e. %b',
		month: '%b \'%y',
		year: '%Y'
	},
	endOnTick: false,
	gridLineColor: '#C0C0C0',
	// gridLineWidth: 0,
	// reversed: false,
	
	labels: defaultLabelOptions,
	lineColor: '#C0D0E0',
	lineWidth: 1,
	max: null,
	min: null,
	minPadding: 0.01, // docs
	maxPadding: 0.01, // docs
	maxZoom: null,
	minorGridLineColor: '#E0E0E0',
	minorGridLineWidth: 1,
	minorTickColor: '#A0A0A0',
	//minorTickInterval: null,
	minorTickLength: 2,
	minorTickPosition: 'outside', // inside or outside
	minorTickWidth: 1,
	//plotBands: [],
	//plotLines: [],
	//reversed: false,
	showFirstLabel: true,
	showLastLabel: false,
	startOfWeek: 1, 
	startOnTick: false,
	tickColor: '#C0D0E0',
	//tickInterval: null, docs
	tickLength: 5,
	tickmarkPlacement: 'between', // on or between
	tickPixelInterval: 100,
	tickPosition: 'outside',
	tickWidth: 1,
	title: {
		enabled: false,
		text: 'X-values',
		align: 'middle', // low, middle or high
		margin: 35,
		//rotation: 0,
		//side: 'outside',
		style: {
			color: '#6D869F',
			//font: defaultFont.replace('normal', 'bold')
			fontWeight: 'bold'
		}
	},
	type: 'linear' // linear or datetime
},

defaultYAxisOptions = merge(defaultXAxisOptions, {
	endOnTick: true,
	gridLineWidth: 1,
	tickPixelInterval: 72,
	showLastLabel: true,
	labels: {
		align: 'right',
		x: -8,
		y: 3
	},
	lineWidth: 0,
	maxPadding: 0.05,
	minPadding: 0.05,
	startOnTick: true,
	tickWidth: 0,
	title: {
		enabled: true,
		margin: 40,
		rotation: 270,
		text: 'Y-values'
	}
}),

defaultLeftAxisOptions = {
	labels: {
		align: 'right',
		x: -8,
		y: 3
	},
	title: {
		rotation: 270
	}
},
defaultRightAxisOptions = {
	labels: {
		align: 'left',
		x: 8,
		y: 3
	},
	title: {
		rotation: 90
	}
},
defaultBottomAxisOptions = { // horizontal axis
	labels: {
		align: 'center',
		x: 0,
		y: 14
	},
	title: {
		rotation: 0
	}
},
defaultTopAxisOptions = merge(defaultBottomAxisOptions, {
	labels: {
		y: -5
	}
});


 

// Series defaults
var defaultPlotOptions = defaultOptions.plotOptions, 
	defaultSeriesOptions = defaultPlotOptions.line; 
//defaultPlotOptions.line = merge(defaultSeriesOptions);
defaultPlotOptions.spline = merge(defaultSeriesOptions);
defaultPlotOptions.scatter = merge(defaultSeriesOptions, {
	//dragType: 'xy', // n/a
	lineWidth: 0,
	states: {
		hover: {
			lineWidth: 0
		}
	}
});
defaultPlotOptions.area = merge(defaultSeriesOptions, {
	// baseValue: 0,
	// lineColor: null, // overrides color, but lets fillColor be unaltered
	// fillOpacity: .75,
	//fillColor: null docs

});
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);
defaultPlotOptions.column = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
	borderRadius: 0,
	//colorByPoint: undefined, docs
	groupPadding: 0.2,
	marker: null, // point options are specified in the base options
	pointPadding: 0.1,
	//pointWidth: null,
	minPointLength: 0, 
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		},
		select: {
			color: '#C0C0C0',
			borderColor: '#000000',
			shadow: false
		}
	}
});
defaultPlotOptions.bar = merge(defaultPlotOptions.column, {
	dataLabels: {
		align: 'left',
		x: 5,
		y: 0
	}
});
defaultPlotOptions.pie = merge(defaultSeriesOptions, {
	//dragType: '', // n/a
	borderColor: '#FFFFFF',
	borderWidth: 1,
	center: ['50%', '50%'],
	colorByPoint: true,
	legendType: 'point',
	marker: null, // point options are specified in the base options
	size: '90%',
	slicedOffset: 10,
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		}
	}
	
});

// set the default time methods
setTimeMethods();


/**
 * Extend a prototyped class by new members
 * @param {Object} parent
 * @param {Object} members
 */
function extendClass(parent, members) {
	var object = function(){};
	object.prototype = new parent();
	extend(object.prototype, members);
	return object;
}


/*
function reverseArray(arr) {
	var reversed = [];
	for (var i = arr.length - 1; i >= 0; i--)
		reversed.push( arr[i]);
	return reversed;
}
*/
// return a deep value without throwing an error
/*function deepStructure(obj, path) {
	// split the path into an array
	path = path.split('.'), i = 0;
	// recursively set obj to the path
	while (path[i] && obj) obj = obj[path[i++]];
	
	if (i == path.length) return obj;
}*/

/* *
 * Create a color from a string or configuration object
 * @param {Object} val
 */
/*function setColor(val, ctx) {
	if (typeof val == 'string') {
		return val;

	} else if (val.linearGradient) {
		var gradient = ctx.createLinearGradient.apply(ctx, val.linearGradient);
		each (val.stops, function(stop) {
			gradient.addColorStop(stop[0], stop[1]);
		});
		return gradient;
	}
}*/

/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
var Color = function(input) {
	// declare variables
	var rgba = [], result;
	
	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	function init(input) {
		
		// rgba
		if((result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(input))) {
			rgba = [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10), parseFloat(result[4], 10)];
		}

		// hex
		else if((result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(input))) {
			rgba = [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16), 1];
		}
	
	}
	/**
	 * Return the color a specified format
	 * @param {String} format
	 */
	function get(format) {
		var ret;
		
		// it's NaN if gradient colors on a column chart
		if (rgba && !isNaN(rgba[0])) {
			if (format == 'rgb') {
				ret = 'rgb('+ rgba[0] +','+ rgba[1] +','+ rgba[2] +')';
			} else if (format == 'a') {
				ret = rgba[3];
			} else {
				ret = 'rgba('+ rgba.join(',') +')';
			}
		} else {
			ret = input;
		}
		return ret;
	}
	
	/**
	 * Brighten the color
	 * @param {Object} alpha
	 */
	function brighten(alpha) {
		if (typeof alpha == 'number' && alpha !== 0) {
			for (var i = 0; i < 3; i++) {
				rgba[i] += parseInt(alpha * 255, 10);
				if (rgba[i] < 0) {
					rgba[i] = 0;
				}
				if (rgba[i] > 255) {
					rgba[i] = 255;
				}
			}
		}
		return this;
	}
	/**
	 * Set the color's opacity to a given alpha value
	 * @param {Number} alpha
	 */
	function setOpacity(alpha) {
		rgba[3] = alpha;
		return this;
	}	
	
	// initialize: parse the input
	init(input);
	
	// public methods
	return {
		get: get,
		brighten: brighten,
		setOpacity: setOpacity
	};
};

	//defaultMarkers = ['circle'];


/**
 * Format a number and return a string based on input settings
 * @param {Number} number The input number to format
 * @param {Number} decimals The amount of decimals
 * @param {String} decPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
function numberFormat (number, decimals, decPoint, thousandsSep) {
	var lang = defaultOptions.lang,
		// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
		n = number, c = isNaN(decimals = mathAbs(decimals)) ? 2 : decimals,
		d = decPoint === undefined ? lang.decimalPoint : decPoint,
		t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep, s = n < 0 ? "-" : "",
		i = parseInt(n = mathAbs(+n || 0).toFixed(c), 10) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
		(c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
}

/**
 * Based on http://www.php.net/manual/en/function.strftime.php 
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
	function pad (number) {
		return number.toString().replace(/^([0-9])$/, '0$1');
	}
	
	if (!defined(timestamp) || isNaN(timestamp)) {
		return 'Invalid date';
	}
	format = pick(format, '%Y-%m-%d %H:%M:%S');
	
	var date = new Date(timestamp * timeFactor),
	
		// get the basic time values
		hours = date[getHours](),
		day = date[getDay](),
		dayOfMonth = date[getDate](),
		month = date[getMonth](),
		fullYear = date[getFullYear](),
		lang = defaultOptions.lang,
		langWeekdays = lang.weekdays,
		langMonths = lang.months,
		
		// list all format keys
		replacements = {

			// Day
			'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
			'A': langWeekdays[day], // Long weekday, like 'Monday'
			'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31 
			'e': dayOfMonth, // Day of the month, 1 through 31 
			
			// Week (none implemented)
			
			// Month
			'b': langMonths[month].substr(0, 3), // Short month, like 'Jan'
			'B': langMonths[month], // Long month, like 'January'
			'm': pad(month + 1), // Two digit month number, 01 through 12
			
			// Year
			'y': fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
			'Y': fullYear, // Four digits year, like 2009
			
			// Time
			'H': pad(hours), // Two digits hours in 24h format, 00 through 23
			'I': pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
			'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
			'M': pad(date[getMinutes]()), // Two digits minutes, 00 through 59
			'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
			'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
			'S': pad(date.getSeconds()) // Two digits seconds, 00 through  59
			
		};


	// do the replaces
	for (var key in replacements) {
		format = format.replace('%'+ key, replacements[key]);
	}
		
	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};



/**
 * Loop up the node tree and add offsetWidth and offsetHeight to get the
 * total page offset for a given element
 * @param {Object} el
 */
function getPosition (el)	{
	var p = { x: el.offsetLeft, y: el.offsetTop };
	while (el.offsetParent)	{
		el = el.offsetParent;
		p.x += el.offsetLeft;
		p.y += el.offsetTop;
		if (el != doc.body && el != doc.documentElement) {
			p.x -= el.scrollLeft;
			p.y -= el.scrollTop;
		}
	}
	return p;
}


/**
 * A wrapper object for SVG elements 
 */
function SVGElement () {}

SVGElement.prototype = {
	init: function(renderer, nodeName) {
		//var wrapperId = PREFIX + idCounter++;
		this.element = doc.createElementNS('http://www.w3.org/2000/svg', nodeName);
		//this.element.id = wrapperId;
		
		//renderer.wrapperLookup[wrapperId] = this;
		
		this.renderer = renderer;
		
			//renderer = this,
			//svg = renderer.svg,
			//firstChild = svg.firstChild;
	
	},
	animate: function(params, duration) {
		animate(this, params, duration);
	},
	attr: function(hash, val) {
		var key, 
			value, 
			i, 
			child,
			element = this.element,
			nodeName = element.nodeName,
			renderer = this.renderer,
			skipAttr,
			shadows = this.shadows,
			hasSetSymbolSize,
			ret = this;
			
		// single key-value pair
		if (typeof hash == 'string' && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}
		
		// used as a getter: first argument is a string, second is undefined
		if (typeof hash == 'string') {
			key = hash;
			if (nodeName == 'circle') {
				key = { x: 'cx', y: 'cy' }[key] || key;
			}
			ret = parseFloat(attr(element, key) || this[key] || 0);
			
		// setter
		} else {
		
			for (key in hash) {
				value = hash[key];
				
				// paths
				if (key == 'd') {
					if (typeof value != 'string') { // join path
						value = value.join(' ');
					}
					
				// update child tspans x values
				} else if (key == 'x' && nodeName == 'text') { 
					for (i = 0; i < element.childNodes.length; i++ ) {
						child = element.childNodes[i];
						// if the x values are equal, the tspan represents a linebreak
						if (attr(child, 'x') == attr(element, 'x')) {
							//child.setAttribute('x', value);
							attr(child, 'x', value);
						}
					}
					
				// apply gradients
				} else if (key == 'fill') {
					value = renderer.color(value, element, key);
				
				// circle x and y
				} else if (nodeName == 'circle') {
					key = { x: 'cx', y: 'cy' }[key] || key;
					
				// translation
				} else if (key == 'translateX' || key == 'translateY') {
					this[key] = value;
					this.updateTransform();
					skipAttr = true;
	
				// apply opacity in WebKit
				} else if (isWebKit && key == 'stroke') {
					value = renderer.color(value, element, key);
					 
				
				// special
				} else if (key == 'isTracker') {
					this[key] = value;
				}
				
				// Chrome/Win < 6 bug (http://code.google.com/p/chromium/issues/detail?id=15461)				
				if (isWebKit && key == 'stroke-width' && value === 0) {
					value = 0.000001;
				}
				
				// symbols
				if (this.symbolName && /^(x|y|r|start|end)/.test(key)) {
					// if one of the symbol size affecting parameters are changed,
					// check all the others only once for each call to an element's
					// .attr() method
					
					if (!hasSetSymbolSize) {
							
						var x = hash.x || this.x,
							y = hash.y || this.y,
							r = hash.r || this.r,
							start = hash.start || this.start,
							end = hash.end || this.end;
					
								
						this.attr({ 
							d: renderer.symbols[this.symbolName](x, y, r, {
								start: start, 
								end: end
							})
						});
						
					
						hasSetSymbolSize = true;
					}
				}
				
				// let the shadow follow the main element
				if (shadows && /^(width|height|visibility|x|y|d)$/.test(key)) {
					i = shadows.length;
					while (i--) {
						attr(shadows[i], key, value);
					}
					
				}
				
					
				
				if (key == 'text') {
					// only one node allowed
					renderer.buildText(element, value);
				} else if (!skipAttr) {
					//element.setAttribute(key, value);
					attr(element, key, value);
				}
			}
			
		}
		return ret;
	},
	
	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function(clipRect) {
		return this.attr('clip-path', 'url(#'+ clipRect.id +')');
	},
	
	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function(styles) {
		var elemWrapper = this;
		
		// convert legacy
		if (styles) {
			styles.fill = styles.fill || styles.color;
		}
		
		// save the styles in an object
		styles = extend(
			elemWrapper.styles,
			styles
		);
		
		// serialize and set style attribute
		elemWrapper.attr({
			style: serializeCSS(styles)
		});
		
		// store object
		elemWrapper.styles = styles;
		
		return elemWrapper;
	},
	
	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function(eventType, handler) {
		// simplest possible event model for internal use
		this.element['on'+ eventType] = handler;
		return this;
	},
	
	
	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function(x, y) {
		var wrapper = this;
		wrapper.translateX = x;
		wrapper.translateY = y;
		wrapper.updateTransform();
		return wrapper;
	},
	
	/**
	 * Rotate a group around its own axis
	 * @param {Number} rotation The rotation in degrees clockwise
	 */
	rotate: function(rotation) {
		var wrapper = this;
		wrapper.rotation = rotation;
		wrapper.updateTransform();
		return wrapper;
	},
	
	/**
	 * Flip a group around its own axis
	 * 
	 * @param {String} type Type of flip, currently only x is supported
	 */
	flip: function(type) {
		var wrapper = this;
		wrapper.flipX = /x/.test(type);
		wrapper.updateTransform();
		return wrapper;
	},
	/**
	 * Private method to update the transform attribute based on internal 
	 * properties
	 */
	updateTransform: function() {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			rotation = wrapper.rotation || 0,
			flipX = wrapper.flipX,
			transform = [];
			
		// flipping affects translate as adjustment for flipping around the group's axis
		if (flipX) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}
			
		// apply translate
		if (translateX || translateY) {
			transform.push('translate('+ translateX +','+ translateY +')');
		}
		
		// apply rotation
		if (rotation) {
			transform.push('rotate('+ rotation +')');
		}
		
		// apply flip
		if (flipX) {
			transform.push('scale(-1,1)');
		}
		
		if (transform.length) {
			attr(wrapper.element, 'transform', transform.join(' '));
		}
	},
	toFront: function() {
		var element = this.element;
		element.parentNode.appendChild(element);
		return this;
	},
	getBBox: function() {
		var element = this.element;
		if (element.getBBox) { 
			return element.getBBox(); 
		} else {// IE9 preview
			return {
				x: 100,
				y: 100,
				width: 100,
				height: 30
			};
		}
			
	},
	show: function() {
		return this.attr({ visibility: VISIBLE });
	},
	hide: function() {
		return this.attr({ visibility: HIDDEN });
	},
	// add the node at a specified z index
	add: function(parentNode, zIndex) {
		
		
		parentNode = parentNode ? parentNode.element : this.renderer.box;
			
		var //parentNode = element.parentNode,
			childNodes = parentNode.childNodes,
			element = this.element,
			otherElement,
			i;

		// insert according to this and other elements' zIndex
		element.zIndex = zIndex;
		for (i = 0; i < childNodes.length; i++) {
			otherElement = childNodes[i];
			if (otherElement != element && (
					// insert before the first element with a higher zIndex
					otherElement.zIndex > zIndex || 
					// if no zIndex given, insert before the first element with at zIndex
					(!defined(zIndex) && otherElement.zIndex)  
					
					)) {
				parentNode.insertBefore(element, otherElement);
				return this;
			}
		}
		// default: append at the end
		parentNode.appendChild(element);
		return this;
	},
	
	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function() {
		var element = this.element,
			//wrappers = this.renderer.wrappers,
			//i,
			key;
		
		function clearEvents(elem) {
			elem.onclick = elem.onmouseout = elem.onmouseover = elem.onmousemove = null;
		}
		
		clearEvents(element);
		element.parentNode.removeChild(element);
		
		if (this.shadows) {
			each(this.shadows, function(shadow) {
				clearEvents(shadow);
				shadow.parentNode.removeChild(shadow);				
			});
		}
				
		for (key in this) {
			delete this[key];
		}
		
		/*i = wrappers.length;
		while (i--) {
			if (wrappers[i] == this) {
				wrappers.splice(i, 1);
			}
		}*/
		
		return null;
	},
	/**
	 * Empty a group element
	 */
	empty: function() {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length;
			
		while (i--) {
			element.removeChild(childNodes[i]);
		}
	},
	shadow: function(apply) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			
			// compensate for flipped plot area
			parentTransform = attr(element.parentNode, 'transform'),
			transform = parentTransform && parentTransform.indexOf('rotate(90) scale(-1, 1)') > -1 ?
				'(-1,-1)' : '(1,1)';
			
		
		if (apply) {
			//obj.shadows = [];
			for (i = 1; i <= 3; i++) {
				/*this.drawRect(x + 1, y + 1, w, h, 'rgba(0, 0, 0, '+ (0.05 * i) +')', 
					6 - 2 * i, radius);*/
					
				shadow = element.cloneNode(0);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': 'rgb(0, 0, 0)',
					'stroke-opacity': 0.05 * i,
					'stroke-width': 7 - 2 * i,
					'transform': 'translate'+ transform,
					'fill': NONE
				});
				
				
				element.parentNode.insertBefore(shadow, element);
				
				shadows.push(shadow);
			}
			
			this.shadows = shadows;
		}
		return this;
	
	}
};



/**
 * The default SVG renderer
 */
var SVGRenderer = function() {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function(container, width, height) {
		var box = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
		attr(box, {
			width: width,
			height: height,
			xmlns: 'http://www.w3.org/2000/svg',
			version: '1.1'
		});
		container.appendChild(box);
		
			
		// object properties
		//this.wrappers = [];
		this.box = box;
		this.defs = this.createElement('defs').add();
		
	},
	
	
	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function(nodeName) {
		var wrapper = new SVGElement();
		wrapper.init(this, nodeName);
		//this.wrappers.push(wrapper);
		return wrapper;
	},
	
	/*destroy: function() {
		var wrappers = this.wrappers,
			i = wrappers.length,
			key;
			
		while (i--) {
			wrappers[i].destroy();
		}
		
		for (key in this) {
			delete this[key];
		}
	},*/
	
	// parse a simple HTML string into SVG tspans
	// todo: more general HTML parsing
	buildText: function(textNode, str) {
		var lines = str.toString().
				replace(/<(b|strong)>/g, '<span style="font-weight:bold">').
				replace(/<(i|em)>/g, '<span style="font-style:italic">').
				replace(/<\/(b|strong|i|em)>/g, '</span>').
				split('<br/>'),
			childNodes = textNode.childNodes,
			styleRegex = /style="([0-9a-z:;\-]+)"/,
			parentX = attr(textNode, 'x'),
			i;
			
			
		// remove old text
		for (i = childNodes.length - 1; i >= 0; i--) {
			textNode.removeChild(childNodes[i]);
		}
		
		// single line
		/*if (lines.length == 1) {
			textNode.appendChild(doc.createTextNode(str));
			
		// multi lines or spans
		} else {*/
		
		each (lines, function(line, lineNo) {
			var spans, spanNo = 0;
			
			line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
			spans = line.split('|||');
			
			each (spans, function (span) {
				if (span !== '') {
					var attributes = {},
						tspan = doc.createElementNS('http://www.w3.org/2000/svg', 'tspan');
					/*if (/^<b>(.*?)<\/b>$/.test(line)) {
						//tspan.setAttribute('style', 'font-weight:bold');
						attr(tspan, 'style', 'font-weight:bold');
						line = line.replace(/^<b>(.*?)<\/b>$/, '$1');
					}*/
					if (styleRegex.test(span)) {
						attr(tspan, 'style', span.match(styleRegex)[1]);
					}
					
					span = span.replace(/<(.|\n)*?>/g, '');
					tspan.appendChild(doc.createTextNode(span));
					if (!spanNo) { // first span in a line, align it to the left
						attributes.x = parentX;
					} else {
						attributes.dx = 3; // space
					}
					if (lineNo) { // subsequent line, add the line height
						attributes.dy = 16;
					}
					
					attr(tspan, attributes);
					
					textNode.appendChild(tspan);
					
					spanNo++;
				}
			});
			
		});
		
		
		//}
	},
	
	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width
	 * 
	 * @todo shape-rendering: crispEdges can do the same for SVG, but what about VML?
	 *       If VML doesn't have shape-rendering it might be better to keep this method for both.
	 */
	crispLine: function(points, width) {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] == points[4]) {
			points[1] = points[4] = mathRound(points[1]) + (width % 2 / 2);
		}
		if (points[2] == points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
	},
	path: function (path) {
		return this.createElement('path').attr({ 
			d: path, 
			fill: NONE
		});
	},
	circle: function (x, y, r) {
		var attr = typeof x == 'object' ?
			x :
			{
				x: x,
				y: y,
				r: r
			};
		
		return this.createElement('circle').attr(attr);
	},
	arc: function (x, y, r, start, end) {
		// arcs are defined as symbols for the ability to set 
		// attributes in attr and animate
		
		if (typeof x == 'object') {
			y = x.y;
			r = x.r;
			start = x.start;
			end = x.end;
			x = x.x;
		}
		
		return this.symbol('arc', x || 0, y || 0, r || 0, {
			start: start || 0,
			end: end || 0
		});
		/*return this.path([
				M,
				centerX, 
				centerY, 
				L,
				centerX + radius * mathCos(start),
				centerY + radius * mathSin(start),
				'A', // arcTo
				radius, // x radius
				radius, // y radius
				0, // slanting
				end - start < Math.PI ? 0 : 1, // long or short arc
				1, // clockwise
				centerX + radius * mathCos(end),
				centerY + radius * mathSin(end),
				'z' // close
			]);*/
	},
	rect: function (x, y, width, height, r, strokeWidth) {
		
		/*var normalizer = (strokeWidth || 0) % 2 / 2;

		// normalize for crisp edges
		x = mathRound(x || 0) + normalizer;
		y = mathRound(y || 0) + normalizer;
		width = mathRound((width || 0) - 2 * normalizer);
		height = mathRound((height || 0) - 2 * normalizer);*/
		
		var attr = typeof x == 'object' ? 
			x : // the attributes can be passed as the first argument
			{
				x: x,
				y: y,
				width: mathMax(width, 0),
				height: mathMax(height, 0)
			};			
		
		return this.createElement('rect').attr(extend(attr, {
			rx: r || attr.r,
			ry: r || attr.r,
			fill: NONE
		}));
	},
	/*text: function (x, y, text) {
		return this.createElement('text').attr({
				x: x,
				y: y,
				text: text
			});
	},*/
	g: function(name) {
		/*var obj = this.element('g');
		return obj;*/
		var attribs = defined(name) ?
			{ 'class': PREFIX + name } :
			{};
			
		return this.createElement('g').attr(attribs);
	},
	
	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function(src, x, y, width, height) {
		var elemWrapper = this.createElement('image').attr({
			x: x,
			y: y,
			width: width,
			height: height,
			preserveAspectRatio: NONE
		});		
		
		// set the href in the xlink namespace
		elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink', 
			'href', src);
			
		return elemWrapper;					
	},
	
	/**
	 * Draw a symbol out of pre-defined shape paths from the namespace 'symbol' object.
	 * 
	 * @param {Object} symbol
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} radius
	 * @param {Object} options
	 */
	symbol: function(symbol, x, y, radius, options) {
		
		var obj,
			
			// get the symbol definition function
			symbolFn = this.symbols[symbol],
			
			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				x, 
				y, 
				radius, 
				options
			),
			
			imageRegex = /^url\((.*?)\)$/,
			imageSrc;
			
		
		if (path) {
			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				r: radius
			});
			if (options) {
				extend(obj, options);
			}
			
			
		// image symbols
		} else if (imageRegex.test(symbol)) {
			imageSrc = symbol.match(imageRegex)[1];
			
			
			// create the image
			//obj = this.createElement('image').attr({
			obj = this.image(imageSrc).attr({
				visibility: HIDDEN
			});
			
			// create a dummy JavaScript image to get the width and height  
			createElement('img', {
				onload: function() {
					var img = this,
						size = symbolSizes[img.src] || [img.width, img.height];
					obj.attr({
						x: mathRound(x - size[0] / 2) + PX,
						y: mathRound(y - size[1] / 2) + PX,
						width: size[0],
						height: size[1],
						visibility: 'inherit'
					});
				},
				src: imageSrc
			});
				
		// default circles
		} else {
			obj = this.circle (x, y, radius);
		}
		
		return obj;
	},
	
	/**
	 * An extendable collection of functions for defining symbol paths.
	 * 
	 * @todo: Use size instead of radius? Radius makes sense only for circles.
	 */
	symbols: {
		'square': function (x, y, radius) {
			var len = 0.707 * radius;
			return [
				M, x-len, y-len,
				L, x+len, y-len,
				x+len, y+len,
				x-len, y+len,
				'Z'
			];
		},
			
		'triangle': function (x, y, radius) {
			return [
				M, x, y-1.33 * radius,
				L, x+radius, y + 0.67 * radius,
				x-radius, y + 0.67 * radius,
				'Z'
			];
		},
			
		'triangle-down': function (x, y, radius) {
			return [
				M, x, y + 1.33 * radius,
				L, x-radius, y-0.67 * radius,
				x+radius, y-0.67 * radius,
				'Z'
			];
		},
		'diamond': function (x, y, radius) {
			return [
				M, x, y-radius,
				L, x+radius, y,
				x, y+radius,
				x-radius, y,
				'Z'
			];
		},
		'arc': function (x, y, radius, options) {
			var start = options.start,
				end = options.end;
			return [
				M,
				x, 
				y, 
				L,
				x + radius * mathCos(start),
				y + radius * mathSin(start),
				'A', // arcTo
				radius, // x radius
				radius, // y radius
				0, // slanting
				end - start < Math.PI ? 0 : 1, // long or short arc
				1, // clockwise
				x + radius * mathCos(end),
				y + radius * mathSin(end),
				'Z' // close
			];
		}
	},
	
	/**
	 * Define a clipping rectangle
	 * @param {String} id
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {
		var wrapper,
			id = PREFIX + idCounter++,
			
			clipPath = this.createElement('clipPath').attr({
				id: id
			}).add(this.defs);
		
		wrapper = this.rect(x, y, width, height, 0).add(clipPath);
		wrapper.id = id;
		
		return wrapper;
	},
	
	
	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object
	 * 
	 * @param {Object} color The color or config object
	 */
	color: function(color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/;
		if (color && color.linearGradient) {
			var renderer = this,
				//element = renderer.element,
				strLinearGradient = 'linearGradient',
				linearGradient = color[strLinearGradient],
				id = PREFIX + idCounter++,
				gradientObject,
				stopColor,
				stopOpacity;
			/*var gradient = ctx.createLinearGradient.apply(ctx, val.linearGradient);
			each (val.stops, function(stop) {
				gradient.addColorStop(stop[0], stop[1]);
			});
			return gradient;*/
			gradientObject = renderer.createElement(strLinearGradient).attr({
				id: id,
				gradientUnits: 'userSpaceOnUse',
				x1: linearGradient[0],
				y1: linearGradient[1],
				x2: linearGradient[2],
				y2: linearGradient[3]
			}).add(renderer.defs);
			
			each(color.stops, function(stop) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}
				renderer.createElement('stop').attr({
					offset: stop[0],
					'stop-color': stopColor,
					'stop-opacity': stopOpacity
				}).add(gradientObject);
			});
			
			return 'url(#'+ id +')';
			
		// Safari (4), Chrome (5) and Batik can't show rgba.
		} else if (regexRgba.test(color)) {
			colorObject = Color(color);
			attr(elem, prop +'-opacity', colorObject.get('a'));
			
			return colorObject.get('rgb');
			
			
		} else {
			return color;
		}
		
	},
	
		
	// rotated and aligned text
	text: function(str, x, y, style, rotation, align) {
		//if (str || str === 0) {
		style = style || {};
		align = align || 'left';
		rotation = rotation || 0;
		
		// declare variables
		var attribs,
			css, 
			fill = style.color || '#000000',
			defaultChartStyle = defaultOptions.chart.style;
	
		x = mathRound(pick(x, 0));
		y = mathRound(pick(y, 0));
		
		extend(style, {
			fontFamily: style.fontFamily || defaultChartStyle.fontFamily,
			fontSize: style.fontSize || defaultChartStyle.fontSize
		});
		
		// prepare style
		css = serializeCSS(style);
		
		// prepare attributes
		attribs = {
				x: x,
				y: y,
				text: str,
				fill: fill,
				style: css.replace(/"/g, "'")
				
			};
			
		if (rotation || align != 'left') {
			attribs = extend(attribs, {
				'text-anchor': { left: 'start', center: 'middle', right: 'end' }[align],
				transform: 'rotate('+ rotation +' '+ x +' '+ y +')'

			});
		}

		
		return this.createElement('text').attr(attribs);
		//}
	}
}; // end SVGRenderer




/* **************************************************************************** 
 *                                                                            * 
 * START OF INTERNET EXPLORER < 8 SPECIFIC CODE                               *
 *                                                                            *
 * For applications and websites that don't need IE support, like platform    *
 * targeted mobile apps and web apps, this code can be removed.               *
 *                                                                            *
 *****************************************************************************/
var VMLRenderer;
if (!hasSVG) {


/**
 * The VML element wrapper.
 */
var VMLElement = extendClass( SVGElement, {
	init: function(renderer, nodeName) {
		
		// one to one tag names
		nodeName = {
			circle: 'v:oval',
			rect: 'v:roundrect',
			path: 'v:shape'
		}[nodeName] || nodeName;
		
		// prepare style
		var style = {
			position: ABSOLUTE
		};
		if (nodeName == 'v:shape') {
			style = extend(style, {
				left: 0,
				top: 0,
				width: 10,
				height: 10
			});
		}
		
		
		// create element with default attributes and style
		if (nodeName) {
			this.element = createElement(nodeName, {
				filled: false,
				stroked: false
			}, style);
		}
		
		
		
		this.renderer = renderer;
	},
	
	// add the node at a specified z index
	add: function(parent, zIndex) {
		var wrapper = this,
			renderer = wrapper.renderer,
			element = wrapper.element,
		
			// get the parent node
			parentNode = parent ? 
				parent.element || parent : 
				renderer.box;
			
			// VML elements are added to the v:group element so they can be rotated.
			// The exception is line (always text paths), that won't display inside
			// a group
			if (parent && parent.groupElement && element.tagUrn == renderer.urn &&
					element.tagName != 'line') {
				parentNode = parent.groupElement;
			}
			
		// set the zIndex
		if (defined(zIndex)) {
			css(element, { zIndex: zIndex });
		}
		
		//var start = (new Date()).getTime();
		
		parentNode.appendChild(element);
		
		
		// If adding a HTML element within a group, add a dummy rectangle in the top left of the group
		// to make the positioning work right. Without this the HTML element's 
		// position is relative to the top left shape within the group, not the 
		// group itself.
		/*if (/SPAN|IMG/.test(element.nodeName) && parentNode.nodeName == 'group') {
			if (!parent.positioner) {
				parent.positioner = this.renderer.rect(0, 0, 1, 1, 0).
					css({ visibility: HIDDEN }).add(parent);
			}
		}*/	
		
		//var end = (new Date()).getTime() - start;
		//console.log(end, ", ", element.tagName, ", ", parentNode.tagName);
		
		return wrapper;
	},
	
	attr: function(hash, val) {
		var key, 
			value, 
			i, 
			element = this.element,
			elemStyle = element.style,
			nodeName = element.nodeName,
			renderer = this.renderer,
			parentNode = element.parentNode,
			hasSetSymbolSize,
			shadows = this.shadows,
			skipAttr,
			ret = this;
			
		// single key-value pair
		if (typeof hash == 'string' && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}
		
		// used as a getter, val is undefined
		if (typeof hash == 'string') {
			key = hash;
			if (key == 'translateX' || key == 'translateY') {
				ret = this[key] || 0;
			} else if (key == 'stroke-width') {
				ret = element.strokeweight;
				
			} else {
				ret = parseInt(elemStyle[{ 
					x: 'left', 
					y: 'top'
				}[key] || key], 10);
			}
			
			
			
		// setter
		} else {		
			for (key in hash) {
				value = hash[key];
				
				// prepare paths
				if (key == 'd') {
					
					key = 'path';
					
					// convert paths 
					//value = map(value, function(item) {
					i = value.length;
					while (i--) {
						
						
						// Multiply by 10 to allow subpixel precision.
						// Substracting half a pixel seems to make the coordinates
						// align with SVG, but this hasn't been tested thoroughly
						if (typeof value[i] == 'number') {
							value[i] = mathRound(value[i] * 10) - 5;
						}
						// close the path
						else if (value[i] == 'Z') {
							value[i] = 'x';
						}
						
					}
					value = value.join(' ');
					
					// update shadows
					if (shadows) {
						i = shadows.length;
						while (i--) {
							shadows[i].path = value;
						}
					}
	
				
				// width and height
				} else if (/^(width|height)$/.test(key)) {
					
					// VML bug: selection fill color becomes white when zero width or height
					if (value === 0 && element.className == PREFIX +'selection-marker') {
						value = 1;
					}
					
					// normal
					elemStyle[key] = value;
										
					// Update corner radius - IE throws an error if the element is in the 
					// DOM tree during this operation. To increase performance, only do this
					// if the arcsize changes. For tooltips, this usually means the arsize only
					// changes the first time it is displayed, as the height of the tooltip
					// will stay constant.
					if (nodeName == 'roundrect' && defined(this.r)) {
						var arcsize = this.r / math.min(parseInt(elemStyle.width, 10), parseInt(elemStyle.height, 10));
						
						if (arcsize != this.arcsize) {
							parentNode.removeChild(element);
							attr(element, 'arcsize', arcsize);
							parentNode.appendChild(element);
							this.arcsize = arcsize;
						}
					}
					
					// clipping rectangle special
					if (this.updateClipping) {
						this.updateClipping();
					}
					
					skipAttr = true;
					
				// x and y 
				} else if (/^(x|y)$/.test(key) && !this.symbolName) {

					if (key == 'y' && element.tagName == 'SPAN' && element.lineHeight) { // subtract lineHeight
						value -= element.lineHeight;
					}
					
					elemStyle[{ x: 'left', y: 'top' }[key]] = value;
					
				// class name
				} else if (key == 'class') {
					// IE8 Standards mode has problems retrieving the className
					element.className = value;
			
				// stroke
				} else if (key == 'stroke') {
					
					value = renderer.color(value, element, key);				
						
					// in some cases only the subelement will do
					if (parentNode && attr(parentNode, 'class') == PREFIX +'tooltip') {
						(
							element.getElementsByTagName(key)[0] ||
							createElement('v:'+ key, null, null, element)
						).color = value;						
						// IE8 compat bug: after the above operation, the tooltip border sometimes
						// is set to 1px
						
						skipAttr = true;
					
					// other times, just set the attribute
					} else {
						key = 'strokecolor';
					}
					
				// stroke width
				} else if (key == 'stroke-width') {
	
					element.stroked = value ? true : false;
					key = 'strokeweight';
					if (typeof value == 'number') {
						value += PX;
					}
					
				// fill
				} else if (key == 'fill') {
					
					if (nodeName == 'SPAN') { // text color
						elemStyle.color = value;
					} else {
						element.filled = value != NONE ? true : false;
						
						value = renderer.color(value, element, key);
						
						key = 'fillcolor';
					}
					
				// circle radius
				/*} else if (key == 'r' && nodeName == 'oval') {
					css(element, {
						left: element.cx - value,
						top: element.cy - value,
						width: 2 * value,
						height: 2 * value
					});
					skipAttr = true;*/
				
				// radius for symbols
				/*} else if (key == 'r' && element.symbolName) {
					this.attr({ 
						
						d: resymbols[element.symbolName](
							element.x, 
							element.y, 
							value
						)
					});*/
				
				// visibility
				} else if (key == 'visibility') {
					elemStyle[key] = value;
					skipAttr = true;
				}
				
				// translation for animation
				else if (key == 'translateX' || key == 'translateY') {
					this[key] = val;
					this.updateTransform();
					skipAttr = true;
				}
				
				// symbols
				if (this.symbolName && /^(x|y|r|start|end)/.test(key)) {
					// if one of the symbol size affecting parameters are changed,
					// check all the others only once for each call to an element's
					// .attr() method
					
					if (!hasSetSymbolSize) {
							
						this.x = pick(hash.x, this.x);
						this.y = pick(hash.y, this.y);
						this.r = pick(hash.r, this.r);
						this.start = pick(hash.start, this.start);
						this.end = pick(hash.end, this.end);
					
						this.attr({ 
							d: renderer.symbols[this.symbolName](this.x, this.y, this.r, {
								start: this.start, 
								end: this.end
							})
						});
						
					
						hasSetSymbolSize = true;
					}
				}
				
				// symbols
				/*if (element.symbolName && /^(x|y|r)/.test(key)) {
					
					var x = key == 'x' ? value : element.x,
						y = key == 'y' ? value : element.y,
						r = key == 'r' ? value : element.r;
						
					console.log(symbols[element.symbolName](x, y, r, { isVML: true }));
						
					this.attr({ 
						d: symbols[element.symbolName](x, y, r, { isVML: true })
					});
				}*/
				
					
				// let the shadow follow the main element
				if (shadows && /^(width|height|visibility|x|y)/.test(key)) {
					i = shadows.length;
					while (i--) {
						var style = {};
						style[{ x: 'left', y: 'top' }[key] || key] = value;
						css(shadows[i], style);
					}
				}
				
				
				
					
				if (key == 'text') {
					// only one node allowed
					//renderer.buildText(element, value);
					element.innerHTML = value;
				} else if (!skipAttr) {
					if (doc.documentMode == 8) { // IE8 setAttribute bug
						element[key] = value;
					} else {
						attr(element, key, value);
					}
				}
				
				
			}
			
			//if (parentNode) parentNode.appendChild(element);
			
			// todo: move this from attr to initiation and check for memory leak
			//element.graphicObject = this; // memory: circular reference
			//return this;
		}
		return ret;
	},
	
	/**
	 * Set the element's clipping to a predefined rectangle
	 * 
	 * @param {String} id The id of the clip rectangle
	 */
	clip: function(clipRect) {
		var wrapper = this,
			clipMembers = clipRect.members,
			index = clipMembers.length;
			
		clipMembers.push(wrapper);
		wrapper.destroyClip = function() {
			clipMembers.splice(index, 1);
		};
		return wrapper.css({ clip: clipRect.getCSS(wrapper.flipX) });
	},
	
	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function(styles) {
		var wrapper = this;
		
		css(wrapper.element, styles);
		
		return wrapper;
	},
	
	/**
	 * Extend element.destroy by removing it from the clip members array
	 */
	destroy: function() {
		var wrapper = this,
			groupElement = wrapper.groupElement; 
		
		if (wrapper.destroyClip) {
			wrapper.destroyClip();
		}
		if (groupElement) {
			groupElement.parentNode.removeChild(groupElement);
		}
		
		SVGElement.prototype.destroy.apply(this);
	},
	
	/**
	 * Remove all child nodes of a group, except the v:group element
	 */
	empty: function() {
		var element = this.element,
			groupElement = this.groupElement,
			i,
			node;
			
		each ([element.childNodes, groupElement.childNodes], function(childNodes) { 
			i = childNodes.length;
			while (i--) {
				node = childNodes[i];
				if (node != groupElement) {
					node.parentNode.removeChild(node);
				}
			}
		});
	},
	
	/**
	 * Calculate the bounding box based on offsets
	 * 
	 * @return {Object} A hash containing values for x, y, width and height
	 */
	
	getBBox: function() {
		var element = this.element,
			ret,
			hasOffsetWidth = element.offsetWidth,
			origParentNode = element.parentNode;
		
		if (!hasOffsetWidth) {
			doc.body.appendChild(element);
		} 
		ret = {
			x: element.offsetLeft,
			y: element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight
		}; 
		
		if (!hasOffsetWidth) {
			if (origParentNode) {
				origParentNode.appendChild(element);
			} else {
				doc.body.removeChild(element);
			}
		}

		return ret;
			
	},
	
	/**
	 * Add an event listener. VML override for normalizing event parameters.
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function(eventType, handler) {
		// simplest possible event model for internal use
		this.element['on'+ eventType] = function() {
			var evt = win.event;
			evt.target = evt.srcElement;
			handler(evt);
		};
		return this;
	},
	
	
	/**
	 * Private method to update elements based on internal 
	 * properties based on SVG transform
	 */
	updateTransform: function() {
		var wrapper = this,
			groupElement = wrapper.groupElement,
			element = wrapper.element,
			elemStyle = element.style,
			width = parseInt(elemStyle.width, 10),
			height = parseInt(elemStyle.height, 10),
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			rotation = wrapper.rotation || 0,
			flipX = wrapper.flipX;
			
		// apply flip
		if (flipX) {
			// flip affects other properties
			rotation *= -1;
		
			css(groupElement, { 
				flip: 'x', 
				left: -1000 + width, // adjusted to flip and rotate around its own axis
				top: -1000 + height
			});
		}
		
		// apply translate
		if (translateX || translateY) {
			css(element, {
				left: translateX,
				top: translateY
			});			
		}
		
		// apply rotation
		if (rotation) {
			css(groupElement, { rotation: rotation });
		}
	},
	
	/**
	 * Apply a drop shadow by copying elements and giving them different strokes 
	 * @param {Boolean} apply
	 */
	shadow: function(apply) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			elemStyle = element.style;
			
		if (apply) {
			for (i = 1; i <= 3; i++) {
					
				// clone the main element
				shadow = element.cloneNode(1);
				attr(shadow, {
					isShadow: 'true',
					strokecolor: 'black',
					strokeweight: 7 - 2 * i,
					filled: false
				});
				css(shadow, {
					left: parseInt(elemStyle.left, 10) + 1,
					top: parseInt(elemStyle.top, 10) + 1
				});
				
				// apply the opacity
				createElement('v:stroke', {
					opacity: 0.05 * i
				}, null, shadow);
				
				// some properties are not correctly cloned
				if (shadow.tagName == 'shape') {
					shadow.path = element.path;
					shadow.coordsize = element.coordsize;
				} else if (shadow.tagName == 'roundrect') {
					shadow.arcsize = this.arcsize;
				}
				
				// insert it
				element.parentNode.insertBefore(shadow, element);
				
				// record it
				shadows.push(shadow);				
				
			}
			
			this.shadows = shadows;
		}
		return this;
	
	}
});
	
/**
 * The VML renderer
 */
VMLRenderer = function() {
	this.init.apply(this, arguments);
};
VMLRenderer.prototype = merge( SVGRenderer.prototype, { // inherit SVGRenderer
	/**
	 * Initialize the VMLRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function(container, width, height) {
		
		// generate the containing box
		var box = createElement(DIV, null, {
				width: width + PX,
				height: height + PX
			}, container);
		
		// renderer properties
		//this.wrappers = [];
		this.box = box;
		this.urn = 'urn:schemas-microsoft-com:vml';
		
		// create namespace and style behaviour
		if (!doc.namespaces.v) {
			// better performance but mouse tracking fails:
			//doc.namespaces.add('v_dummy', 'urn:schemas-microsoft-com:vml', '#default#VML');
			
			doc.namespaces.add('v', this.urn);
			
			// setup default css
			doc.createStyleSheet().cssText = 
				'v\\:group, v\\:oval, v\\:path, v\\:rect, v\\:roundrect, v\\:shape, '+
				'v\\:line, v\\:fill, v\\:stroke, v\\:textpath '+
				'{ behavior:url(#default#VML); display:inline-block } ';
			/*if (!doc.styleSheets['hc']) {
		        var ss = doc.createStyleSheet();
		        ss.owningElement.id = 'hc';
		        ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
		            // default size is 300x150 in Gecko and Opera
		            'text-align:left;width:300px;height:150px}' +
		            'v\\:*{behavior:url(#default#VML)}' +
		            'o\\:*{behavior:url(#default#VML)}';
		
		    }*/
		}
		


	},
	

	
	/**
	 * Define a clipping rectangle. In VML it is accomplished by storing the values
	 * for setting the CSS style to all associated members.
	 * 
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {
				
		// create a dummy element
		var clipRect = this.createElement();
		
		// mimic a rectangle with its style object for automatic updating in attr
		return extend(clipRect, {
			members: [],
			element: {
				style: {
					left: x,
					top: y,
					width: width,
					height: height
				}
			},
			getCSS: function(inverted) {
				var elemStyle = clipRect.element.style,
					top = elemStyle.top,
					left = elemStyle.left,
					right = left + elemStyle.width,
					bottom = top + elemStyle.height;
				return 'rect('+ 
					(inverted ? left : top) + 'px,'+ 
					(inverted ? bottom : right) + 'px,'+ 
					(inverted ? right : bottom) + 'px,'+ 
					(inverted ? top : left) +'px)';
			},
			
			// used in attr and animation to update the clipping of all members
			updateClipping: function() {
				each (clipRect.members, function(member) {
					member.css({ clip: clipRect.getCSS(member.flipX) });
				});
			}
		});
		
	},
	
	/**
	 * Create a wrapper for an VML element
	 * @param {String} nodeName
	 * 
	 * @todo: make elementtype a renderer property and use the same method as SVG?
	 */
	createElement: function(nodeName) {
		var wrapper = new VMLElement();
		wrapper.init(this, nodeName);
		//this.wrappers.push(wrapper);
		return wrapper;
	},
	
	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object, and apply opacity.
	 * 
	 * VML gradient shortcomings:
	 * - only the first stop's opacity will be rendered
	 * 
	 * @param {Object} color The color or config object
	 */
	color: function(color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/,
			subNode;
			
		if (color && color.linearGradient) {
			
			var stopColor, 
				stopOpacity,
				linearGradient = color.linearGradient,
				angle;
			
			
			subNode = elem.getElementsByTagName(prop)[0] ||
				createElement('v:'+ prop, null, null, elem);
				
			each(color.stops, function(stop, i) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}
				
				if (!i) { // first
					subNode.color = stopColor;
					subNode.opacity = stopOpacity;
				} else {
					subNode.color2 = stopColor;
					subNode['o:opacity2'] = stopOpacity; // VML bug
				}
			});
			
			// calculate the angle based on the linear vector
			angle = 90  - math.atan(
				(linearGradient[3] - linearGradient[1]) / // y vector
				(linearGradient[2] - linearGradient[0]) // x vector
				) * 180 / math.PI;
			
			
			extend(subNode, {
				type: 'gradient',
				angle: angle,
				focus: '100%'
			});
		
		// if the color is an rgba color, split it and add a fill node
		// to hold the opacity component
		} else if (regexRgba.test(color)) {
			
			colorObject = Color(color);
			
			subNode = elem.getElementsByTagName(prop)[0] ||
				createElement('v:'+prop, null, null, elem);
				
			subNode.opacity = colorObject.get('a');
			
			return colorObject.get('rgb');
			
			
		} else {
			return color;
		}
		
	},
	// rotated and aligned text
	text: function(str, x, y, style, rotation, align) {
		//if (str || str === 0) {
		style = style || {};
		align = align || 'left';
		rotation = rotation || 0;
		
		// declare variables
		var elemWrapper, 
			elem, 
			spanWidth,
			lineHeight = mathRound(parseInt(style.fontSize || 12, 10) * 1.2),
			defaultChartStyle = defaultOptions.chart.style; 
	
		x = mathRound(x);
		y = mathRound(y);
		
		// set styles
		extend(style, {
			color: style.color || '#000000',
			//margin: 0, // margins are deprecated from 2.0
			whiteSpace: 'nowrap',
			// get font metrics for correct sizing
			fontFamily: style.fontFamily || defaultChartStyle.fontFamily,
			fontSize: style.fontSize || defaultChartStyle.fontSize
		});
			
		// create a simple span for the non-rotated text
		if (!rotation) { 
			elemWrapper = this.createElement('span').attr({
				x: x,
				y: y - lineHeight,
				text: str
			});
			elem = elemWrapper.element;
			elem.lineHeight = lineHeight; // used in attr
			
			css(elem, style);
			
			
			// fix the position according to align
			if (align != 'left') {	
				spanWidth = elemWrapper.getBBox().width;
			
				css(elem, {
					left: (x - spanWidth / { right: 1, center: 2 }[align]) + PX
				});				
			}
		
		
		// to achieve rotated text, the ie text is drawn on a vector line that
		// is extrapolated to the left or right or both depending on the 
		// alignment of the text
		} else {
			var radians = (rotation || 0) * math.PI * 2 / 360, // deg to rad
				costheta = mathCos(radians),
				sintheta = mathSin(radians),
				length = 10, // the text is not likely to be longer than this
				baselineCorrection = lineHeight * 0.3,
				left = align == 'left',
				right = align == 'right',
				x1 = left ?     x : x - length * costheta,
				x2 = right ?    x : x + length * costheta,
				y1 = left ?     y : y - length * sintheta,
				y2 = right ?    y : y + length * sintheta;
				
				
			// IE seems to always draw the text with v-text-align middle, so we need 
			// to correct for that by moving the path
			x1 += baselineCorrection * sintheta;
			x2 += baselineCorrection * sintheta;
			y1 -= baselineCorrection * costheta;
			y2 -= baselineCorrection * costheta;
			
			// strange painting bug.
			// todo: is this still valid in 2.0?
			if (mathAbs(x1 - x2) < 0.1) {
				x1 += 0.1;
			}
			if (mathAbs(y1 - y2) < 0.1) {
				y1 += 0.1;
			}
			
			elemWrapper = this.createElement('v:line').attr({
				from: x1 +', '+ y1,
				to: x2 +', '+ y2
			});
			elem = elemWrapper.element;
			
			createElement('v:fill', {
				on: true,
				color: style.color
			}, null, elem);
			
			createElement('v:path', {
				textpathok: true
			}, null, elem);
			
			
			// for reasons unknown, the style must be set on init
			createElement(
				'<v:textpath style="v-text-align:'+ align +';'+ serializeCSS(style) +
				'" on="true" string="'+ str +'">',
			null, null, elem);
			
		}
		
		return elemWrapper;
	},
	
	/*buildText: function(textNode, str) {
	},*/
	
	path: function (path) {
		// create the shape
		return this.createElement('v:shape').attr({
				// subpixel precision down to 0.1 (width and height = 10px)
				coordsize: '100,100',
				d: path
			});
		
		//wrapper.pathElem = createElement('v:path', null, null, wrapper.element);
		
		//wrapper.attr({ d: path });
		
		
		//return wrapper;
	},
	
	circle: function(x, y, r) {
		return this.path(this.symbols.circle(x, y, r));
	},
	
	/**
	 * Create a group using an outer div and an inner v:group to allow rotating 
	 * and flipping. A simple v:group would have problems with positioning
	 * child HTML elements and CSS clip.
	 * 
	 * @param {String} name The name of the group
	 */
	g: function(name) {
		var wrapper,
			attribs;
		
		// set the class name	
		if (name) {
			attribs = { 'className': PREFIX + name, 'class': PREFIX + name };
		}
			
		// the div to hold HTML and clipping	
		wrapper = this.createElement(DIV).attr(attribs);
		
		// the v:group to hold other VML items
		wrapper.groupElement = createElement('v:group', attribs, {
			position: ABSOLUTE,
			left: 0,
			top: 0,
			width: 1000,
			height: 1000
		}, wrapper.element);
			
		
		return wrapper;
	},
	
	/**
	 * VML override to create a regular HTML image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function(src, x, y, width, height) {
		return this.createElement('img')
			.attr({ src: src })
			.css({
				left: x,
				top: y,
				width: width,
				height: height
			});
	},
	
	/**
	 * VML override of rect to set the arcsize
	 */
	rect: function(x, y, width, height, r) {
		var obj = SVGRenderer.prototype.rect.apply(this, arguments);
		
		obj.r = r; // used in attr
		obj.arcsize = r / (math.min(width, height));
		
		// todo: do this in attr
		attr(obj.element, 'arcsize', obj.arcsize);
		
		return obj;
	},
	

	
	/**
	 * Draw a symbol of a predefined type. Overrides the SVG method only when 
	 * drawing image symbols.
	 * 
	 * @param {String} symbol
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 */
	symbol: function(symbol, x, y, radius) {
		var wrapper,
			imageRegex = /^url\((.*?)\)$/;
		
		// image symbols
		if (imageRegex.test(symbol)) {
		
			wrapper = this.createElement('img').attr({
				onload: function() {
					var img = this,
						size = [img.width, img.height];
					css(img, {
						left: mathRound(x - size[0] / 2),
						top: mathRound(y - size[1] / 2)
					});
				},
				src: symbol.match(imageRegex)[1]
			});
		} else {
			wrapper = SVGRenderer.prototype.symbol.apply(this, arguments);
		}

		return wrapper;
	},
	
	/**
	 * Symbol definitions that override the parent SVG renderer's symbols
	 * 
	 */
	symbols: {
		// VML specific arc function
		arc: function (x, y, r, options) {
			var start = options.start,
				end = options.end;
			return [
				M,
				x,
				y,
				'wa', // clockwisearcto
				x - r, // left
				y - r, // top
				x + r, // right
				y + r, // bottom
				x + r * mathCos(start), // start x
				y + r * mathSin(start), // start y
				x + r * mathCos(end), // end x
				y + r * mathSin(end), // end y
				//'x', // finish path
				'e' // close
			];
			
		},
		// Add circle symbol path. This performs significantly faster than v:oval.
		circle: function (x, y, r) {
			return [
				'wa', // clockwisearcto
				x - r, // left
				y - r, // top
				x + r, // right
				y + r, // bottom
				x + r * 1, // start x
				y + r * 0, // start y
				x + r * 1, // end x
				y + r * 0, // end y
				//'x', // finish path
				'e' // close
			];
		}
	}
});



}
/* **************************************************************************** 
 *                                                                            * 
 * END OF INTERNET EXPLORER < 8 SPECIFIC CODE                                 *
 *                                                                            *
 *****************************************************************************/

/**
 * General renderer
 */
var Renderer = hasSVG ?	SVGRenderer : VMLRenderer;
	

/**
 * The chart class
 * @param {Object} options
 */
function Chart (options) {
	
	defaultXAxisOptions = merge(defaultXAxisOptions, defaultOptions.xAxis);
	defaultYAxisOptions = merge(defaultYAxisOptions, defaultOptions.yAxis);
	defaultOptions.xAxis = defaultOptions.yAxis = null;
		
	// Handle regular options
	options = merge(defaultOptions, options);
	
	// Define chart variables
	var optionsChart = options.chart,
		optionsMargin = optionsChart.margin,
		margin = typeof optionsMargin == 'number' ? 
			[optionsMargin, optionsMargin, optionsMargin, optionsMargin] :
			optionsMargin,
		plotTop = pick(optionsChart.marginTop, margin[0]), // docs: marginLeft, marginTop etc
		marginRight = pick(optionsChart.marginRight, margin[1]),
		marginBottom = pick(optionsChart.marginBottom, margin[2]),
		plotLeft = pick(optionsChart.marginLeft, margin[3]),
		renderTo,
		renderToClone,
		container,
		containerId,
		chartWidth,
		chartHeight,
		chart = this,
		//container = doc.getElementById(optionsChart.renderTo),
		//container,
		chartEvents = optionsChart.events,
		eventType,
		getAlignment, // function
		isInsidePlot, // function
		//imagemap,
		tooltip,
		mouseIsDown,
		//backgroundLayer = new Layer('chart-background', container),
		//chartHeight, 
		//chartWidth,
		loadingLayer,
		//plotLayer,
		plotHeight,
		plotWidth,
		plotSizeX, // width if normal, height if inverted
		plotSizeY, // height if normal, width if inverted
		//ctx, 
		tracker,
		trackerGroup,
		//trackerRect,
		legend,
		//xAxis, 
		//yAxis,
		position,// = getPosition(container),
		hasCartesianSeries = optionsChart.showAxes,
		axes = [],
		maxTicks, // handle the greatest amount of ticks on grouped axes
		series = [], 
		//resourcesLoaded, 
		//plotBackground,
		inverted,
		renderer,
		tooltipTick,
		tooltipInterval,
		//tooltipDiv,
		zoom, // function
		zoomOut; // function
		

	/**
	 * Create a new axis object
	 * @param {Object} chart
	 * @param {Object} options
	 */
	function Axis (chart, options) {

		// Define variables
		var isXAxis = options.isX,
			opposite = options.opposite, // needed in setOptions			
			horiz = inverted ? !isXAxis : isXAxis,
			stacks = {
				bar: {},
				column: {},
				area: {},
				areaspline: {},
				line: {}
			};
	
		options = merge(
				isXAxis ? defaultXAxisOptions : defaultYAxisOptions,
				//defaultOptions[isXAxis ? 'xAxis' : 'yAxis'],
				horiz ? 
					(opposite ? defaultTopAxisOptions : defaultBottomAxisOptions) :
					(opposite ? defaultRightAxisOptions : defaultLeftAxisOptions),
				options
			);
	
		var axis = this,
			isDatetimeAxis = options.type == 'datetime',
			offset = options.offset || 0,
			xOrY = isXAxis ? 'x' : 'y',
			axisLength = horiz ? plotWidth : plotHeight,
		
			transA, // translation factor
			transB = horiz ? plotLeft : marginBottom, // translation addend
			axisGroup,
			gridGroup,
			/*axisLayer = new Layer('axis-layer', container, null, { zIndex: 7}), / * The
				axis layer is in front of the series because the axis line must hide
				graphs and bars. Grid lines are drawn on the grid layer. * /
			gridLayer = new Layer('grid-layer', container, null, { zIndex: 1 }), */
			dataMin,
			dataMax,
			associatedSeries,
			userSetMin,
			userSetMax,
			max = null,
			min = null,
			minPadding = options.minPadding,
			maxPadding = options.maxPadding,
			ignoreMinPadding, // can be set to true by a column or bar series
			ignoreMaxPadding,
			usePercentage,
			events = options.events,
			eventType,
			plotBands = options.plotBands || [],
			plotLines = options.plotLines || [],
			tickInterval,
			minorTickInterval,
			magnitude,
			tickPositions, // array containing predefined positions
			//tickRecord = {},
			tickAmount,
			//zoom = 1,
			//var axisLabelsLayer = new Layer((horiz ? 'x' : 'y') +'-axis-labels');
			labelFormatter = options.labels.formatter, // can be overwritten by dynamic format
			// column plots are always categorized
			categories = options.categories || (isXAxis && chart.columnCount), 
			reversed = options.reversed,
			tickmarkOffset = (categories && options.tickmarkPlacement == 'between') ? 0.5 : 0;		

		/**
		 * Get the minimum and maximum for the series of each axis 
		 */
		function getSeriesExtremes() {
			var stack = [],
				run;
				
			// reset dataMin and dataMax in case we're redrawing
			dataMin = dataMax = null;
			
			// get an overview of what series are associated with this axis
			associatedSeries = [];
			
			each(series, function(serie) {
				run = false;
				
				
				// match this axis against the series' given or implicated axis
				each(['xAxis', 'yAxis'], function(strAxis) {
					if (
						// we're in the right x or y dimension, and...
						(strAxis == 'xAxis' && isXAxis || strAxis == 'yAxis' && !isXAxis) && (
							// the axis number is given in the options and matches this axis index, or
							(serie.options[strAxis] == options.index) || 
							// the axis index is not given
							(serie.options[strAxis] === UNDEFINED && options.index === 0)
						)
					) {
						serie[strAxis] = axis;
						associatedSeries.push(serie);
						
						// the series is visible, run the min/max detection
						run = true;		
					}
				});
				// ignore hidden series if opted 
				if (!serie.visible && optionsChart.ignoreHiddenSeries) {
					run = false;
				}				
				
				if (run) {
					
					var stacking,
						typeStack;
		
					if (!isXAxis) {
						stacking = serie.options.stacking;
						usePercentage = stacking == 'percent';
	
						// create a stack for this particular series type
						if (stacking) {
							typeStack = stack[serie.type] || [];
							stack[serie.type] = typeStack;
						}
						if (usePercentage) {
							dataMin = 0;
							dataMax = 99;			
						}
					} 
					if (serie.isCartesian) { // line, column etc. need axes, pie doesn't
						each(serie.data, function(point, i) {
							var pointX = point.x,
								pointY = point.y;
							
							// initial values
							if (dataMin === null) {

								// start out with the first point
								dataMin = dataMax = point[xOrY]; 
							}
		
							// x axis
							if (isXAxis) {
								if (pointX > dataMax) {
									dataMax = pointX;
								} else if (pointX < dataMin) {
									dataMin = pointX;
								}
							}
							
							// y axis
							else if (defined(pointY)) {
								if (stacking) {
									typeStack[pointX] = typeStack[pointX] ? typeStack[pointX] + pointY : pointY;
								}
								
								var stackedPoint = typeStack ? typeStack[pointX] : pointY;
								if (!usePercentage) {
									if (stackedPoint > dataMax) {
										dataMax = stackedPoint;
									} else if (stackedPoint < dataMin) {
										dataMin = stackedPoint;
									}
								}
								if (stacking) {
									stacks[serie.type][pointX] = { 
										total: stackedPoint,
										cum: stackedPoint 
									};
								}
							}
						});
						
							
						// For column, areas and bars, set the minimum automatically to zero
						// and prevent that minPadding is added in setScale
						if (/(area|column|bar)/.test(serie.type) && !isXAxis) {
							if (dataMin >= 0) {
								dataMin = 0;
								ignoreMinPadding = true;
							} else if (dataMax < 0) {
								dataMax = 0;
								ignoreMaxPadding = true;
							}
						}
					}
				}
			});
			
		}
	
		/**
		 * Translate from axis value to pixel position on the chart, or back
		 * 
		 */
		function translate(val, backwards, cvsCoord) {
			var sign = 1,
				cvsOffset = 0,
				returnValue;
			if (cvsCoord) {
				sign *= -1; // canvas coordinates inverts the value
				cvsOffset = axisLength;
			}
			if (reversed) { // reversed axis
				sign *= -1; 
				cvsOffset -= sign * axisLength;
			}
			
			if (backwards) { // reverse translation
				if (reversed) {
					val = axisLength - val;
				}
				returnValue = val / transA + min; // from chart pixel to value				
			
			} else { // normal translation
				returnValue = sign * (val - min) * transA + cvsOffset; // from value to chart pixel
			}
			
			return returnValue;
		}
		
		/**
		 * Add a single line across the plot
		 */
		function drawPlotLine(value, color, width) {
			
			if (width) {
				var x1, 
					y1, 
					x2, 
					y2,
					translatedValue = translate(value),
					skip;
					
				x1 = x2 = translatedValue + transB;
				y1 = y2 = chartHeight - translatedValue - transB;
				if (horiz) { 
					y1 = plotTop;
					y2 = chartHeight - marginBottom;
					if (x1 < plotLeft || x1 > plotLeft + plotWidth) {
						skip = true;
					}
				} else {
					x1 = plotLeft;
					x2 = chartWidth - marginRight;
					if (y1 < plotTop || y1 > plotTop + plotHeight) {
						skip = true;
					}
				}
				
				if (!skip) {
					renderer.path(
						renderer.crispLine([M, x1, y1, L, x2, y2], width)
					).attr({
							stroke: color,
							'stroke-width': width
						}).add(gridGroup);
				}
				
			}
		}
		
		/**
		 * Add a masked band across the plot
		 * @param {Number} from chart axis value
		 * @param {Number} to chart axis value
		 * @param {String} color
		 */
		function drawPlotBand(from, to, color) {
			// keep within plot area
			from = mathMax(from, min);
			to = Math.min(to, max);  
			
			var width = (to - from) * transA;
			drawPlotLine(from + (to - from) / 2, color, width);
			
		}
		
		/**
		 * Add a tick mark an a label
		 */
		function addTick(pos, tickPos, color, width, len, withLabel, index) {
			var x1, y1, x2, y2, str, labelOptions = options.labels;
				//record = tickRecord[pos] || {};
			
			// negate the length
			if (tickPos == 'inside') {
				len = -len;
			}
			if (opposite) {
				len = -len;
			}
			
			// set the initial positions
			x1 = x2 = translate(pos + tickmarkOffset) + transB;
			y1 = y2 = chartHeight - translate(pos + tickmarkOffset) - transB;
			
			if (horiz) {
				y1 = chartHeight - marginBottom - (opposite ? plotHeight : 0) + offset;
				y2 = y1 + len;
			} else {
				x1 = plotLeft + (opposite ? plotWidth : 0) + offset;
				x2 = x1 - len;				
			}
			
			if (width) {
				renderer.path(
					renderer.crispLine([M, x1, y1, L, x2, y2], width)
				).attr({
					stroke: color,
					'stroke-width': width
				}).add(axisGroup);
			}
			
			
			// write the label
			if (withLabel && labelOptions.enabled) {
				str = labelFormatter.call({
					index: index,
					isFirst: pos == tickPositions[0],
					isLast: pos == tickPositions[tickPositions.length - 1],
					value: (categories && categories[pos] ? categories[pos] : pos)
				});
				if (str || str === 0) {
					x1 = x1 + labelOptions.x - (tickmarkOffset && horiz ? 
						tickmarkOffset * transA * (reversed ? -1 : 1) : 0); 
					y1 = y1 + labelOptions.y - (tickmarkOffset && !horiz ? 
						tickmarkOffset * transA * (reversed ? 1 : -1) : 0);
					/*
					 todo: translate animation
					  if (record.label) {
						record.label.animate({
							x: x1,
							y: y1
						});
					} else {
						record.label = renderer.text(*/
						renderer.text(
							str,
							x1,
							y1,
							labelOptions.style, 
							labelOptions.rotation,
							labelOptions.align
						).add(axisGroup); 
					//}
				}
			}
			
			//return record;
		}
		
		/**
		 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
		 * @param {Number} interval
		 */
		function normalizeTickInterval(interval, multiples) {
			var normalized;
				
			// round to a tenfold of 1, 2, 2.5 or 5
			magnitude = multiples ? 1 : math.pow(10, mathFloor(math.log(interval) / math.LN10));
			normalized = interval / magnitude;
			
			// multiples for a linear scale
			if (!multiples) {
				multiples = [1, 2, 2.5, 5, 10];				
				
				// the allowDecimals option
				if (options.allowDecimals === false) {
					if (magnitude == 1) {
						multiples = [1, 2, 5, 10];
					} else if (magnitude <= 0.1) {
						multiples = [1 / magnitude];
					}					
				}
			}
			
			// normalize the interval to the nearest multiple
			for (var i = 0; i < multiples.length; i++) {
				interval = multiples[i];
				if (normalized <= (multiples[i] + (multiples[i+1] || multiples[i])) / 2) {
					break;
				}
			}
			
			// multiply back to the correct magnitude
			interval *= magnitude;
			
			return interval;
		}
	
		/**
		 * Set the tick positions to a time unit that makes sense, for example
		 * on the first of each month or on every Monday.
		 */
		function setDateTimeTickPositions() {
			tickPositions = [];
			var i,
				useUTC = defaultOptions.global.useUTC,
				oneSecond = 1000 / timeFactor,
				oneMinute = 60000 / timeFactor,
				oneHour = 3600000 / timeFactor,
				oneDay = 24 * 3600000 / timeFactor,
				oneWeek = 7 * 24 * 3600000 / timeFactor,
				oneMonth = 30 * 24 * 3600000 / timeFactor,
				oneYear = 31556952000 / timeFactor,
			
				units = [[
					'second',						// unit name
					oneSecond,						// fixed incremental unit
					[1, 2, 5, 10, 15, 30]			// allowed multiples
				], [
					'minute',						// unit name
					oneMinute,				// fixed incremental unit
					[1, 2, 5, 10, 15, 30]			// allowed multiples
				], [
					'hour',							// unit name
					oneHour,			// fixed incremental unit
					[1, 2, 3, 4, 6, 8, 12]			// allowed multiples
				], [
					'day',							// unit name
					oneDay,		// fixed incremental unit
					[1, 2]							// allowed multiples
				], [
					'week',							// unit name
					oneWeek,	// fixed incremental unit
					[1, 2]							// allowed multiples
				], [
					'month',
					oneMonth,
					[1, 2, 3, 4, 6]
				], [
					'year',
					oneYear,
					null
				]],
			
				unit = units[6], // default unit is years
				interval = unit[1], 
				multiples = unit[2];
			
			// loop through the units to find the one that best fits the tickInterval
			for (i = 0; i < units.length; i++)  {
				unit = units[i];
				interval = unit[1];
				multiples = unit[2];
				
				
				if (units[i+1]) {
					// lessThan is in the middle between the highest multiple and the next unit.
					var lessThan = (interval * multiples[multiples.length - 1] + 
								units[i + 1][1]) / 2;
							
					// break and keep the current unit
					if (tickInterval <= lessThan) {
						break;
					}
				}
			}
			
			// prevent 2.5 years intervals, though 25, 250 etc. are allowed
			if (interval == oneYear && tickInterval < 5 * interval) {
				multiples = [1, 2, 5];
			}
	
			// get the minimum value by flooring the date
			var multitude = normalizeTickInterval(tickInterval / interval, multiples),
				minYear, // used in months and years as a basis for Date.UTC()
				minDate = new Date(min * timeFactor);
				
			minDate.setMilliseconds(0);
			
			if (interval >= oneSecond) { // second
				minDate.setSeconds(interval >= oneMinute ? 0 :
					multitude * mathFloor(minDate.getSeconds() / multitude));
			}
	
			if (interval >= oneMinute) { // minute
				minDate[setMinutes](interval >= oneHour ? 0 :
					multitude * mathFloor(minDate[getMinutes]() / multitude));
			}
	
			if (interval >= oneHour) { // hour
				minDate[setHours](interval >= oneDay ? 0 :
					multitude * mathFloor(minDate[getHours]() / multitude));
			}
	
			if (interval >= oneDay) { // day
				minDate[setDate](interval >= oneMonth ? 1 :
					multitude * mathFloor(minDate[getDate]() / multitude));
			}
					
			if (interval >= oneMonth) { // month
				minDate[setMonth](interval >= oneYear ? 0 :
					multitude * mathFloor(minDate[getMonth]() / multitude));
				minYear = minDate[getFullYear]();
			}
			
			if (interval >= oneYear) { // year
				minYear -= minYear % multitude;
				minDate[setFullYear](minYear);
			}
			
			// week is a special case that runs outside the hierarchy
			if (interval == oneWeek) {
				// get start of current week, independent of multitude
				minDate[setDate](minDate[getDate]() - minDate[getDay]() + 
					options.startOfWeek);
			}
			
			
			// get tick positions
			i = 1; // prevent crash just in case
			minYear = minDate[getFullYear]();
			var time = minDate.getTime() / timeFactor,
				minMonth = minDate[getMonth](),
				minDateDate = minDate[getDate]();
				
			// iterate and add tick positions at appropriate values
			while (time < max && i < plotWidth) {
				tickPositions.push(time);
				
				// if the interval is years, use Date.UTC to increase years
				if (interval == oneYear) {
					time = makeTime(minYear + i * multitude, 0) / timeFactor;
				
				// if the interval is months, use Date.UTC to increase months
				} else if (interval == oneMonth) {
					time = makeTime(minYear, minMonth + i * multitude) / timeFactor;
					
				// if we're using global time, the interval is not fixed as it jumps
				// one hour at the DST crossover
				} else if (!useUTC && (interval == oneDay || interval == oneWeek)) {
					time = makeTime(minYear, minMonth, minDateDate + 
						i * multitude * (interval == oneDay ? 1 : 7));
					
				// else, the interval is fixed and we use simple addition
				} else {
					time += interval * multitude;
				}
				
				i++;
			}
			// push the last time
			tickPositions.push(time);
			
			// dynamic label formatter 
			if (!options.labels.formatter) {
				labelFormatter = function() {
					return dateFormat(options.dateTimeLabelFormats[unit[0]], this.value, 1);
				};
			}
			
		}
			
			
		/**
		 * Set the tick positions of a linear axis to round values like whole tens or every five.
		 */
		function setLinearTickPositions() {
			
			var correctFloat = function(num) { // JS round off float errors
					var invMag = (magnitude < 1 ? mathRound(1 / magnitude) : 1) * 10;
					return mathRound(num * invMag) / invMag;
				},
				
				i,
				roundedMin = mathFloor(min / tickInterval) * tickInterval,
				roundedMax = math.ceil(max / tickInterval) * tickInterval;
				// default extreme ticks when axis does not start and end on a tick
				//firstTickPosition = roundedMin + tickInterval,
				//lastTickPosition = roundedMax - tickInterval,
			
				//invMag = (magnitude < 1 ? 1 / magnitude : 1) * 10; // round off JS float errors;
				
			tickPositions = [];
			
			// populate the intermediate values
			// todo: round off float errors occur here!
			i = correctFloat(roundedMin);
			while (i <= roundedMax) {
			//for (i = roundedMin; i <= roundedMax; i += tickInterval) {
				//i = mathRound(i * invMag) / invMag
				tickPositions.push(i);
				i = correctFloat(i + tickInterval);
			}
				
			// pad categorised axis to nearest half unit
			if (categories) {
				 min -= 0.5;
				 max += 0.5;
			}

			// dynamic label formatter 
			if (!labelFormatter) { 
				labelFormatter = function() {
					return this.value;
				};
			}
			
		}
		
		/**
		 * Set the tick positions to round values and optionally extend the extremes
		 * to the nearest tick
		 */
		function setTickPositions() {
			if (isDatetimeAxis)	{
				setDateTimeTickPositions();
			} else {
				setLinearTickPositions();
			}	
			
			// reset min/max or remove extremes based on start/end on tick
			var roundedMin = tickPositions[0],
				roundedMax = tickPositions[tickPositions.length - 1];
					
			
			if (options.startOnTick) {
				min = roundedMin;
			} else if (min > roundedMin) {
				tickPositions.shift();
			}
			
			if (options.endOnTick) {
				max = roundedMax;
			} else if (max < roundedMax) {
				tickPositions.pop();
			}
					
		}
		
		/**
		 * When using multiple axes, adjust the number of ticks to match the highest
		 * number of ticks in that group
		 */ 
		function adjustTickAmount() {
			if (!isDatetimeAxis && !categories) { // only apply to linear scale
				var oldTickAmount = tickAmount,
					calculatedTickAmount = tickPositions.length;
					
				// set the axis-level tickAmount to use below
				tickAmount = maxTicks[xOrY];
				
					
				if (calculatedTickAmount < tickAmount) {
					while (tickPositions.length < tickAmount) {
						tickPositions.push(tickPositions[tickPositions.length - 1] + tickInterval);
					}
					transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
				}
				if (defined(oldTickAmount) && tickAmount != oldTickAmount) {
					axis.isDirty = true;	
				}
			}
		}
	
		/**
		 * Set the scale based on data min and max, user set min and max or options
		 */
		function setScale() {
			var length, 
				type, 
				i,
				//total,
				oldMin = min,
				oldMax = max,
				maxZoom = options.maxZoom,
				zoomOffset;
				
			// get data extremes if needed
			getSeriesExtremes();
			
			// initial min and max from the extreme data values
			min = pick(userSetMin, options.min, dataMin);
			max = pick(userSetMax, options.max, dataMax);
			
			
			// maxZoom exceeded, just center the selection
			if (max - min < maxZoom) { 
				zoomOffset = (maxZoom - max + min) / 2;
				// if min and max options have been set, don't go beyond it
				min = mathMax(min - zoomOffset, pick(options.min, min - zoomOffset));
				max = math.min(min + maxZoom, pick(options.max, min + maxZoom));
			}
				
			// pad the values to get clear of the chart's edges
			if (!categories && !usePercentage && defined(min) && defined(max)) {
				length = (max - min) || 1;
				if (!defined(options.min) && !defined(userSetMin) && minPadding && (dataMin < 0 || !ignoreMinPadding)) { 
					min -= length * minPadding; 
				}
				if (!defined(options.max) && !defined(userSetMax)  && maxPadding && (dataMax > 0 || !ignoreMaxPadding)) { 
					max += length * maxPadding;
				}
			}
			
			// tickInterval
			if (categories || min == max) {
				tickInterval = 1;
			} else {
				tickInterval = /*options.tickInterval == 'auto' ? 
					(max - min) * options.tickPixelInterval / axisLength : 
					options.tickInterval;*/
					pick(
						options.tickInterval,
						(max - min) * options.tickPixelInterval / axisLength
					);
						
			}
			
				
			if (!isDatetimeAxis && !defined(options.tickInterval)) { // linear
				tickInterval = normalizeTickInterval(tickInterval);
			}
			
			// minorTickInterval
			minorTickInterval = options.minorTickInterval == 'auto' && tickInterval ?
					tickInterval / 5 : options.minorTickInterval;
				
			// get fixed positions based on tickInterval
			setTickPositions();
			
			// the translation factor used in translate function			
			transA = axisLength / ((max - min) || 1);
			
			// record the greatest number of ticks for multi axis
			if (!maxTicks) { // first call, or maxTicks have been reset after a zoom operation
				maxTicks = {
					x: 0,
					y: 0
				};
			}
			
			if (!isDatetimeAxis && tickPositions.length > maxTicks[xOrY]) {
				maxTicks[xOrY] = tickPositions.length;
			}
				
			// reset stacks
				
			//if (!isXAxis) for (type in stacks) each (stacks[type], function(stack, i) {
			if (!isXAxis) {
				for (type in stacks) {
					for (i in stacks[type]) {
						stacks[type][i].cum = stacks[type][i].total;
					}
				}
			}

			// mark as dirty if it is not already set to dirty and extremes have changed
			if (!axis.isDirty) {
				axis.isDirty = (min != oldMin || max != oldMax);
			}
		}
		
		/**
		 * Set the extremes and optionally redraw
		 * @param {Number} newMin
		 * @param {Number} newMax
		 * @param {Boolean} redraw
		 * 
		 */
		function setExtremes(newMin, newMax, redraw) {
			redraw = pick(redraw, true); // defaults to true
				
			fireEvent(axis, 'setExtremes', { // fire an event to enable syncing of multiple charts
				min: newMin,
				max: newMax
			}, function() { // the default event handler
				// make sure categorized axes are not exceeded
				if (categories) {
					if (newMin < 0) {
						newMin = 0;
					}
					if (newMax > categories.length - 1) {
						newMax = categories.length - 1;
					}
				}
				
				// set the new values
				//userSetMin = pick(newMin, min);
				//userSetMax = pick(newMax, max);
				//if (defined(newMin)) userSetMin = newMin;
				//if (defined(newMax)) userSetMax = newMax;
				
				// this fails on zooming when a series is hidden and ignoreHiddenSeries is true
				//userSetMin = pick(newMin, options.min, dataMin);
				//userSetMax = pick(newMax, options.max, dataMax);
				
				userSetMin = newMin;
				userSetMax = newMax;
			
				
				// redraw
				if (redraw) {
					chart.redraw();
				}
			});
			
		}
		
		/**
		 * Get the actual axis extremes
		 */
		function getExtremes() {
			return {
				min: min,
				max: max,
				dataMin: dataMin,
				dataMax: dataMax
			};
		}
		
		/**
		 * Get the zero plane either based on zero or on the min or max value.
		 * Used in bar and area plots
		 */
		function getZeroPlane(zeroValue) {
			if (min > 0) {
				zeroValue = min;
			} else if (max < 0) {
				zeroValue = max;
			}
			
			return translate(zeroValue, 0, 1);
		}
		
		/**
		 * Add a plot band or plot line after render time
		 * 
		 * @param item {Object} The plotBand or plotLine configuration object
		 */
		function addPlotBandOrLine(item) {
			var isLine = item.width,
				collection = isLine ? plotLines : plotBands;	

			collection.push(item);
			
			if (isLine) {
				drawPlotLine(item.value, item.color, item.width);
			} else {
				drawPlotBand(item.from, item.to, item.color);
			}			
		}
		

		
		/**
		 * Render the axis
		 */
		function render() {
			var axisTitleOptions = options.title,
				alternateGridColor = options.alternateGridColor,
				minorTickWidth = options.minorTickWidth,
				lineWidth = options.lineWidth,
				lineLeft,
				lineTop,
				tickmarkPos,
				hasData = associatedSeries.length && defined(min) && defined(max);
			
			if (!axisGroup) {
				axisGroup = renderer.g('axis').add(null, 7);
				gridGroup = renderer.g('grid').add(null, 1);
			} else {
				// clear the axis layers before new grid and ticks are drawn
				axisGroup.empty();
				gridGroup.empty();
				//axisLayer.clear();
				//gridLayer.clear();
			}
			
			// If the series has data draw the ticks. Else only the line and title
			if (hasData) {
				// alternate grid color
				if (alternateGridColor) {
					each(tickPositions, function(pos, i) {
						if (i % 2 === 0 && pos < max) {
							drawPlotBand(
								pos, 
								tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] : max, 
								alternateGridColor
							);
						}
					});
				}
				
				// custom plot bands (behind grid lines)
				each (plotBands, function(plotBand) {
					drawPlotBand(plotBand.from, plotBand.to, plotBand.color);
				});
				
				// minor grid lines
				if (minorTickInterval && !categories) {
					for (var i = min; i <= max; i += minorTickInterval) {
						drawPlotLine(i, options.minorGridLineColor, options.minorGridLineWidth);
						if (minorTickWidth) {
							addTick(
								i, 
								options.minorTickPosition, 
								options.minorTickColor, 
								minorTickWidth, 
								options.minorTickLength
							);
						}
					}
				}
				// grid lines and tick marks
				each(tickPositions, function(pos, index) {
					tickmarkPos = pos + tickmarkOffset;
					
					// add the grid line
					drawPlotLine(
						tickmarkPos, 
						options.gridLineColor, 
						options.gridLineWidth
					);
					
					// add the tick mark
					//tickRecord[pos] = addTick(
					addTick(
						pos, 
						options.tickPosition, 
						options.tickColor, 
						options.tickWidth, 
						options.tickLength, 
						!((pos == min && !options.showFirstLabel) || (pos == max && !options.showLastLabel)),
						index
					);
				});
			
				
				// custom plot lines (in front of grid lines)
				each (plotLines, function(plotLine) {
					drawPlotLine(plotLine.value, plotLine.color, plotLine.width);
				});
			
			} // end if hasData
			
			// Static items. As the axis group is cleared on subsequent calls
			// to render, these items are added outside the group.			
			if (!chart.hasRendered) {
				// axis line
				if (lineWidth) {
					lineLeft = plotLeft + (opposite ? plotWidth : 0) + offset;
					lineTop = chartHeight - marginBottom - (opposite ? plotHeight : 0) + offset;
					
					renderer.path(renderer.crispLine([
							M,
							horiz ? 
								plotLeft: 
								lineLeft,
							horiz ? 
								lineTop: 
								plotTop,
							L, 
							horiz ? 
								chartWidth - marginRight : 
								lineLeft,
							horiz ? 
								lineTop:
								chartHeight - marginBottom
						], lineWidth)).
						attr({ 
							stroke: options.lineColor, 
							'stroke-width': lineWidth
						}).
						add(null, 7);
					
				}
				
				// Render the title. 
				if (!axis.axisTitle && axisTitleOptions && axisTitleOptions.enabled && axisTitleOptions.text) {
					
					// compute anchor points for each of the title align options
					var margin = horiz ? 
							plotLeft : plotTop;
						
					// the position in the length direction of the axis
					var alongAxis = { 
						low: margin + (horiz ? 0 : axisLength), 
						middle: margin + axisLength / 2, 
						high: margin + (horiz ? axisLength : 0)
					}[axisTitleOptions.align];
					
					// the position in the perpendicular direction of the axis
					// todo: move the centerline fix to the VMLRenderer
					var offAxis = (horiz ? plotTop + plotHeight : plotLeft) +
						(horiz ? 1 : -1) * // horizontal axis reverses the margin
						(opposite ? -1 : 1) * // so does opposite axes
						axisTitleOptions.margin -
						(isIE ? parseInt(
							axisTitleOptions.style.fontSize || 12, 10
						) / 3 : 0); // preliminary fix for vml's centerline
					
					axis.axisTitle = renderer.text(
						axisTitleOptions.text,
						horiz ? 
							alongAxis: 
							offAxis + (opposite ? plotWidth : 0) + offset, // x
						horiz ? 
							offAxis - (opposite ? plotHeight : 0) + offset: 
							alongAxis, // y
						axisTitleOptions.style, 
						axisTitleOptions.rotation || 0,
						{ low: 'left', middle: 'center', high: 'right' }[axisTitleOptions.align]
					).add(null, 7);
					
				}
			}
			// stroke tick labels and title
			//axisLayer.strokeText();
			
			axis.isDirty = false;
		}
		
		/**
		 * Remove a plot band or plot line from the chart by id
		 * @param {Object} id
		 */
		function removePlotBandOrLine(id) {
			each ([plotBands, plotLines], function(collection) {
				for (var i = 0; i < collection.length; i++) {
	
					if (collection[i].id == id) {
						collection.splice(i, 1);
						break;
					}
				}
			});
			render();
		}
		
		/**
		 * Redraw the axis to reflect changes in the data or axis extremes
		 */
		function redraw() {
			
			// hide tooltip and hover states
			if (tracker.resetTracker) {
				tracker.resetTracker();
			}
		
			// render the axis
			render();
			
			// mark associated series as dirty and ready for redraw
			each (associatedSeries, function(series) {
				series.isDirty = true;
			});
						
		}
		
		/**
		 * Set new axis categories and optionally redraw
		 * @param {Array} newCategories
		 * @param {Boolean} doRedraw
		 */
		function setCategories(newCategories, doRedraw) {
				// set the categories
				axis.categories = categories = newCategories;
				
				// force reindexing tooltips
				each (associatedSeries, function(series) {
					series.translate();
					series.setTooltipPoints(true);
				});
				
				
				// optionally redraw
				axis.isDirty = true;
				if (pick(doRedraw, true)) {
					redraw();  // redraw axis
				}
		}
		
		
		
		/* 
		 * Clear memory
		 * /
		function destroy() {
			axisGroup.destroy();
			gridGroup.destroy();
			
			associatedSeries = axis = chart = options = null;
			
			for (var key in axis) {
				delete axis[key];
			}
		}*/
		
		// Run Axis
		
			//var hasWrittenTitle;
			
		// inverted charts have reversed xAxes as default
		if (inverted && isXAxis && reversed === UNDEFINED) {
			reversed = true;
		}
			
		// negate offset
		if (!opposite) {
			offset *= -1;
		}
		if (horiz) {
			offset *= -1;
		} 
			
		// expose some variables
		extend (axis, {
			addPlotBand: addPlotBandOrLine,
			addPlotLine: addPlotBandOrLine,
			adjustTickAmount: adjustTickAmount,
			categories: categories,
			//destroy: destroy,
			getExtremes: getExtremes,
			getZeroPlane: getZeroPlane,
			isXAxis: isXAxis,
			options: options,
			render: render,
			setExtremes: setExtremes,
			setScale: setScale,
			setCategories: setCategories,
			translate: translate,
			redraw: redraw,
			removePlotBand: removePlotBandOrLine,
			removePlotLine: removePlotBandOrLine,
			//reset: reset,
			reversed: reversed,
			stacks: stacks
		});
		
		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}
		
		// set min and max
		setScale();
			
	
	} // end Axis
	
	
	/**
	 * The toolbar object
	 * 
	 * @param {Object} chart 
	 */
	function Toolbar(chart) {
		var buttons = {};
		
		function add(id, text, title, fn) {
			if (!buttons[id]) {
				// todo: optional placement
				var button = renderer.text(
					text,
					plotLeft + plotWidth - 20,
					plotTop + 30,
					options.toolbar.itemStyle,
					0,
					'right'
				)
				.on('click', fn)
				.add(null, 20);
				buttons[id] = button;
			}
		}
		function remove(id) {
			discardElement(buttons[id].element);
			buttons[id] = null;
		}
		
		// public
		return {
			add: add,
			remove: remove
		};
	}
	
	function Tooltip (options) {
		var currentSeries,
			//innerDiv,
			borderWidth = options.borderWidth,
			style = options.style,
			padding = parseInt(style.padding, 10),
			boxOffLeft = borderWidth + padding, // off left/top position as IE can't 
				//properly handle negative positioned shapes
			tooltipIsHidden = true,
			boxWidth,
			boxHeight,
			currentX = 0,			
			currentY = 0;
		
		// remove padding CSS and apply padding on box instead
		style.padding = 0;
		
		// create the elements
		var group = renderer.g('tooltip').add(null, 8),
			
			box = renderer.rect(boxOffLeft, boxOffLeft, 0, 0, options.borderRadius, borderWidth).
				attr({
					fill: options.backgroundColor,
					'stroke-width': borderWidth
				}).
				add(group).
				shadow(options.shadow),
			label = renderer.text('', padding + boxOffLeft, parseInt(style.fontSize, 10) + padding + boxOffLeft).
				/*attr({
					style: serializeCSS(extend(style, { fill: style.color }))
				}).*/
				css(style).
				add(group, 1);
				
		/**
		 * Provide a soft movement for the tooltip
		 * 
		 * @param {Number} finalX
		 * @param {Number} finalY
		 * 
		 * @todo Make tranlate animation, group the box and label and animate the translation of the group
		 */
		function move(finalX, finalY) {
			
			//var hidden = false; //(tooltipDiv.style.visibility == HIDDEN),
			
			currentX = tooltipIsHidden ? finalX : (2 * currentX + finalX) / 3;
			currentY = tooltipIsHidden ? finalY : (currentY + finalY) / 2;
			
			
			group.translate(currentX, currentY);
			
			// run on next tick of the mouse tracker
			if (mathAbs(finalX - currentX) > 1 || mathAbs(finalY - currentY) > 1) {
				tooltipTick = function() {
					move(finalX, finalY);
				};
			} else {
				tooltipTick = null;
			}
		}
		
		/**
		 * Hide the tooltip
		 */
		function hide() {

			tooltipIsHidden = true;
			// todo: group
			box.hide();
			label.hide();
		}
		
		/**
		 * Refresh the tooltip's text and position. 
		 * @param {Object} point
		 * 
		 */
		function refresh(point) {
			var 
				series = point.series,
				//chartOptions = chart.options,
				//categories = series.xAxis ? series.xAxis.categories : null,
				
				borderColor = options.borderColor || point.color || series.color || '#606060',
				//inverted = chart.inverted,//chart.options.chart.inverted,
				x,
				y,
				boxX,
				boxY,
				//oldInnerDivHeight = innerDiv.offsetHeight,
				show,
				bBox,
				text = point.tooltipText,
				tooltipPos = point.tooltipPos;
				
			
			// register the current series
			currentSeries = series;
			
			// get the reference point coordinates (pie charts use tooltipPos)
			x = tooltipPos ? tooltipPos[0] : (inverted ? plotWidth - point.plotY : point.plotX);
			y = tooltipPos ? tooltipPos[1] : (inverted ? plotHeight - point.plotX : point.plotY);
				
				
			// hide tooltip if the point falls outside the plot
			//if (x >= 0 && x <= plotWidth && y >= 0 && y <= plotHeight) {
			show = isInsidePlot(x, y);
			
			// update the inner HTML
			if (text === false || !show) { 
				hide();
			} else {
				
			    // show the hover mark
				tracker.resetActivePoint();
				series.setPointState(point, HOVER_STATE);
			
				// show it
				if (tooltipIsHidden) {
					box.show();
					label.show();
					tooltipIsHidden = false;
				}
				
				// svg
				label.attr({
						text: text
					});
				
				// get the bounding box
				bBox = label.getBBox();
				boxWidth = bBox.width;
				boxHeight = bBox.height;
				
				// set the size of the box
				box.attr({
						width: boxWidth + 2 * padding,
						height: boxHeight + 2 * padding,
						stroke: borderColor
					});
				
				// keep the box within the chart area
				boxX = x - boxWidth + plotLeft - 25;
				boxY = y - boxHeight + plotTop + 10;
				
				// it is too far to the left, adjust it
				if (boxX < 7) {
					boxX = 7;
					boxY -= 20;
				}
				
				
				if (boxY < 5) {
					boxY = 5; // above
				} else if (boxY + boxHeight > chartHeight) { 
					boxY = chartHeight - boxHeight - 5; // below
				}
				
				// do the move
				move(mathRound(boxX - boxOffLeft), mathRound(boxY - boxOffLeft));
				
				
			}
		
		}
		

		
		// public members
		return {
			refresh: refresh,
			hide: hide
			/*,
			destroy: function() {
				box.destroy();
				group.destroy();
				label.destroy();
				
				box = group = label = options = hide = move = refresh = null;
				
				for (var key in this) {
					delete this[key];
				}
			}*/
		};	
	}
	
	/**
	 * The mouse tracker object
	 * @param {Object} chart
	 * @param {Object} options
	 */
	function MouseTracker (chart, options) {

		
		var activePoint,
			mouseDownX, 
			mouseDownY,
			hasDragged,
			selectionMarker,
			/*dragPoint,
			dragPointCoordinates,
			allowXDrag,
			allowYDrag,*/
			zoomType = optionsChart.zoomType,
			zoomX = /x/.test(zoomType),
			zoomY = /y/.test(zoomType),
			zoomHor = zoomX && !inverted || zoomY && inverted,
			zoomVert = zoomY && !inverted || zoomX && inverted;
			
		/*
		 * Get the currently hovered point
		 * /
		function getActivePoint() {
			return activePoint;
		}*/
		
		/**
		 * Add IE support for pageX and pageY
		 * @param {Object} e The event object in standard browsers
		 */
		function normalizeMouseEvent(e) {
			// common IE normalizing
			e = e || win.event;
			if (!e.target) {
				e.target = e.srcElement;
			}
				
			// pageX and pageY
			if (!e.pageX) {
				e.pageX = e.clientX + (doc.documentElement.scrollLeft || doc.body.scrollLeft);
			}
			
			if (!e.pageY) {
				e.pageY = e.clientY + (doc.documentElement.scrollTop || doc.body.scrollTop);
			}
			
			return e;
		}
		
		/**
		 * Get the click position in terms of axis values.
		 * 
		 * @param {Object} e A mouse event
		 */
		function getMouseCoordinates(e) {
			var coordinates = {
				xAxis: [],
				yAxis: []
			}; 
			each (axes, function(axis, i) {
				var translate = axis.translate,
					isXAxis = axis.isXAxis,
					isHorizontal = inverted ? !isXAxis : isXAxis;
					
				coordinates[isXAxis ? 'xAxis' : 'yAxis'].push({
					axis: axis,
					value: translate(
						isHorizontal ? 
							e.pageX - position.x - plotLeft  : 
							plotHeight - e.pageY + position.y + plotTop ,
						true
					)								
				});
			});
			return coordinates;
		}
		
		/* *
		 * Drop a point after dragging to change it's value
		 * 
		 * @todo: 
		 * - x dimension
		 * /
		function dropDragPoint() {
			if (hasDragged && dragPoint) {
				var yAxis = dragPointCoordinates.yAxis,
					i = 0;
					
				// identify the point's yAxis
				for (i; i < yAxis.length; i++) { 
					if (yAxis[i].axis == dragPoint.series.yAxis) {
						break;
					}					
				}
				// update the point
				dragPoint.update(yAxis[i].value);
				dragPoint = null;				
			}
		}
		*/
		/**
		 * Refresh the tooltip on mouse move
		 */
		function onmousemove (e) {
			var point = chart.hoverPoint,
				series = chart.hoverSeries;
				
			if (point || series) {
		
				// get the point
				if (!point) {
					point = series.tooltipPoints[
						inverted ? 
							e.pageY - position.y : 
							e.pageX - position.x - plotLeft // wtf?
					];
				}
			
				// a new point is hovered, refresh the tooltip
				if (point && point != activePoint) {
					
					// trigger the events
					if (activePoint) {
						activePoint.firePointEvent('mouseOut');
						
					}
					point.firePointEvent('mouseOver');

					// refresh the tooltip
					if (tooltip) {
						tooltip.refresh(point);
					}
					activePoint = point;					
					
				}				
			}
		}
				
		/**
		 * Set the currently active point's display state back to normal
		 */
		function resetActivePoint() {
			if (activePoint && activePoint.graphic) {
				/*var options = activePoint.series.options.marker,
					attr;
				
				// todo: make general basic config object and hover object
				// for lines, bars and pies
				attr = {
					stroke: options.lineColor,
					'stroke-width': options.lineWidth,
					r: options.radius
				};
				if (activePoint.series.allowsPointStateColor) {
					attr = {
						fill: activePoint.color
					};
				}*/
				
				
				activePoint.series.setPointState(activePoint, NORMAL_STATE);
				
			}

		}
		
		/**
		 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
		 */
		function resetTracker() {
			var hoverSeries = chart.hoverSeries;

			// hide the tooltip
			resetActivePoint();
			if (tooltip) {
				tooltip.hide();
			}
			// hide the hovered series and point
			if (hoverSeries) {
				if (hoverSeries.setState) { // it might be destroyed
					hoverSeries.setState();
				}
				chart.hoverSeries = null;
				activePoint = null;
			}
		}
		
		/**
		 * Mouse up or outside the plot area
		 */
		function drop() {
			//var selectionIsMade;
			if (selectionMarker) {
				var selectionData = {
						xAxis: [],
						yAxis: []
					},
					selectionBox = selectionMarker.getBBox(),
					selectionLeft = selectionBox.x - plotLeft,
					selectionTop = selectionBox.y - plotTop;
				
					
				// a selection has been made
				if (hasDragged) {
					
					// record each axis' min and max
					each (axes, function(axis, i) {
						var translate = axis.translate,
							isXAxis = axis.isXAxis,
							isHorizontal = inverted ? !isXAxis : isXAxis,
								selectionMin = translate(
									isHorizontal ? 
										selectionLeft : 
										plotHeight - selectionTop - selectionBox.height, 
									true
								),
								selectionMax = translate(
									isHorizontal ? 
										selectionLeft + selectionBox.width : 
										plotHeight - selectionTop, 
									true
								);
								
							selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
								axis: axis,
								min: math.min(selectionMin, selectionMax), // for reversed axes
								max: mathMax(selectionMin, selectionMax)
							});
							
						});
					fireEvent(chart, 'selection', selectionData, zoom);

					//selectionIsMade = true;
				}					
				selectionMarker = selectionMarker.destroy();
			}
			
			chart.mouseIsDown = mouseIsDown = hasDragged = false;

		}
		
		/**
		 * Set the JS events on the container element
		 */
		function setDOMEvents () {
			var lastWasOutsidePlot = true;
			
			//trackerGroup.on('mousedown', function(e) {
			container.onmousedown = function(e) {
				e = normalizeMouseEvent(e);
				
				// record the start position
				if (e.preventDefault) {
					e.preventDefault();
				}
				chart.mouseIsDown = mouseIsDown = true;
				mouseDownX = e.pageX;
				mouseDownY = e.pageY;
					
				
				// make a selection
				if (hasCartesianSeries && (zoomX || zoomY)) {
					if (!selectionMarker) {
						selectionMarker = renderer.rect(
							plotLeft,
							plotTop,
							zoomHor ? 1 : plotWidth,
							zoomVert ? 1 : plotHeight,
							0
						)
						.attr({
							className: PREFIX +'selection-marker', 
							fill: 'rgba(69,114,167,0.25)'
						})
						.add(null, 7);
					}
				}
				
				
			};
			
			
			// Use native browser event for this one. It's faster, and MooTools
			// doesn't use clientX and clientY.
			//.on('mousemove', function(e) {
			container.onmousemove = function(e) {
				e = normalizeMouseEvent(e);
				e.returnValue = false;
				
				// todo: General inside plot function, or cache the value. This is used also in
				// tooltips
				var mouseX = e.pageX,
					mouseY = e.pageY,
					//posX = position.x,
					//posY = position.y,
					isOutsidePlot = !isInsidePlot(mouseX, mouseY, 'page');
					/*isOutsidePlot = mouseX < posX + plotLeft ||
						mouseX > posX + plotLeft + plotWidth ||
						mouseY < posY + plotTop ||
						mouseY > posY + plotTop + plotHeight;*/
				
				
				
					
				
				if (mouseIsDown) { // make selection
					
					// determine if the mouse has moved more than 10px
					hasDragged = Math.sqrt(
						Math.pow(mouseDownX - e.pageX, 2) + 
						Math.pow(mouseDownY - e.pageY, 2)
					) > 10;
					
					
					// adjust the width of the selection marker
					if (zoomHor) {
						var xSize = e.pageX - mouseDownX;
						selectionMarker.attr({
							width: mathAbs(xSize),
							x: (xSize > 0 ? 0 : xSize) + mouseDownX - position.x
						});
					}
					// adjust the height of the selection marker
					if (zoomVert) {
						var ySize = e.pageY - mouseDownY;
						selectionMarker.attr({
							height: mathAbs(ySize) + PX,
							y: (ySize > 0 ? 0 : ySize) + mouseDownY - position.y
						});
					}
					
					
					
					
				} else if (!isOutsidePlot) {
					// show the tooltip
					onmousemove(e);
				}
				
				// cancel on mouse outside
				if (isOutsidePlot && !lastWasOutsidePlot) {

					// reset the tracker					
					resetTracker();
					
					// drop the selection if any and reset mouseIsDown and hasDragged
					drop();
				}	
				
				lastWasOutsidePlot = isOutsidePlot;
				return false;
			};
			
			//.on('mouseup', function() {
			container.onmouseup = function(e) {
				
				
				drop();
				
				/*if (selectionMarker) {
					var selectionData = {
							xAxis: [],
							yAxis: []
						},
						selectionBox = selectionMarker.getBBox(),
						selectionLeft = selectionBox.x - plotLeft,
						selectionTop = selectionBox.y - plotTop;
					
						
					// a selection has been made
					if (hasDragged) {
						
						// record each axis' min and max
						each (axes, function(axis, i) {
							var translate = axis.translate,
								isXAxis = axis.isXAxis,
								isHorizontal = inverted ? !isXAxis : isXAxis;
								
							selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
								axis: axis,
								min: translate(
									isHorizontal ? 
										selectionLeft : 
										plotHeight - selectionTop - selectionBox.height, 
									true
								),
								max: translate(
									isHorizontal ? 
										selectionLeft + selectionBox.width : 
										plotHeight - selectionTop, 
									true
								)								
							});
						});
						fireEvent(chart, 'selection', selectionData, zoom);

						selectionIsMade = true;
					}					
					selectionMarker = selectionMarker.remove();
				}
				
				chart.mouseIsDown = mouseIsDown = hasDragged = false;*/
			
			};
			
			//.on('mouseout', function(e) {
			/*container.onmouseout = function(e) {
				e = e || win.event;
				var	related = e.relatedTarget || e.toElement;
				
				// check that the mouse has really left the imagemap
				if (related && / *related != trackerRect.element &&* / !related.isTracker) {
			
					// reset the tracker
					resetTracker();
					
					
					// reset mouseIsDown and hasDragged
					chart.mouseIsDown = mouseIsDown = hasDragged = false;
					
				}
			}*/
			
			// MooTools 1.2.3 doesn't fire this in IE when using addEvent
			//.on('click', function(e) {
			container.onclick = function(e) {
				e = normalizeMouseEvent(e);
				 
				e.cancelBubble = true; // IE specific
				
				if (!hasDragged) {
					if (activePoint && attr(e.target, 'isTracker')) {
						var plotX = activePoint.plotX,
							plotY = activePoint.plotY;
							
						// add page position info
						extend(activePoint, {
							pageX: position.x + plotLeft + 
								(inverted ? plotWidth - plotY : plotX),
							pageY: position.y + plotTop + 
								(inverted ? plotHeight - plotX : plotY)
						});
						
						// the series click event
						fireEvent(chart.hoverSeries, 'click', extend(e, {
							point: activePoint
						}));
						
						// the point click event
						activePoint.firePointEvent('click', e);
					
					} else { 
						extend (e, getMouseCoordinates(e));
						
						// fire a click event in the chart
						if (isInsidePlot(e.pageX, e.pageY, 'page')) {
							fireEvent(chart, 'click', e);
						}
					}
					
					
				}
				// reset mouseIsDown and hasDragged
				hasDragged = false;
			};
			
			 
		}
		
		

		
		/**
		 * Create the image map that listens for mouseovers
		 */
		function createImageMap () {
			/*var id = 'highchartsMap'+ canvasCounter++;
			
			chart.imagemap = imagemap = createElement('map', {
					name: id,
					id: id,
					className: 'highcharts-image-map'
				}, null, container);
			
			// Append the image to the image map to allow events to 
			// bubble up
			trackerImage = createElement('img', {
				useMap: '#'+ id
			}, {
				width: plotWidth + PX,
				height: plotHeight + PX,
				left: plotLeft + PX,
				top: plotTop + PX,
				opacity: 0,
				border: NONE,
				position: ABSOLUTE,
				// Workaround: if not clipped, the left axis will flicker in 
				// IE8 when hovering the chart
				clip: 'rect(1px,'+ plotWidth +'px,'+ plotHeight +'px,1px)', 
				zIndex: 9
			}, imagemap);*/
			chart.trackerGroup = trackerGroup = renderer.g('tracker');
			
			if (inverted) {
				trackerGroup.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				}).rotate(90).flip('x');
			} 
		
			trackerGroup.translate(plotLeft, plotTop).
			add(null, 9);
		
			/*chart.trackerRect = trackerRect = renderer.rect(
				0, 
				0, 
				plotWidth, 
				plotHeight, 
				0
			).attr({
				//'class': 'tracker-rect',
				fill: 'rgba(192,192,192,0.005)' // to be able to detect mousemove
			}). 
			add(chart.trackerGroup);*/
			
						
			// Blank image for modern browsers. IE doesn't need a valid 
			// image for the image map to work, and fails in SSL mode
			// if it's present.
			//if (!isIE) trackerImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
		}
		


		/**
		 * Bring a specific area to the front so that the user can follow a line. The
		 * legend area should always stay on top. Series tracker areas are brought to the
		 * top after the legend area.
		 * @param {Object} area The area DOM element
		 */
		/*function insertAtFront(area) {
			var before = 0,
				i,
				childNodes = imagemap.childNodes;
			for (i = 0; i < childNodes.length; i++) {
				if (childNodes[i].isLegendArea) {
					before = i + 1;
					break;
				}
			}
			imagemap.insertBefore(area, childNodes[before]);				
		}*/
		
		/*if (!options.enabled) {
			return;
		}*/
		
		// Run MouseTracker
		createImageMap(); // todo: check out and rename if still used
		if (options.enabled) {
			chart.tooltip = tooltip = Tooltip(options);
		}
		
		setDOMEvents();
		
		// set the fixed interval ticking for the smooth tooltip
		tooltipInterval = setInterval(function() {
			if (tooltipTick) {
				tooltipTick();
			}
		}, 32);
		
		// expose properties
		extend (this, {
			//insertAtFront: insertAtFront,
			resetActivePoint: resetActivePoint,
			zoomX: zoomX,
			zoomY: zoomY,
			resetTracker: resetTracker
			/*,
			destroy: function() {
				
				
				chart = options = selectionMarker = null;
			}*/
		});
	}
	
	
	
	/**
	 * The overview of the chart's series
	 * @param {Object} chart
	 */
	var Legend = function(chart) {
		// already existing			
		//if (chart.legend) return;
			
		var options = chart.options.legend;
			
		if (!options.enabled) {
			return;
		}
		
		var //li,
			horizontal = options.layout == 'horizontal',
			symbolWidth = options.symbolWidth,
			symbolPadding = options.symbolPadding,
			//dom,
			//topRule = '#'+ container.id +' .highcharts-legend li', // apply once for each chart
			allItems = [],
			//legendLayer = new Layer('legend', container, null, { zIndex: 7 }),
			//legendArea,
			style = options.style,
			itemStyle = options.itemStyle,
			itemHoverStyle = options.itemHoverStyle,
			padding = parseInt(style.padding, 10),
			rightPadding = 20,
			lineHeight = options.lineHeight || 16,
			y = 18,
			initialItemX = 4 + padding + symbolWidth + symbolPadding,
			itemX,
			itemY,
			lastItemY,
			box,
			//checkboxes,
			legendBorderWidth = options.borderWidth,
			legendBackgroundColor = options.backgroundColor,
			legendGroup,
			offsetWidth,
			boxX,
			boxY,
			widthOption = options.width,
			boxWidth,
			boxHeight,
			series = chart.series,
			reversedLegend = options.reversed;
			
		
		/**
		 * Set the colors for the legend item
		 * @param {Object} item A Series or Point instance
		 * @param {Object} visible Dimmed or colored
		 */
		function colorizeItem(item, visible) {
			var legendItem = item.legendItem,
				legendLine = item.legendLine,
				legendSymbol = item.legendSymbol,
				hiddenColor = options.itemHiddenStyle.color,
				textColor = visible ? options.itemStyle.color : hiddenColor,
				symbolColor = visible ? item.color : hiddenColor;
			if (legendItem) {
				legendItem.attr({ fill: textColor });
			}
			if (legendLine) {
				legendLine.attr({ stroke: symbolColor });
			}
			if (legendSymbol) {
				legendSymbol.attr({ 
					stroke: symbolColor,
					fill: symbolColor
				});
			}
		}
		
		/**
		 * Position the legend item
		 * @param {Object} item A Series or Point instance
		 * @param {Object} visible Dimmed or colored
		 */
		function positionItem(item, itemY) {
			var legendItem = item.legendItem,
				legendLine = item.legendLine,
				legendSymbol = item.legendSymbol,
				checkbox = item.checkbox;
			if (legendItem) {
				legendItem.attr({ y: itemY });
			}
			if (legendLine) {
				legendLine.translate(0, itemY - 4);
			}
			if (legendSymbol) {
				legendSymbol.attr({ y: itemY - (legendSymbol.isSimple ? 11 : 4) });
			}
			if (checkbox) {
				checkbox.y = itemY;
			}
		}
		
		/* *
		 * Destroy the legend object to release memory
		 * /
		function destroy() {
			box.destroy();
			legendGroup.destroy();
			
			// null all scope variables
			allItems = chart = options = series = null;
			
			for (var key in this) {
				delete this[key];
			}
		}*/
		
		/**
		 * Destroy a single legend item
		 * @param {Object} item The series or point
		 */
		function destroyItem(item) {
			var i = allItems.length,				
				checkbox = item.checkbox;
				
			// pull out from the array
			// todo: make general function for this operation
			while (i--) {
				if (allItems[i] == item) {
					allItems.splice(i, 1);
					break;
				}
			}
				
			// destroy SVG elements
			each (['legendItem', 'legendLine', 'legendSymbol'], function(key) {
				if (item[key]) {
					item[key].destroy();
				}
			});
			
			if (checkbox) {
				discardElement(item.checkbox);
			}
			
			
		}
		
		
		
		/**
		 * Render a single specific legend item
		 * @param {Object} item A series or point
		 */
		function renderItem(item) {
			var	//markerOptions,
				isHidden = false, //item.legendItem.className == HIGHCHARTS_HIDDEN,
				/*color = isHidden ? 
					options.itemHiddenStyle.color : 
					item.color,*/
				bBox,
				legendSymbol,
				simpleSymbol,
				li = item.legendItem,
				series = item.series || item;
				
			
			if (!li) { // generate it once, later move it
			
				// let these series types use a simple symbol
				simpleSymbol = /^(bar|pie|area|column)$/.test(series.type);
				
				// generate the list item text
				item.legendItem = li = renderer.text(
						options.labelFormatter.call(item),
						itemX, 
						0,
						itemStyle
					)
					.on('mouseover', function() {
						item.setState(HOVER_STATE);				
						li.css(itemHoverStyle);
					})
					.on('mouseout', function() {		
						li.css(itemStyle);
						item.setState();
					})
					.on('click', function(event) {
						var //target = event.target,
							strLegendItemClick = 'legendItemClick',
							fnLegendItemClick = function() {
								item.setVisible();
							};
						
						// click the name or symbol
						if (item.firePointEvent) { // point
							item.firePointEvent (strLegendItemClick, null, fnLegendItemClick);
						} else {
							fireEvent (item, strLegendItemClick, null, fnLegendItemClick);
						}
					})
					.add(legendGroup, 2);
				
				// draw the line
				if (!simpleSymbol && item.options && item.options.lineWidth) {
					item.legendLine = renderer.path([
						M,
						itemX - symbolWidth - symbolPadding, 
						0,
						L, 
						itemX - symbolPadding, 
						0
					]).attr({
						//stroke: color,
						'stroke-width': item.options.lineWidth
					}).
					add(legendGroup, 2);
				}
					
				// draw a simple symbol
				if (simpleSymbol) { // bar|pie|area|column
					//legendLayer.drawRect(
					legendSymbol = renderer.rect(
						itemX - symbolWidth - symbolPadding,
						0,
						symbolWidth,
						12,
						2
					).attr({
						'stroke-width': 0
					}).add(legendGroup, 1);
				}
					
				// draw the marker
				else if (item.options && item.options.marker && item.options.marker.enabled) {
					legendSymbol = renderer.symbol(
						item.symbol,
						itemX - symbolWidth / 2 - symbolPadding, 
						0, 
						item.options.marker.radius
					)
					.attr(item.pointAttr[NORMAL_STATE])
					.add(legendGroup, 1);
				}
				if (legendSymbol) {
					legendSymbol.isSimple = simpleSymbol;
					item.legendSymbol = legendSymbol;
				}
					
				// colorize the items
				colorizeItem(item, !isHidden);
				
				
				// add the HTML checkbox on top
				if (item.options && item.options.showCheckbox) {
					item.checkbox = createElement('input', {
						type: 'checkbox',
						checked: item.selected,
						defaultChecked: item.selected, // required by IE7
						onclick: function() {
							fireEvent (item, 'checkboxClick', { 
									checked: this.checked 
								}, 
								function() {
									item.select();
								}
							);
						}
					}, options.itemCheckboxStyle, container);
				}
			}
			
			
			// add the checkbox
			/*if (item.options && item.options.showCheckbox) {
				var checkbox, checkMarker, checkRect;
				checkbox = renderer.rect(
						offsetWidth + 0.5, 
						itemY - lineHeight - 12.5, 
						12, 
						12,
						0, 
						1
					).attr({
						'stroke-width': 1,
						fill: 'red',
						stroke: '#606060'
					})
					.on('click', function() {

						fireEvent (item, 'checkboxClick', { 
								checked: target.checked 
							}, 
							function() {
								item.select();
							}
						);
					})
					.add(legendGroup);
				
			}*/
			
			
			// position the newly generated or reordered items
			positionItem(item, itemY);
			
			// calculate the positions for the next line
			bBox = li.getBBox();
			lastItemY = itemY;
			
			var itemWidth = options.itemWidth || symbolWidth + symbolPadding + bBox.width + rightPadding;
			if (horizontal) {
			
				itemX += itemWidth;
				offsetWidth = widthOption || mathMax(itemX, offsetWidth);
			
				if (itemX - initialItemX + itemWidth > 
						(widthOption || (chartWidth - 2 * padding - initialItemX))) { // new line
					itemX = initialItemX;
					itemY += lineHeight;
				}
				
			} else {
				itemY += lineHeight;
				// the width of the widest item
				offsetWidth = widthOption || mathMax(itemWidth, offsetWidth);			
			}			
			
			// add it all to an array to use below
			allItems.push(item);
		}

		/**
		 * Render the legend. This method can be called both before and after
		 * chart.render. If called after, it will only rearrange items instead
		 * of creating new ones.
		 */
		function renderLegend() {
			itemX = initialItemX;
			itemY = y;
			offsetWidth = 0;
			lastItemY = 0;
			
			if (!legendGroup) {
				legendGroup = renderer.g('legend').add(null, 7);
			}
			
			
			// add HTML for each series
			if (reversedLegend) {
				series.reverse();
			}
			each(series, function(serie) {
				if (!serie.options.showInLegend) {
					return;
				}
				
				// use points or series for the legend item depending on legendType
				var items = (serie.options.legendType == 'point') ?
					serie.data : [serie];
					//simpleSymbol;
						
				// render all items
				each(items, renderItem);
			});
			if (reversedLegend) { // restore
				series.reverse();
			}
			
			
			
			// Draw the border
			boxWidth = widthOption || offsetWidth;
			boxHeight = lastItemY - y + (horizontal ? lineHeight : 0);
			boxX = 0;
			if (legendBorderWidth || legendBackgroundColor) {
				boxWidth += 2 * padding;
				boxHeight += 2 * padding;
				
				if (!box) {
					box = renderer.rect(
						//-boxX,
						0, 
						//y - lineHeight - padding + 3,
						0,
						boxWidth,
						boxHeight,
						options.borderRadius,
						legendBorderWidth || 0
					).attr({
						stroke: options.borderColor,
						'stroke-width': legendBorderWidth || 0,
						fill: legendBackgroundColor || NONE
					}).add(legendGroup).
					shadow(options.shadow);
				
				} else {
					box.attr({ 
						height: boxHeight,
						width: boxWidth
					});
				}
			}
			
			// 1.x compatibility: positioning based on style
			var props = ['left', 'right', 'top', 'bottom'],
				prop,
				i = 4;
			while(i--) {
				prop = props[i];
				if (style[prop] && style[prop] != 'auto') {
					options[i < 2 ? 'align' : 'verticalAlign'] = prop;
					options[i < 2 ? 'x' : 'y'] = parseInt(style[prop], 10) * (i % 2 ? -1 : 1);
				}
			}

			
			var boxPos = getAlignment(extend(options, {
				width: boxWidth,
				height: boxHeight
			}));
			legendGroup.translate(boxPos.x, boxPos.y);
			
			// Position the checkboxes after the with is determined 
			each(allItems, function(item) {
				var checkbox = item.checkbox;
				if (checkbox) {
					css(checkbox, {
						left: (boxX + boxWidth - 20) +PX,
						top: (boxY + checkbox.y - 14) + PX 
					});
				}
			});
			
		}
		
		// run legend
		renderLegend();
		
		// expose 
		return {
			colorizeItem: colorizeItem,
			//destroy: destroy,
			destroyItem: destroyItem,
			renderLegend: renderLegend
		};
	};
	
	
	
		
	

	/** 
	 * Initialize an individual series, called internally before render time
	 */
	function initSeries(options) {
		var type = options.type || optionsChart.defaultSeriesType,
			typeClass = seriesTypes[type],
			serie,
			hasRendered = chart.hasRendered;
			
		// an inverted chart can't take a column series and vice versa
		if (hasRendered) {
			if (inverted && type == 'column') {
				typeClass = seriesTypes.bar;
			} else if (!inverted && type == 'bar') {
				typeClass = seriesTypes.column;
			}
		}
		
		serie = new typeClass();
		
		serie.init(chart, options);
		
		// set internal chart properties
		if (!hasRendered && serie.inverted) {
			inverted = true;
		}
		if (serie.isCartesian) {
			hasCartesianSeries = serie.isCartesian;
		}
		
		series.push(serie);
		
		return serie;
	}

	/**
	 * Add a series dynamically after  time
	 * 
	 * @param {Object} options The config options
	 * @param {Boolean} redraw Whether to redraw the chart after adding. Defaults to true.
	 * 
	 * @return {Object} series The newly created series object
	 */
	function addSeries(options, redraw) {
		var series;
		
		redraw = pick(redraw, true); // defaults to true
		
		fireEvent(chart, 'addSeries', { options: options }, function() {
			series = initSeries(options);
			series.isDirty = true;
			
			chart.isDirty = true; // the series array is out of sync with the display
			if (redraw) {
				chart.redraw();
			}
		});
		
		return series;
	}
	
	/**
	 * Check whether a given point is within the plot area
	 * 
	 * @param {Number} x Pixel x relative to the coordinateSystem
	 * @param {Number} y Pixel y relative to the coordinateSystem
	 * @param {String} coordinateSystem 'page' or undefined
	 */
	isInsidePlot = function(x, y, coordinateSystem) {
		var left = 0,
			top = 0;
			
		if (coordinateSystem == 'page') {
			left += position.x + plotLeft;
			top += position.y + plotTop;
		}
		return x >= left &&
			x <= left + plotWidth &&
			y >= top &&
			y <= top + plotHeight;
	};
		
	/**
	 * Adjust all axes tick amounts
	 */
	function adjustTickAmounts() {
		if (optionsChart.alignTicks !== false) {
			each (axes, function(axis) {
				axis.adjustTickAmount();
			});
		}
	}

	/**
	 * Redraw legend, axes or series based on updated data
	 */
	function redraw() {
		var redrawLegend = chart.isDirty,
			hasStackedSeries,
			seriesLength = series.length,
			i = seriesLength,
			serie;
		
		// link stacked series
		while (i--) {
			serie = series[i];
			if (serie.isDirty && serie.options.stacking) {
				hasStackedSeries = true;
				break;
			}
		}
		if (hasStackedSeries) { // mark others as dirty
			i = seriesLength;
			while (i--) {
				serie = series[i];
				if (serie.options.stacking) {
					serie.isDirty = true;
				}
			}
		}
			
		// handle updated data in the series		
		each (series, function(serie) {
			if (serie.isDirty) { // prepare the data so axis can read it
				serie.cleanData();
				serie.getSegments();
				
				if (serie.options.legendType == 'point') {
					redrawLegend = true;
				}
			}
		});
		
		// reset maxTicks
		maxTicks = null;
		
		if (hasCartesianSeries) {
			// set axes scales
			each (axes, function(axis) {
				axis.setScale();
			});
			adjustTickAmounts();
	
			// redraw axes
			each (axes, function(axis) {
				if (axis.isDirty) { axis.redraw(); }
			});
		}
		
		// redraw affected series
		each (series, function(serie) {
			if (serie.isDirty && serie.visible) { 
				serie.redraw();
			}
		});
		
		// handle added or removed series 
		if (redrawLegend && legend.renderLegend) { // series or pie points are added or removed
			// draw legend graphics
			legend.renderLegend();
			
			chart.isDirty = false;
		}

		// hide tooltip and hover states
		if (tracker && tracker.resetTracker) {
			tracker.resetTracker();
		}			
		
		
		// fire the event
		fireEvent(chart, 'redraw');
	}
	
	
	
	/**
	 * Dim the chart and show a loading text or symbol
	 */
	function showLoading() {
		var loadingOptions = options.loading;

		// create the layer at the first call
		if (!loadingLayer) {
			loadingLayer = createElement(DIV, {
				className: 'highcharts-loading'
			}, extend(loadingOptions.style, {
				left: plotLeft + PX,
				top: plotTop + PX,
				width: plotWidth + PX,
				height: plotHeight + PX,
				zIndex: 10,
				display: NONE
			}), container);
			
			createElement('span', {
				innerHTML: options.lang.loading
			}, loadingOptions.labelStyle, loadingLayer);
		}
		
		
		// show it
		css(loadingLayer, { opacity: 0, display: '' });
		animate(loadingLayer, {
			opacity: loadingOptions.style.opacity
		}, {
			duration: loadingOptions.showDuration
		});
	}
	/**
	 * Hide the loading layer
	 */
	function hideLoading() {
		animate(loadingLayer, {
			opacity: 0
		}, {
			duration: options.loading.hideDuration, 
			complete: function() {
				css(loadingLayer, { display: NONE });
			}
		});

	}
	
	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	function get(id) {
		var i,
			j,
			//match,
			data;
		
		// search axes
		for (i = 0; i < axes.length; i++) {
			if (axes[i].options.id == id) {
				return axes[i];
			}
		}
		
		// search series
		for (i = 0; i < series.length; i++) {
			if (series[i].options.id == id) {
				return series[i];
			}
		}
		
		// search points
		for (i = 0; i < series.length; i++) {
			data = series[i].data;
			for (j = 0; j < data.length; j++) {
				if (data[j].id == id) {
					return data[j];
				}
			}
		}
		return null;	
	}
	
	/**
	 * Update the chart's position after it has been moved, to match
	 * the mouse positions with the chart
	 */
	function updatePosition() {
		var container = doc.getElementById(containerId);
		if (container) {
			position = getPosition(container);
		}
	}
	
	/** 
	 * Create the Axis instances based on the config options
	 */
	function getAxes() {
		var xAxisOptions = options.xAxis || {},
			yAxisOptions = options.yAxis || {},
			axis;
			
		// make sure the options are arrays and add some members
		xAxisOptions = splat(xAxisOptions);
		each(xAxisOptions, function(axis, i) {
			axis.index = i; 
			axis.isX = true;
		});
		
		yAxisOptions = splat(yAxisOptions);
		each(yAxisOptions, function(axis, i) {
			axis.index = i;
		});
		
		// concatenate all axis options into one array
		axes = xAxisOptions.concat(yAxisOptions);
		
		// loop the options and construct axis objects
		chart.xAxis = [];
		chart.yAxis = [];
		axes = map (axes, function(axisOptions) {
			axis = new Axis(chart, axisOptions);
			chart[axis.isXAxis ? 'xAxis' : 'yAxis'].push(axis);
			
			return axis;
		});
		
		adjustTickAmounts();	
	}

	
	/**
	 * Get the currently selected points from all series
	 */
	function getSelectedPoints() {
		var points = [];
		each(series, function(serie) {
			points = points.concat( grep( serie.data, function(point) {
				return point.selected;
			}));
		});
		return points;
	}
	
	/**
	 * Get the currently selected series
	 */
	function getSelectedSeries() {
		return grep (series, function (serie) {
			return serie.selected;
		});
	}
	
	/**
	 * Zoom out to 1:1
	 */
	zoomOut = function () {
		//zoom(false);
		fireEvent(chart, 'selection', { resetSelection: true }, zoom);
		chart.toolbar.remove('zoom');

	};
	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom = function (event) {
		
		// add button to reset selection
		var lang = defaultOptions.lang;
		chart.toolbar.add('zoom', lang.resetZoom, lang.resetZoomTitle, zoomOut);
		
		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(axes, function(axis) { 
				axis.setExtremes(null, null, false);
			});
		}
			
		// else, zoom in on all axes
		else {
			each (event.xAxis.concat(event.yAxis), function(axisData) {
				var axis = axisData.axis;
					
				// don't zoom more than maxZoom
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY']) {
					axis.setExtremes(axisData.min, axisData.max, false);
				}
			});
		}
		
		// redraw chart
		redraw();
		
	};
	
	/**
	 * Function: (private) showTitle
	 * 
	 * Show the title and subtitle of the chart
	 */
	function showTitle () {
		var title = options.title,
			titleAlign = title.align,
			subtitle = options.subtitle,
			subtitleAlign = subtitle.align,
			anchorMap = { // get the anchor relative to the alignment
				left: 0,
				center: chartWidth / 2,
				right: chartWidth
			};
		
		/*if (title) {
			title.text = 'Highcharts 2.0 prerelease version. Not for production!';
		}*/
			
		if (!chart.titleLayer) {
			/*var titleLayer = new Layer('title-layer', container, null, {
				zIndex: 2
			});*/
			// title
			if (title && title.text) {
				renderer.text(//titleLayer.drawText(
					title.text, 
					anchorMap[titleAlign] + title.x,
					title.y, 
					title.style, 
					0,
					titleAlign
				).attr({
					'class': 'highcharts-title'
				}).add();
			}
			
			// subtitle
			if (subtitle && subtitle.text) {
				renderer.text(//titleLayer.drawText(
					subtitle.text, 
					anchorMap[subtitleAlign] + subtitle.x,
					subtitle.y, 
					subtitle.style, 
					0,
					subtitleAlign
				).attr({
					'class': 'highcharts-subtitle'
				}).add();
			}
			
			//chart.titleLayer = titleLayer;
		}
	}

	/**
	 * Break down alignment options like align, verticalAlign, x, y, 
	 * width and height to x and y relative to the chart.
	 * 
	 * @param {Object} alignmentOptions
	 * 
	 * @todo Use this in legend alignment
	 */
	getAlignment = function(alignmentOptions) {
		var align = alignmentOptions.align,
			vAlign = alignmentOptions.verticalAlign,
			optionsX = alignmentOptions.x || 0,
			optionsY = alignmentOptions.y || 0,
			ret = {
				x: optionsX || 0, // default: left align
				y: optionsY || 0 // default: top align
			};
		// align
		if (/^(right|center)$/.test(align)) {
			ret.x = (chartWidth - alignmentOptions.width) /
				{ right: 1, center: 2 }[align] +
				optionsX;			
		}
		// vertical align
		if (/^(bottom|middle)$/.test(vAlign)) {
			ret.y = (chartHeight - alignmentOptions.height) /
				{ bottom: 1, middle: 2 }[vAlign] +
				optionsY;			
		}
		
		
		return ret;
	};
	
	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	function getContainer() {
		renderTo = optionsChart.renderTo;
		containerId = PREFIX + idCounter++;
	
		if (typeof renderTo == 'string') {
			renderTo = doc.getElementById(renderTo);
		}
	
		// remove previous chart
		renderTo.innerHTML = '';
		
		// If the container doesn't have an offsetWidth, it has or is a child of a node
		// that has display:none. We need to temporarily move it out to a visible
		// state to determine the size, else the legend and tooltips won't render
		// properly 
		if (!renderTo.offsetWidth) {
			renderToClone = renderTo.cloneNode(0);
			css(renderToClone, {
				position: ABSOLUTE,
				top: '-9999px',
				display: ''
			});
			doc.body.appendChild(renderToClone);
		}
		
		// get the width and height
		var renderToOffsetHeight = (renderToClone || renderTo).offsetHeight;
		chartWidth = optionsChart.width || (renderToClone || renderTo).offsetWidth || 600;
		chartHeight = optionsChart.height || 
			// the offsetHeight of an empty container is 0 in standard browsers, but 19 in IE7:
			(renderToOffsetHeight > plotTop + marginBottom ? renderToOffsetHeight : 0) || 
			400;
		
		// create the inner container
		container = createElement(DIV, {
				className: 'highcharts-container' + 
					(optionsChart.className ? ' '+ optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				overflow: HIDDEN,
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left'
			}, optionsChart.style),
			renderToClone || renderTo
		);
		
		// Todo: detection of SVG support in IE9
		chart.renderer = renderer = 
			optionsChart.renderer == 'SVG' ? // force SVG 
				new SVGRenderer(container, chartWidth, chartHeight) : 
				new Renderer(container, chartWidth, chartHeight);
		//renderer.init(container, chartWidth, chartHeight);
	}
	/**
	 * Render all graphics for the chart
	 */
	function render () {
		var mgn, 
			//div, 
			//i, 
			labels = options.labels, 
			credits = options.credits,
			chartBorderWidth = optionsChart.borderWidth || 0,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage;
		
		
		// Chart area
		mgn = 2 * chartBorderWidth + (optionsChart.shadow ? 8 : 0);
		/*backgroundLayer.drawRect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn, 
			optionsChart.borderColor, optionsChart.borderWidth, optionsChart.borderRadius, 
			optionsChart.backgroundColor, optionsChart.shadow);*/
			
		if (chartBorderWidth || chartBackgroundColor) {
			renderer.rect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn, 
					optionsChart.borderRadius, chartBorderWidth).
				attr({ 
					stroke: optionsChart.borderColor,
					'stroke-width': chartBorderWidth,
					fill: chartBackgroundColor || NONE
				}).
				add().
				shadow(optionsChart.shadow);
		}
		
		
		// Plot background
		/*backgroundLayer.drawRect(
			plotLeft, 
			plotTop, 
			plotWidth, 
			plotHeight, 
			null, 
			null, 
			null, 
			optionsChart.plotBackgroundColor, 
			null, 
			plotBackground
		);*/
		if (plotBackgroundColor) {
			renderer.rect(plotLeft, plotTop, plotWidth,	plotHeight,	0)
				.attr({
					fill: plotBackgroundColor
				})
				.add()
				.shadow(optionsChart.plotShadow);
		}
		if (plotBackgroundImage) {
			renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight)
				.add();
		}
		
		// Plot area border
		/*(new Layer('plot-border', container, null, {
			zIndex: 4 // in front of grid lines and graphs, behind axis lines
		})).drawRect(
			plotLeft, 
			plotTop, 
			plotWidth, 
			plotHeight, 
			optionsChart.plotBorderColor, 
			optionsChart.plotBorderWidth, 
			null, 
			null, 
			optionsChart.plotShadow
		);*/
		if (optionsChart.plotBorderWidth) {
			renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0, optionsChart.plotBorderWidth).
				attr({
					'class': 'plot-border',
					stroke: optionsChart.plotBorderColor,
					'stroke-width': optionsChart.plotBorderWidth
				}).add(null, 4);
		}
		
		// Add plot area clipping rectangle
		chart.clipRect = renderer.clipRect(0, 0, plotSizeX,	plotSizeY);
				
		// Printing CSS for IE
		/*if (isIE) {
			addCSSRule('.highcharts-image-map', { display: NONE }, 'print');
		}*/
		
		
		// Axes
		if (hasCartesianSeries) {
			each(axes, function(axis) { 
				axis.render();
			});
		}
	
		// Title
		showTitle();
		
		
		// Labels
		if (labels.items) {
			each (labels.items, function () {
				//console.log(labels.style);
				var style = extend (labels.style, this.style),
					x = parseInt(style.left, 10) + plotLeft,
					y = parseInt(style.top, 10) + plotTop + 12;
				
				// delete to prevent rewriting in IE
				delete style.left;
				delete style.top;
				
				renderer.text(
					this.html,
					x,
					y,
					style
				).add(null, 2);
					
			});
		}

		// The series
		each (series, function(serie) {
			serie.render();
		});
		
		// Legend
		legend = chart.legend = new Legend(chart);

		
		// Toolbar (don't redraw)
		if (!chart.toolbar) {
			chart.toolbar = Toolbar(chart);
		}
		
		// Credits
		if (credits.enabled && !chart.credits) {
			// todo: svg 
			/*chart.credits = createElement('a', {
				className: 'highcharts-credits',
				href: credits.href,
				innerHTML: credits.text,
				target: credits.target
			}, extend(credits.style, {
				zIndex: 8
			}), container);*/
			renderer.text(
				credits.text,
				chartWidth - 5,
				chartHeight - 5,
				credits.style,
				0,
				'right'
			)
			.on('click', function() {
				location.href = credits.href;
			})
			.add(null, 8); 
		}

		// Set flag
		chart.hasRendered = true;
		
		// If the chart was rendered outside the top container, put it back in
		if (renderToClone) {
			renderTo.appendChild(container);
			discardElement(renderToClone);
			updatePosition(container);
		}
	}
	
	/**
	 * Clean up memory usage
	 */
	function destroy() {
		var i = series.length;

		// remove events
		removeEvent(win, 'resize', updatePosition);
		removeEvent(win, 'unload', destroy);
		removeEvent(chart);
		
		each (axes, function(axis) {
			removeEvent(axis);
		});

		// destroy each series
		while (i--) {
			series[i].destroy();
		}
		
		//trackerGroup.destroy();
		
		/*each (axes, function(axis) {
			axis.destroy();
		});*/
		
		/*legend.destroy();
		
		tooltip.destroy();
		tracker.destroy();
		
		renderer.destroy();*/
		
		// remove all SVG
		container.innerHTML = '';
		
		// IE6 leak 
		container =	null;
			
		// memory and CPU leak
		clearInterval(tooltipInterval);
		
		for (i in chart) {
			delete chart[i];
		}
	}
	/**
	 * Prepare for first rendering after all data are loaded
	 */
	function firstRender() {
		
		getAxes();
		
		
		// Prepare for the axis sizes
		each(series, function(serie) {
			serie.translate();
			serie.setTooltipPoints();
		});	
		
		chart.render = render;
		
		render();
		fireEvent(chart, 'load');
	}
	
	
		
	getContainer();
	updatePosition(container);
	
		
	// Set to zero for each new chart
	colorCounter = 0;
	symbolCounter = 0;
	
	// Update position on resize and scroll
	addEvent(win, 'resize', updatePosition);
	
	// Destroy the chart and free up memory. 
	addEvent(win, 'unload', destroy);
	
	// Chart event handlers
	if (chartEvents) {
		for (eventType in chartEvents) { 
			addEvent(chart, eventType, chartEvents[eventType]);
		}
	}
	
	// Chart member functions
	/*chart.addLoading = function (loadingId) {
		chart.resources[loadingId] = false;
	};
	chart.clearLoading = function (loadingId) {
		chart.resources[loadingId] = true;
		checkResources();
	};*/
	
	
	
	chart.options = options;
	chart.series = series;
	chart.container = container;
	
	//chart.resources = {};
	
	chart.chartWidth = chartWidth;
	chart.chartHeight = chartHeight;
	
	chart.plotWidth = plotWidth = chartWidth - plotLeft - marginRight;
	chart.plotHeight = plotHeight = chartHeight - plotTop - marginBottom;
	
	chart.plotLeft = plotLeft;
	chart.plotTop = plotTop;
	
	
	
	// API methods
	chart.addSeries = addSeries;
	chart.destroy = destroy;
	chart.get = get;
	chart.getAlignment = getAlignment;
	chart.getSelectedPoints = getSelectedPoints;
	chart.getSelectedSeries = getSelectedSeries;
	chart.hideLoading = hideLoading;
	chart.isInsidePlot = isInsidePlot;
	chart.redraw = redraw;
	chart.showLoading = showLoading;	
	chart.updatePosition = updatePosition;
	
	/*chart.plotLayer = plotLayer = new Layer('plot', container, null, {
		position: ABSOLUTE,
		width: plotWidth + PX,
		height: plotHeight + PX,
		left: plotLeft + PX,
		top: plotTop + PX,
		overflow: HIDDEN,
		zIndex: 3
	});*/
	
	
	// Wait for loading of plot area background
	/*if (optionsChart.plotBackgroundImage) {
		chart.addLoading('plotBack');
		plotBackground = createElement('img');
		plotBackground.onload = function() {
			chart.clearLoading('plotBack');
		};
		plotBackground.src = optionsChart.plotBackgroundImage;
	}*/
	
	// Initialize the series
	//initSeries();
	each (options.series || [], function(serieOptions) {
		initSeries(serieOptions);
	});
	
	// Set the common inversion and transformation for inverted series after initSeries
	chart.inverted = inverted = pick(inverted, options.chart.inverted);
	chart.plotSizeX = plotSizeX = inverted ? plotHeight : plotWidth;
	chart.plotSizeY = plotSizeY = inverted ? plotWidth : plotHeight; 
	
	// depends on inverted	
	chart.tracker = tracker = new MouseTracker(chart, options.tooltip);
		
	firstRender();
}

/**
 * The Point object and prototype. Inheritable and used as base for PiePoint
 */
var Point = function() {};
Point.prototype = {

	/**
	 * Initialize the point
	 * @param {Object} series The series object containing this point
	 * @param {Object} options The data in either number, array or object format
	 */
	init: function(series, options) {
		var point = this,
			defaultColors;
		point.series = series;
		point.applyOptions(options);
		point.pointAttr = {};
		
		if (series.options.colorByPoint) {
			defaultColors = defaultOptions.colors;
			if (!point.options) {
				point.options = {};
			}
			point.color = point.options.color = point.color || defaultColors[colorCounter++];
			
			// loop back to zero
			if (colorCounter >= defaultColors.length) {
				colorCounter = 0;
			}
		}
		
		return point;
	},
	/**
	 * Apply the options containing the x and y data and possible some extra properties.
	 * This is called on point init or from point.update.
	 * 
	 * @param {Object} options
	 */
	applyOptions: function(options) {
		var point = this,
			series = point.series;
			//n;
	
		
		// onedimensional array input
		if (typeof options == 'number' || options === null) {
			//point.x = i;
			point.y = options;	
		}
		
		// object input
		else if (typeof options == 'object' && typeof options.length != 'number') {
			
			// copy options directly to point
			//for (n in options) point[n] = options[n];
			extend(point, options);
			
			point.options = options;
			// set x and y
			//point.x = options.x;
			//point.y = options.y;
		}
		
		// categorized data with name in first position
		else if (typeof options[0] == 'string') {
			point.name = options[0];
			//point.x = i;
			point.y = options[1];
		}
		
		// two-dimentional array
		else if (typeof options[0] ==  'number') {
			point.x = options[0];
			point.y = options[1];
		}
		
		/* 
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		if (point.x === UNDEFINED) {
			point.x = series.autoIncrement();
		}
	},
	
	/**
	 * Destroy a point to clear memory. Its reference still stays in series.data.
	 */
	destroy: function() {
		var point = this,
			prop;
			
		// remove all events
		removeEvent(point);
		
		
		each (['graphic', 'tracker', 'group'], function(prop) {
			if (point[prop]) {
				point[prop].destroy();
			}
		});
		
		
		if (point.legendItem) { // pies have legend items
			point.series.chart.legend.destroyItem(point);
		}
		
		for (prop in point) {
			point[prop] = null;
		}
		
	},	
	
	/**
	 * Toggle the selection status of a point
	 * @param {Boolean} selected Whether to select or unselect the point.
	 * @param {Boolean} accumulate Whether to add to the previous selection. By default,
	 *     this happens if the control key (Cmd on Mac) was pressed during clicking.
	 */
	select: function(selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart;
			//stateLayers,
			//state;
			//singlePointLayer = pick(point.stateLayer, series.singlePointLayer, chart.singlePointLayer);
			
		//point.selected = !point.selected;
		// if called without an argument, toggle
		//series.selected = selected = (selected === UNDEFINED) ? !series.selected : selected;
		point.selected = selected = pick(selected, !point.selected);
		
		//series.isDirty = true;
		point.firePointEvent(selected ? 'select' : 'unselect');
		
		series.setPointState(point, 'select');
		// remove the hover marker so the user can see the underlying marker changes to selected
		/*if (singlePointLayer) {
			singlePointLayer.clear();
		}*/
		
		// unselect all other points unless Ctrl or Cmd + click
		if (!accumulate) {
			each (chart.getSelectedPoints(), function (loopPoint) {
				if (loopPoint.selected && loopPoint != point) {
					loopPoint.selected = false;
					loopPoint.series.setPointState(loopPoint, NORMAL_STATE);
					fireEvent(loopPoint, 'unselect');
				}
			});
		}
		
	},
	

	
	/**
	 * Update the point with new options (typically x/y data) and optionally redraw the series.
	 * 
	 * @param {Object} options Point options as defined in the series.data array
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * 
	 */
	update: function(options, redraw) {
		var point = this,
			series = point.series;
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of doing the update
		point.firePointEvent('update', { options: options }, function() {

			point.applyOptions(options);
	
			// redraw
			series.isDirty = true;
			if (redraw) {
				series.chart.redraw();
			}
		});
	},
	
	/**
	 * Remove a point and optionally redraw the series and if necessary the axes
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 */
	remove: function(redraw) {
		var point = this,
			series = point.series,
			chart = series.chart,
			data = series.data,
			i,
			dataLength = data.length;
		
		redraw = pick(redraw, true);
		
		// fire the event with a default handler of removing the point			
		point.firePointEvent('remove', null, function() {

			// loop through the data to locate the point and remove it
			
			//each(data, function(existingPoint, i) {
			for (i = 0; i < dataLength - 1; i++) {
				
				if (data[i] == point) {
					data.splice(i, 1);
				}
				break;
			}
			
			point.destroy();
			
			
			
			// redraw
			series.isDirty = true;
			if (redraw) {
				chart.redraw();
			}
		});
			
		
	},
	
	/**
	 * Fire an event on the Point object. Must not be renamed to fireEvent, as this
	 * causes a name clash in MooTools
	 * @param {String} eventType
	 * @param {Object} eventArgs Additional event arguments
	 * @param {Function} defaultFunction Default event handler
	 */
	firePointEvent: function(eventType, eventArgs, defaultFunction) {
		var point = this,
			series = this.series,
			seriesOptions = series.options;
		
		// load event handlers on demand to save time on mouseover/out
		if (seriesOptions.point.events[eventType] || (
				point.options && point.options.events && point.options.events[eventType])) {
			this.importEvents();
		}
			
		// add default handler if in selection mode
		if (eventType == 'click' && seriesOptions.allowPointSelect) {
			defaultFunction = function (event) {
				// Control key is for Windows, meta (= Cmd key) for Mac, Shift for Opera
				point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
			};
		}
			
		fireEvent(this, eventType, eventArgs, defaultFunction);
	},
	/**
	 * Import events from the series' and point's options. Only do it on 
	 * demand, to save processing time on hovering.
	 */
	importEvents: function() {
		if (!this.hasImportedEvents) {
			var point = this,
				options = merge (point.series.options.point, point.options),
				events = options.events,
				eventType;
				
			point.events = events;
			
			for (eventType in events) {
				addEvent(point, eventType, events[eventType]);
			}
			this.hasImportedEvents = true;
		}
	},
	
	setTooltipText: function() {
		var point = this;
		point.tooltipText = point.series.chart.options.tooltip.formatter.call({
			series: point.series,
			point: point,
			x: point.category, 
			y: point.y,
			percentage: point.percentage,
			total: point.total || point.stackTotal
		});
	}	
};

/**
 * The base function which all other series types inherit from
 * @param {Object} chart
 * @param {Object} options
 */
var Series = function() {};

Series.prototype = {
	
	isCartesian: true,
	type: 'line',
	pointClass: Point,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'lineColor',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		r: 'radius'
	},
	init: function(chart, options) {
		var series = this,
			eventType,
			events,
			//pointEvent,
			index = chart.series.length;
			
		series.chart = chart;
		options = series.setOptions(options); // merge with plotOptions
		
		// set some variables
		extend (series, {
			index: index,
			options: options,
			name: options.name || 'Series '+ (index + 1),
			state: NORMAL_STATE,
			pointAttr: {},
			visible: options.visible !== false, // true by default
			selected: options.selected === true // false by default
		});
		
		// register event listeners
		events = options.events;
		for (eventType in events) {
			addEvent(series, eventType, events[eventType]);
		}
		
		series.getColor();
		series.getSymbol();
		
		// set the data
		series.setData(options.data, false);
			
	},
	/*getData: function(options) {
		var series = this,
			chart = series.chart,
			loadingId = 'series'+ idCounter++;
		
		// Ajax loaded data
		if (!options.data && options.dataURL) {
			chart.addLoading(loadingId);
			getAjax(options.dataURL, function(data) {
				series.dataLoaded(data);
				chart.clearLoading(loadingId);
			});
		} else {
			series.dataLoaded(options.data);
		}
	},
	//dataLoaded: function(data) {
	getData: function(options) {
		var series = this,
			chart = series.chart,
			options = series.options,
			data = options.data,
			enabledStates = [NORMAL_STATE],
			//data = series.data,
			//dataParser = options.dataParser,
			stateLayers = {},
			layerGroup,
			point,
			//pointInterval = options.pointInterval || 1,
			x;
		
		// if no dataParser is defined for ajax loaded data, assume JSON and eval the code
		/ *if (options.dataURL && !dataParser) { 
			dataParser = function(data){
				return eval(data);
			};
		}
		// dataParser is defined, run parsing
		if (dataParser) {
			data = dataParser.call(series, data);
		}* /
		
		
		// create the group layer (TODO: move to render?)
		/ *series.layerGroup = layerGroup = new Layer('series-group', chart.plotLayer.div, null, {
			zIndex: 2 // labels are underneath
		});* /
		
		/ *if (options.states.hover.enabled) enabledStates.push(HOVER_STATE);
		each(enabledStates, function(state) { // create the state layers
			stateLayers[state] = new Layer('state-'+ state, layerGroup.div);
		});
		series.stateLayers = stateLayers;* /
		
		series.setData(data, false);
	
	},*/
	
	/**
	 * Return an auto incremented x value based on the pointStart and pointInterval options. 
	 * This is only used if an x value is not given for the point that calls autoIncrement.
	 */
	autoIncrement: function() {
		var series = this,
			options = series.options,
			xIncrement = series.xIncrement;
			
		xIncrement = pick(xIncrement, options.pointStart, 0);
		
		series.pointInterval = pick(series.pointInterval, options.pointInterval, 1);
		
		series.xIncrement = xIncrement + series.pointInterval;
		return xIncrement;
	},
	
	/**
	 * Sort the data and remove duplicates
	 * 
	 * @todo: For reversed x axis, reverse the data once and for all here
	 */
	cleanData: function() {
		var series = this,
			data = series.data,
			i;
			//smallestInterval,
			//closestPoints,
			//interval;
			
		// sort the data points
		data.sort(function(a, b){
			return (a.x - b.x);
		});
		
		// remove points with equal x values
		// record the closest distance for calculation of column widths
		for (i = data.length - 1; i >= 0; i--) {
			if (data[i - 1]) {
				if (data[i - 1].x == data[i].x)	{
					data.splice(i - 1, 1); // remove the duplicate
				}
				
				/*interval = data[i].x - data[i - 1].x
				if (smallestInterval === UNDEFINED || interval < smallestInterval) {
					smallestInterval = interval;
					closestPoints = i;	
				}*/
			}
		}
		//series.closestPoints = closestPoints;
	},		
		
	/**
	 * Divide the series data into segments divided by null values. Also sort
	 * the data points and delete duplicate values.
	 */
	getSegments: function() {
		var lastNull = -1,
			segments = [],
			data = this.data;
		
		// create the segments
		each (data, function(point, i) {
			if (point.y === null) {
				if (i > lastNull + 1) {
					segments.push(data.slice(lastNull + 1, i));
				}
				lastNull = i;	
			} else if (i == data.length - 1) { // last value
				segments.push(data.slice(lastNull + 1, i + 1));
			}
		});
		this.segments = segments;
		
		
	},
	/**
	 * Set the series options by merging from the options tree
	 * @param {Object} itemOptions
	 */
	setOptions: function(itemOptions) {
		var plotOptions = this.chart.options.plotOptions,
			options = merge(
				plotOptions[this.type], 
				plotOptions.series,
				itemOptions
			);
		
		return options;
		
	},
	getColor: function(){
		var defaultColors = this.chart.options.colors;
		this.color = this.options.color || defaultColors[colorCounter++] || '#0000ff';
		if (colorCounter >= defaultColors.length) {
			colorCounter = 0;
		}
	},
	getSymbol: function(){
		var defaultSymbols = this.chart.options.symbols,
			symbol = this.options.marker.symbol || defaultSymbols[symbolCounter++];
		this.symbol = symbol;
		if (symbolCounter >= defaultSymbols.length) { 
			symbolCounter = 0;
		}
	},
	
	/**
	 * Add a point dynamically after chart load time
	 * @param {Object} options Point options as given in series.data
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean} shift If shift is true, a point is shifted off the start 
	 *    of the series as one is appended to the end.
	 */
	addPoint: function(options, redraw, shift) {
		var series = this,
			data = series.data,
			point = (new series.pointClass()).init(series, options);
			
		redraw = pick(redraw, true);
			
		data.push(point);
		if (shift) {
			data[0].remove(false);
		}
		
		
		// redraw
		series.isDirty = true;
		if (redraw) {
			series.chart.redraw();
		}
	},
	
	/**
	 * Replace the series data with a new set of data
	 * @param {Object} data
	 * @param {Object} redraw
	 */
	setData: function(data, redraw) {
		var series = this,
			oldData = series.data,
			i = oldData && oldData.length || 0;
		
		series.xIncrement = null; // reset for new data
		data = map(splat(data), function(pointOptions) {
			return (new series.pointClass()).init(series, pointOptions);
		});
		
		// destroy old points
		while (i--) {
			oldData[i].destroy();
		}
		
		// set the data
		series.data = data;
	
		series.cleanData();	
		series.getSegments();
		
		// redraw
		series.isDirty = true;
		if (pick(redraw, true)) {
			series.chart.redraw();
		}
	},
	
	/**
	 * Remove a series and optionally redraw the chart
	 * 
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 */
	
	remove: function(redraw) {
		var series = this,
			chart = series.chart;
			
		redraw = pick(redraw, true);
		
		if (!series.isRemoving) {  /* prevent triggering native event in jQuery
				(calling the remove function from the remove event) */ 
			series.isRemoving = true;

			// fire the event with a default handler of removing the point			
			fireEvent(series, 'remove', null, function() {
				
						
				// destroy elements
				series.destroy();
			
				
				// redraw
				chart.isDirty = true;
				if (redraw) {
					chart.redraw();
				}
			});
			
		} 
		series.isRemoving = false;
	},
	
	/**
	 * Translate data points from raw data values to chart specific positioning data
	 * needed later in drawPoints, drawGraph and drawTracker. 
	 */
	translate: function() {
		var series = this, 
			chart = series.chart, 
			stacking = series.options.stacking,
			categories = series.xAxis.categories,
			yAxis = series.yAxis,
			stack = yAxis.stacks[series.type],
			data = series.data,
			i = data.length;
			
		// do the translation
		while (i--) {
			var point = data[i],
				xValue = point.x, 
				yValue = point.y, 
				yBottom, 
				pointStack,
				pointStackTotal;
			point.plotX = series.xAxis.translate(xValue);
			
			// calculate the bottom y value for stacked series
			if (stacking && series.visible && stack[xValue]) {
				pointStack = stack[xValue];
				pointStackTotal = pointStack.total;
				pointStack.cum = yBottom = pointStack.cum - yValue; // start from top
				yValue = yBottom + yValue;
				
				if (stacking == 'percent') {
					yBottom = pointStackTotal ? yBottom * 100 / pointStackTotal : 0;
					yValue = pointStackTotal ? yValue * 100 / pointStackTotal : 0;
				}
				point.percentage = pointStackTotal ? point.y * 100 / pointStackTotal : 0;
				point.stackTotal = pointStackTotal;
				point.yBottom = yAxis.translate(yBottom, 0, 1);				
			}
			
			// set the y value
			if (yValue !== null) {
				point.plotY = yAxis.translate(yValue, 0, 1);
			}
			
			// set client related positions for mouse tracking
			point.clientX = chart.inverted ? 
				chart.plotHeight - point.plotX : 
				point.plotX; // for mouse tracking
				
			// some API data 
			// todo: move this to point.init?
			point.category = categories && categories[point.x] !== UNDEFINED ? 
				categories[point.x] : point.x;
				
		}
	},
	/**
	 * Memoize tooltip texts and positions
	 */
	setTooltipPoints: function (renew) {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			//concatenated = [],
			data = [],
			plotSize = (inverted ? chart.plotTop : chart.plotLeft) + chart.plotSizeX,
			low,
			high,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension
			
		// renew
		if (renew) {
			series.tooltipPoints = null;
		}
			
		// concat segments to overcome null values
		each (series.segments, function(segment){
			data = data.concat(segment);
		});
		
		// loop the concatenated data and apply each point to all the closest
		// pixel positions
		if (series.xAxis && series.xAxis.reversed) {
			data = data.reverse();//reverseArray(data);
		}
		each (data, function(point, i) {
			
			
			if (!series.tooltipPoints) { // only create the text the first time, not on zoom
				point.setTooltipText();
			}
			
			low = data[i - 1] ? data [i - 1].high + 1 : 0;
			high = point.high = data[i + 1] ? (
				mathFloor((point.plotX + (data[i + 1] ? 
					data[i + 1].plotX : plotSize)) / 2)) :
					plotSize;
			
			while (low <= high) {
				tooltipPoints[inverted ? plotSize - low++ : low++] = point;
			}
		});
		series.tooltipPoints = tooltipPoints;
	},
	
	

	
	/**
	 * Both tracker.toFront() and series.setState(HOVER_STATE) slow down animation
	 */
	onMouseOver: function() {
		var series = this,
			chart = series.chart,
			hoverSeries = chart.hoverSeries,
			stateMarkerGraphic = series.stateMarkerGraphic;
			
		if (chart.mouseIsDown) {
			return;
		}
		
		if (stateMarkerGraphic) {
			stateMarkerGraphic.show();
		}
		
		
		// trigger the event, but to save processing time, 
		// only if defined
		if (series.options.events.mouseOver) { 
			fireEvent(series, 'mouseOver', {
				point:  chart.hoverPoint
			});
		}
		// set normal state to previous series
		if (hoverSeries && hoverSeries != series) {
			hoverSeries.setState();
		}
		
		// bring to front
		// Todo: optimize. This is one of two operations slowing down the tooltip in Firefox.
		// Can the tracking be done otherwise?
		if (series.tracker) {
			series.tracker.toFront();
		}
		
		// hover this
		series.setState(HOVER_STATE);
		chart.hoverSeries = series;
		
	},
	onMouseOut: function() {
		// trigger the event only if listeners exist
		var series = this,
			hoverSeries = series.chart.hoverSeries;
		if (hoverSeries && series.options.events.mouseOut) { 
			fireEvent(hoverSeries, 'mouseOut');
		}
	},
	
	/**
	 * Experimental animation
	 */
	animate: function(init) {
		var series = this,
			//line = series.graph,
			chart = series.chart,
			clipRect = chart.clipRect;/*,
			div = series.layerGroup.div*/
		if (series.visible) {
			if (init) { // initialize the animation
				if (!clipRect.isAnimating) { // apply it only for one of the series
					clipRect.attr( 'width', 0 );
					clipRect.isAnimating = true;
				}
				
			} else { // run the animation
				
				clipRect.animate({ 
					width: chart.plotSizeX 
				}, {
					complete: function() {
						clipRect.isAnimating = false;
					}, 
					duration: 1000
				});
		
				// delete this function to allow it only once
				this.animate = null;
			}
		}
	},
	
	/**
	 * Draw the markers
	 */
	drawPoints: function(){
		var series = this,
			pointAttr,
			data = series.data, 
			chart = series.chart,
			plotX,
			plotY,
			i,
			point,
			radius,
			graphic;
		
		if (series.options.marker.enabled) {
			i = data.length;
			while (i--) {
				point = data[i];
				plotX = point.plotX;
				plotY = point.plotY;
				graphic = point.graphic;
				
				// only draw the point if y is defined
				if (point.plotY !== UNDEFINED) {
				
					/* && removed this code because points stayed after zoom
						point.plotX >= 0 && point.plotX <= chart.plotSizeX &&
						point.plotY >= 0 && point.plotY <= chart.plotSizeY*/
					
					// shortcuts
					pointAttr = point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE];
					radius = pointAttr.r;
					
					
					if (graphic) { // update
						graphic.attr({
							x: plotX,
							y: plotY,
							r: radius
						});
					} else {
						point.graphic = chart.renderer.symbol(
							pick(point.marker && point.marker.symbol, series.symbol),
							plotX,
							plotY, 
							radius
						)
						.attr(pointAttr)
						.add(series.group);
					}
				}
			}
		}
		
	},
	
	/**
	 * Convert state properties from API naming conventions to SVG attributes
	 * 
	 * @param {Object} options API options object
	 * @param {Object} base1 SVG attribute object to inherit from
	 * @param {Object} base2 Second level SVG attribute object to inherit from
	 */
	convertAttribs: function(options, base1, base2, base3) {
		var conversion = this.pointAttrToOptions,
			attr,
			option,
			obj = {};
		
		options = options || {};
		base1 = base1 || {};
		base2 = base2 || {};
		base3 = base3 || {};
		
		for (attr in conversion) {
			option = conversion[attr];
			obj[attr] = pick(options[option], base1[attr], base2[attr], base3[attr]);		 
		}
		return obj;
	},
	
	/**
	 * Get the state attributes. Each series type has its own set of attributes
	 * that are allowed to change on a point's state change. Series wide attributes are stored for
	 * all series, and additionally point specific attributes are stored for all 
	 * points with individual marker options. If such options are not defined for the point,
	 * a reference to the series wide attributes is stored in point.pointAttr.
	 */
	getAttribs: function() {
		var series = this, 
			normalOptions = series.options.marker || series.options,
			stateOptions = normalOptions.states,
			stateOptionsHover = stateOptions[HOVER_STATE],
			pointStateOptionsHover,
			normalDefaults = {},
			//hoverDefaults = {},
			//seriespointAttr = series.pointAttr,
			seriesColor = series.color,
			data = series.data,
			i,
			point,
			seriesPointAttr = [],
			pointAttr,
			pointAttrToOptions = series.pointAttrToOptions,
			hasPointSpecificOptions;
			//chart = series.chart;
			
		// series type specific modifications
		if (series.options.marker) { // line, spline, area, areaspline, scatter
			
			// if no color is given for the point, use the general series color
			normalDefaults = {
				stroke: seriesColor,
				fill: seriesColor
			};
			
			// if no hover radius is given, default to normal radius + 2  
			stateOptionsHover.radius = stateOptionsHover.radius || normalOptions.radius + 2;
			
		} else { // column, bar, pie
			
			// if no color is given for the point, use the general series color
			normalDefaults = {
				fill: seriesColor
			};
			
			// if no hover color is given, brighten the normal color
			stateOptionsHover.color = stateOptionsHover.color || 
				Color(stateOptionsHover.color || seriesColor)
					.brighten(stateOptionsHover.brightness).get();
		}
		
		// general point attributes for the series normal state
		seriesPointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, normalDefaults);
		
		// HOVER_STATE and SELECT_STATE states inherit from normal state except the default radius
		each([HOVER_STATE, SELECT_STATE], function(state) {
			seriesPointAttr[state] = series.convertAttribs(
				stateOptions[state],
				seriesPointAttr[NORMAL_STATE]
			);
		});
		
		
		// set it
		series.pointAttr = seriesPointAttr;
		
		
		// Generate the point-specific attribute collections if specific point
		// options are given. If not, create a referance to the series wide point 
		// attributes
		i = data.length;
		while (i--) {
			point = data[i];
			normalOptions = (point.options && point.options.marker) || point.options;
			hasPointSpecificOptions = false;
			
			// check if the point has specific visual options
			if (point.options) {
				for (var key in pointAttrToOptions) {
					if (normalOptions[pointAttrToOptions[key]]) {
						hasPointSpecificOptions = true;
					}
				}
			}
			
			
			
			// a specific marker config object is defined for the individual point:
			// create it's own attribute collection
			if (hasPointSpecificOptions) {

				pointAttr = [];
				stateOptions = normalOptions.states || {}; // reassign for individual point
				pointStateOptionsHover = stateOptions[HOVER_STATE] = stateOptions[HOVER_STATE] || {};
				
				// if no hover color is given, brighten the normal color
				if (!series.options.marker) { // column, bar, point
					pointStateOptionsHover.color = 
						Color(pointStateOptionsHover.color || point.options.color)
							.brighten(pointStateOptionsHover.brightness || 
								stateOptionsHover.brightness).get();
				
				}
				
				// normal point state inherits series wide normal state
				pointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, seriesPointAttr[NORMAL_STATE]);
									
				// inherit from point normal and series hover
				pointAttr[HOVER_STATE] = series.convertAttribs(
					stateOptions[HOVER_STATE],
					seriesPointAttr[HOVER_STATE],
					pointAttr[NORMAL_STATE]
				);
				// inherit from point normal and series hover
				pointAttr[SELECT_STATE] = series.convertAttribs(
					stateOptions[SELECT_STATE],
					seriesPointAttr[SELECT_STATE],
					pointAttr[NORMAL_STATE]
				);
				
				
				
			// no marker config object is created: copy a reference to the series-wide
			// attribute collection
			} else {
				pointAttr = seriesPointAttr;
			}
		
			point.pointAttr = pointAttr;

		}

	},
	
	/*
	 * Some config objects, like marker, have a state value that depends on the base value
	 * @param {Object} props
	 */
	/*getDynamicStateValues: function(base, state, props) {
	 each (props, function(value, key) {
	 if (state[key] === UNDEFINED) state[key] = base[key] + value;
	 });
	 return state;
	 },*/
	/*
	 * Draw a single marker into a given layer and position
	 */
	/*drawMarker: function(x, y, options, group) {
		var series = this,
			color = series.color,
			chart = series.chart;
			
		if (options.lineColor == 'auto') {
			options.lineColor = color;
		}
		if (options.fillColor == 'auto') { 
			options.fillColor = color;
		}
		if (options.symbol == 'auto') { 
			options.symbol = series.symbol;
		}
		
		
		
		return chart.renderer.symbol(options.symbol, x, y, options.radius).
			attr({
				stroke: options.lineColor,
				'stroke-width': options.lineWidth,
				fill: options.fillColor
			});//.
			//translate(chart.plotLeft, chart.plotTop).
			//add(group || series.group);
				
	},*/
	
	/**
	 * Clear DOM objects and free up memory
	 */
	destroy: function() {
		var series = this,
			chartSeries = series.chart.series,
			prop;
		
		// remove all events
		removeEvent(series);
			
		// remove legend items
		if (series.legendItem) {
			series.chart.legend.destroyItem(series);
		}
		
		// destroy all points with their elements
		each (series.data, function(point) {
			point.destroy();
		});
		
		// destroy all SVGElements associated to the series
		each(['area', 'graph', 'dataLabelsGroup', 'group', 'tracker'], function(prop) {
			if (series[prop]) {
				series[prop].destroy();
			}
		});
		
		// loop through the chart series to locate the series and remove it
		each(chartSeries, function(existingSeries, i) {
			if (existingSeries == series) {
				chartSeries.splice(i, 1);
			}
		});
				
		// clear all members
		for (prop in series) {
			delete series[prop];
		} 
	},
	
	/**
	 * Draw the data labels
	 */
	drawDataLabels: function(){
		if (this.options.dataLabels.enabled) {
			var series = this, 
				//i, 
				x, 
				y, 
				data = series.data, 
				options = series.options.dataLabels, 
				//color, 
				str, 
				dataLabelsGroup = series.dataLabelsGroup, 
				chart = series.chart, 
				inverted = chart.inverted,
				seriesType = series.type,
				//isPie = (seriesType == 'pie'),
				align;
				
			// create a separate group for the data labels to avoid rotation
			if (dataLabelsGroup) {
				dataLabelsGroup.empty();
			} else {
				dataLabelsGroup = series.dataLabelsGroup = 
					chart.renderer.g(PREFIX +'data-labels')
						.clip(chart.clipRect)
						.translate(chart.plotLeft, chart.plotTop)
						.add(null, 4);
			}
			
			/*series.dataLabelsLayer = dataLabelsLayer = new Layer('data-labels', 
				series.layerGroup.div, 
				null, {
					zIndex: 1
				});*/
				
			// determine the color
			//options.style.color = options.color == 'auto' ? series.color : options.color;
			options.style.color = pick(options.color, series.color);
			
			// make the labels for each point
			each(data, function(point){
				var plotX = pick(point.barX, point.plotX),
					plotY = point.plotY,
					tooltipPos = point.tooltipPos;
					
				str = options.formatter.call({
					x: point.x,
					y: point.y,
					series: series,
					point: point,
					percentage: point.percentage,
					total: point.total || point.stackTotal
				});
				x = (inverted ? chart.plotWidth - plotY : plotX) + options.x;
				y = (inverted ? chart.plotHeight - plotX : plotY) + options.y;
				
				// special case for pies
				if (tooltipPos) {
					x = tooltipPos[0] + options.x;
					y = tooltipPos[1] + options.y;
				}
				// in columns, align the string to the column
				align = options.align;
				if (seriesType == 'column') {
					x += {
						center: point.barW / 2,
						right: point.barW
					}[align] || 0;
				}
				
				//if (str) dataLabelsLayer[isPie ? 'drawText' : 'addText'](
				
				if (str) {
					point.dataLabel = chart.renderer.text(
						str, 
						x, 
						y, 
						options.style, 
						options.rotation, 
						align
					).add(point.group || dataLabelsGroup, 1); // pies and columns have point.group
				}
				
				if (series.drawConnector) {
					series.drawConnector(point);
				}
					
			});
			//if (!isPie) dataLabelsLayer.strokeText();
			
			// only draw once - todo: different labels in different states and single point label?
			//series.hasDrawnDataLabels = true;
		}
	},
	
	/**
	 * Draw the actual graph
	 */
	drawGraph: function(state) {
		var //i,
			series = this, 
			options = series.options, 
			chart = series.chart,
			graph = series.graph,
			//trackerRect = chart.trackerRect,
			//doAnimation = options.animation && series.animate,
			//layer = series.stateLayers[state], 
			graphPath = [],
			fillColor,
			area = series.area,
			//data = series.data,
			group = series.group,
			color = options.lineColor || series.color, 
				 
			//inverted = chart.inverted, 
			//plotLeft = chart.plotLeft,
			//plotTop = chart.plotTop,
			lineWidth = options.lineWidth,
			segmentPath,
			//transform = chart.transform,
			//inverted = chart.inverted,
			renderer = chart.renderer,
			//indexInSegment = 0,
			translatedY0 = series.yAxis.getZeroPlane(options.baseValue || 0),
			areaPath = [];
			
		
		// divide into segments and build graph and area paths
		each(series.segments, function(segment) {
			segmentPath = [];
			
			// build the segment line
			each(segment, function(point, i){
				
				// moveTo or lineTo
				if (i < 2) {
					segmentPath.push([M, L][i]);
				}
				
				// step line?
				if (i && options.step) {
					var lastPoint = segment[i - 1];
					segmentPath.push (
						point.plotX, 
						lastPoint.plotY						
					);
				}
				
				// normal line to next point
				segmentPath.push(
					point.plotX, 
					point.plotY
				);
			});
			graphPath = graphPath.concat(segmentPath);
			
			// build the area
			if (/area/.test(series.type)) {
				var areaSegmentPath = [],
					i,
					segLength = segmentPath.length;
				for (i = 0; i < segLength; i++) {
					areaSegmentPath.push(segmentPath[i]);
				}
				if (options.stacking && series.type != 'areaspline') {
					// follow stack back. Todo: implement areaspline
					for (i = segment.length - 1; i >= 0; i--) {
						areaSegmentPath.push(segment[i].plotX, segment[i].yBottom);
					}
				
				} else { // follow zero line back
					areaSegmentPath.push(
						segment[segment.length - 1].plotX, 
						translatedY0, 
						segment[0].plotX, 
						translatedY0,
						'z'
					);
				}
				areaPath = areaPath.concat(areaSegmentPath);
			}
		});

		// store it for use in area
		if (areaPath.length) {
			series.areaPath = areaPath;
		}
		series.graphPath = graphPath; // used in drawTracker

		
		

		// draw the graph
		if (graph) {
			graph.attr({ d: graphPath });
		} else {
			if (lineWidth) {
				series.graph = renderer.path(graphPath).
					attr({
						//'clip-path': 'url(#plotClip)',
						'stroke': color,
						'stroke-width': lineWidth + PX
						//, transform: transform
					}).add(group).shadow(options.shadow);
			}
		}

		
			
		// draw the area if area series or areaspline
		if (areaPath.length) {
			fillColor = pick(
				options.fillColor,
				Color(series.color).setOpacity(options.fillOpacity || 0.75).get()
			);
			if (area) {
				area.attr({ d: areaPath });
			
			} else {
				// draw the area
				series.area = series.chart.renderer.path(areaPath).
					attr({
						fill: fillColor
					}).add(series.group);
			}
		}
	},
	
	/**
	 * Draw a single point in a specific state
	 */
	setPointState: function(point, state) {
		var series = this,
			chart = series.chart,
			pointAttr = point.pointAttr;
			
		if (!state) {
			state = NORMAL_STATE;
		}
		
		// selected points don't respond to hover
		if (point.selected && state != SELECT_STATE) {
			return;
		}
		
		
		// if a graphic is not applied to each point in the normal state, create a shared
		// graphic for the hover state
		// todo: symbols
		if (state && !point.graphic) {
			if (!series.stateMarkerGraphic) {
				series.stateMarkerGraphic = chart.renderer.circle(
					0, 0, pointAttr[state].r
				)
				.attr(pointAttr[state])
				.add(series.group);
			}
			
			series.stateMarkerGraphic.translate(
				point.plotX, 
				point.plotY
			);
			
		// else, apply hover styles to the existing point
		} else {				
			point.graphic.attr(pointAttr[state]);
		}
		
		
	},
	
	/**
	 * Render the graph and markers
	 */
	render: function() {
		var series = this,
			chart = series.chart,
			group,
			doAnimation = series.options.animation && series.animate;
			//state;//, 
			//stateLayers = series.stateLayers;
			

		
			
		// the group
		if (!series.group) {
			group = series.group = chart.renderer.g('series');
				
			if (chart.inverted) {
				group.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				}).rotate(90).flip('x');
			} 
			group.clip(chart.clipRect)
				.translate(chart.plotLeft, chart.plotTop)
				.add(null, 3);
		}
			
		series.drawDataLabels();

		// initiate the animation
		if (doAnimation) {
			series.animate(true);
		}
		
		// cache attributes for shapes
		series.getAttribs();
		
		// draw the graph if any
		if (series.drawGraph) {
			series.drawGraph();
		}
		
		// draw the points
		series.drawPoints();
		
		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}
		
		// run the animation
		if (doAnimation) {
			series.animate();
		}
		
		//else series.setVisible(false, false);
		
		// initially hide other states than normal
		/*if (!series.hasRendered && stateLayers[HOVER_STATE]) {
			stateLayers[HOVER_STATE].hide();
			hasRendered = true;
		}*/
		
		
		series.isDirty = false; // means data is in accordance with what you see
		
	},
	
	/**
	 * Redraw the series after an update in the axes.
	 */
	redraw: function() {
		var series = this;
			
		series.translate();
		series.setTooltipPoints(true);
		//series.clear();
		series.render();
	},
	
	/**
	 * Clear all graphics and HTML from the series layer group
	 * 
	 * @todo: Instead of removing elements, reuse and set new attributes
	 */
	clear: function() {
		var series = this,
			tracker = series.tracker;
		
		// remove all elements in the series group
		if (series.group) {
			series.group.empty();
		}
		
		// remove the tracker
		if (tracker) { // common series tracker
			tracker.destroy();
			
		} else { // individual point trackers
			each (series.data, function(point) {
				tracker = point.tracker;
				if (tracker) {
					tracker.destroy();
				}
			});
		}
		
		series.graph = series.area = series.tracker = series.stateMarkerGraphic = null;
		

		/*var stateLayers = this.stateLayers;
		for (var state in stateLayers) {
			stateLayers[state].clear();
			stateLayers[state].cleared = true;
		}
		if (this.dataLabelsLayer) {
			this.dataLabelsLayer.clear();
			this.hasDrawnDataLabels = false;
		}*/
	},
	
	/**
	 * Set the state of the graph
	 */
	setState: function(state) {
		var series = this,
			options = series.options,
			graph = series.graph,
			stateMarkerGraphic = series.stateMarkerGraphic,
			lineWidth = options.lineWidth;

		state = state || NORMAL_STATE;
		if (series.state != state) {
			series.state = state;
			
			if (state) {				
				lineWidth = pick(options.states[state].lineWidth, lineWidth);
			} else if (stateMarkerGraphic) {
				stateMarkerGraphic.hide();
			}
				
			if (graph) {
				graph.animate({
					'stroke-width': lineWidth
				}, state ? 0 : 500);
			}
		}
	},
	
	/**
	 * Set the visibility of the graph
	 * 
	 * @param vis {Boolean} True to show the series, false to hide. If UNDEFINED,
	 *        the visibility is toggled.
	 */
	setVisible: function(vis, redraw) {
		var series = this,
			chart = series.chart,
			//imagemap = chart.imagemap,
			//layerGroup = series.layerGroup,
			legendItem = series.legendItem,
			//colorizeLegendItem = chart.legend.colorizeItem,
			//legendLine = series.legendLine,
			//legendSymbol = series.legendSymbol,
			seriesTracker = series.tracker,
			dataLabelsGroup = series.dataLabelsGroup,
			//areas = series.areas,
			showOrHide,
			i,
			data = series.data,
			point,
			ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries,
			oldVisibility = series.visible;
		
		// if called without an argument, toggle visibility
		series.visible = vis = vis === UNDEFINED ? !oldVisibility : vis;
		showOrHide = vis ? 'show' : 'hide';
		
		if (vis) {
			series.isDirty = ignoreHiddenSeries; // when series is initially hidden
		}	
		
		// show or hide series
		series.group[showOrHide]();
		
		// show or hide trackers
		if (seriesTracker) {
			seriesTracker[showOrHide]();
		} else {
			i = data.length;
			while (i--) {
				point = data[i];
				if (point.tracker) {
					point.tracker[showOrHide]();
				}
			}
		}
		
		
		if (dataLabelsGroup) {
			dataLabelsGroup[showOrHide]();
		}
		
		if (legendItem) {
			chart.legend.colorizeItem(series, vis);
		}
			
		
		// rescale
		if (ignoreHiddenSeries) {
			
			// in a stack, all other series are affected
			if (series.options.stacking) {
				each (chart.series, function(otherSeries) {
					if (otherSeries.options.stacking && otherSeries.visible) { 
						otherSeries.isDirty = true;
					}
				});
			} 
			
		}
		if (redraw !== false) {
			chart.redraw();
		}
		
		fireEvent(series, showOrHide);
	},
	
	/**
	 * Show the graph
	 */
	show: function() {
		this.setVisible(true);
	},
	
	/**
	 * Hide the graph
	 */
	hide: function() {
		this.setVisible(false);
	},
	
	
	/**
	 * Set the selected state of the graph
	 * 
	 * @param selected {Boolean} True to select the series, false to unselect. If
	 *        UNDEFINED, the selection state is toggled.
	 */
	select: function(selected) {
		var series = this;
		// if called without an argument, toggle
		series.selected = selected = (selected === UNDEFINED) ? !series.selected : selected;

		if (series.checkbox) {
			series.checkbox.checked = selected;
		}
		
		fireEvent(series, selected ? 'select' : 'unselect');
	},
	
	
	/**
	 * Draw the tracker object that sits above all data labels and markers to
	 * track mouse events on the graph or points. For the line type charts
	 * the tracker uses the same graphPath, but with a greater stroke width
	 * for better control.
	 */
	drawTracker: function() {
		var series = this,
			options = series.options,
			trackerPath = series.graphPath,
			chart = series.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			//isSingleSeries = chart.series.length == 1,
			tracker = series.tracker,
			css = options.cursor ? { cursor: options.cursor } : null;
	
		// if only one series, use the whole plot area as tracker
		// problem: can't put legend inside plot area
		/*if (isSingleSeries) {
			trackerPath = [
				M,
				0, 0,
				L,
				0, plotHeight,
				plotWidth, plotHeight,
				plotWidth, 0,
				'Z'
			]; 
		}*/
		
		if (tracker) { // update
			tracker.attr({ d: trackerPath });
			
		} else { // create
			series.tracker = chart.renderer.path(trackerPath).
				attr({
					isTracker: true,
					stroke: TRACKER_FILL,
					//fill: isSingleSeries ? TRACKER_FILL : NONE,
					fill: NONE,
					'stroke-width' : options.lineWidth + 2 * chart.options.tooltip.snap,
					'stroke-linecap': 'round'
				})
				.on('mouseover', function() {
					chart.hoverPoint = null; // for series trackers, the point is interpolated from mouse pos
					series.onMouseOver();
				})
				.css(css)
				.add(chart.trackerGroup, 1);
		}
	}
	
}; // end Series prototype


/**
 * LineSeries object
 */
var LineSeries = extendClass(Series);
seriesTypes.line = LineSeries;

/**
 * AreaSeries object
 */
var AreaSeries = extendClass(Series, {
	type: 'area'
});
seriesTypes.area = AreaSeries;


/**
 * Calculate the spine interpolation.
 * 
 * @todo: Implement true Bezier curves like shown at http://www.math.ucla.edu/~baker/java/hoefer/Spline.htm
 */
function SplineHelper (data) {
	var xdata = [];
	var ydata = [];
	var i;
	for (i = 0; i < data.length; i++) {
		xdata[i] = data[i].plotX;
		ydata[i] = data[i].plotY;
	}
	this.xdata = xdata;
	this.ydata = ydata;
	var delta = [];
	this.y2 = [];

	var n = ydata.length;
	this.n = n;

	// Natural spline 2:derivate == 0 at endpoints
	this.y2[0]    = 0.0;
	this.y2[n-1] = 0.0;
	delta[0] = 0.0;

	// Calculate 2:nd derivate
	for(i=1; i < n-1; i++) {
	    var d = (xdata[i+1]-xdata[i-1]);
	    /*if( d == 0  ) {
			error: ('Invalid input data for spline. Two or more consecutive input X-values are equal. Each input X-value must differ since from a mathematical point of view it must be a one-to-one mapping, i.e. each X-value must correspond to exactly one Y-value.');
	    }*/
	    var s = (xdata[i]-xdata[i-1])/d;
	    var p = s*this.y2[i-1]+2.0;
	    this.y2[i] = (s-1.0)/p;
	    delta[i] = (ydata[i+1]-ydata[i])/(xdata[i+1]-xdata[i]) -
		         (ydata[i]-ydata[i-1])/(xdata[i]-xdata[i-1]);
	    delta[i] = (6.0*delta[i]/(xdata[i+1]-xdata[i-1])-s*delta[i-1])/p;
	}

	// Backward substitution
	for(var j=n-2; j >= 0; j-- ) {
	    this.y2[j] = this.y2[j]*this.y2[j+1] + delta[j];
	}
}


SplineHelper.prototype = {
// Return the two new data vectors
get: function(num) {
	if (!num) {
		num = 50;
	}
	var n = this.n ;
	var step = (this.xdata[n-1]-this.xdata[0]) / (num-1);
	var xnew=[];
	var ynew=[];
	xnew[0] = this.xdata[0];
	ynew[0] = this.ydata[0];
	var data = [{ plotX: xnew[0], plotY: ynew[0] }];//[[xnew[0], ynew[0]]];

	for(var j = 1; j < num; j++ ) {
	    xnew[j] = xnew[0]+j*step;
	    ynew[j] = this.interpolate(xnew[j]);
	    data[j] = { plotX: xnew[j], plotY: ynew[j] };//[xnew[j], ynew[j]];
	}

	return data;
},

// Return a single interpolated Y-value from an x value
interpolate: function(xpoint) {
	var max = this.n-1;
	var min = 0;

	// Binary search to find interval
	while( max-min > 1 ) {
	    var k = (max+min) / 2;
		if( this.xdata[mathFloor(k)] > xpoint ) {
			max=k;
		} else {
			min=k;
		}
	}
	var intMax = mathFloor(max), intMin = mathFloor(min);

	// Each interval is interpolated by a 3:degree polynom function
	var h = this.xdata[intMax]-this.xdata[intMin];
	/*if( h == 0  ) {
	    error: ('Invalid input data for spline. Two or more consecutive input X-values are equal. Each input X-value must differ since from a mathematical point of view it must be a one-to-one mapping, i.e. each X-value must correspond to exactly one Y-value.');
	}*/


	var a = (this.xdata[intMax]-xpoint)/h;
	var b = (xpoint-this.xdata[intMin])/h;
	return a*this.ydata[intMin]+b*this.ydata[intMax]+
	     ((a*a*a-a)*this.y2[intMin]+(b*b*b-b)*this.y2[intMax])*(h*h)/6.0;
}

};
/**
 * SplineSeries object
 */
var SplineSeries = extendClass( Series, {
	type: 'spline',
	/**
	 * Translate the points and get the spline data
	 */
	/*translate: function() {
		var series = this;
		
		// do the partent translate
		Series.prototype.translate.apply(series, arguments);
		
		// get the spline data
		series.splinedata = series.getSplineData();
		
	},*/
	/**
	 * Draw the actual spline line with interpolated values
	 * @param {Object} state
	 */
	drawGraph: function(state) {
		var series = this,
			realSegments = series.segments; 
		
		// temporarily set the segments to reflect the spline
		series.splinedata = series.getSplineData();
		series.segments = series.splinedata;// || series.getSplineData();
		
		
		
		// draw the line
		Series.prototype.drawGraph.apply(series, arguments);
		
		// reset the segments
		series.segments = realSegments;	
	},


	/**
	 * Get interpolated spline values
	 */
	getSplineData: function() {
		var series = this, 
			chart = series.chart,
			//data = this.data,
			splinedata = [],
			num;
			
		each (series.segments, function(data) {
			if (series.xAxis.reversed) {
				data = data.reverse();//reverseArray(data);
			}
			var croppedData = [],
				nextUp,
				nextDown;
			
			// to save calculations, only add data within the plot
			each (data, function(point, i) {
				nextUp = data[i+2] || data[i+1] || point;
				nextDown = data[i-2] || data[i-1] || point;
				if (nextUp.plotX >= 0 && nextDown.plotX <= chart.plotWidth) {
					croppedData.push(point);
				}
			});
			
			// 3px intervals:
			if (croppedData.length > 1) {
				num = mathRound(mathMax(chart.plotWidth, 
					croppedData[croppedData.length-1].clientX	- croppedData[0].clientX) / 3);
			}
			splinedata.push (
				data.length > 1 ? // if the data.length is one, it's a single point so we can't spline it
					num ? (new SplineHelper(croppedData)).get(num) : [] :
					data
			);
			
		});
		
		return splinedata;
	}
});
seriesTypes.spline = SplineSeries;



/**
 * AreaSplineSeries object
 */
var AreaSplineSeries = extendClass(SplineSeries, {
	type: 'areaspline'
});
seriesTypes.areaspline = AreaSplineSeries;

/**
 * ColumnSeries object
 */
var ColumnSeries = extendClass(Series, {
	type: 'column',
	//allowsPointStateColor: true,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color',
		r: 'borderRadius'
	},
	init: function() {
		Series.prototype.init.apply(this, arguments);
		
		var series = this,
			chart = series.chart;
		
		
		// record number of column series to calculate column width
		//if (!series.options.stacking) series.countColumn = true;
		
		// if the series is added dynamically, force redraw of other
		// series affected by a new column
		if (chart.hasRendered) {
			each (chart.series, function(otherSeries) {
				if (otherSeries.type == series.type) {
					otherSeries.isDirty = true;
				}
			});
		}
	},
	
	translate: function() {
		var series = this,
			chart = series.chart,
			columnCount = 0,
			reversedXAxis = series.xAxis.reversed,
			stackedIndex; // the index of the first column in a stack
		
		Series.prototype.translate.apply(series);
		
		// Get the total number of column type series.
		// This is called on every series. Consider moving this logic to a 
		// chart.orderStacks() function and call it on init, addSeries and removeSeries
		each (chart.series, function(otherSeries) {
			if (otherSeries.type == series.type) {
				if (!otherSeries.options.stacking) {
					otherSeries.columnIndex = columnCount++;
				} else {
					if (!defined(stackedIndex)) {
						stackedIndex = columnCount++;
					}
					otherSeries.columnIndex = stackedIndex;
				}
			}
		});
		
		// calculate the width and position of each column based on 
		// the number of column series in the plot, the groupPadding
		// and the pointPadding options
		var options = series.options,
			data = series.data,
			closestPoints = series.closestPoints,
			categoryWidth = mathAbs(
				data[1] ? data[closestPoints].plotX - data[closestPoints - 1].plotX : 
				chart.plotSizeX
			),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / columnCount,
			optionPointWidth = options.pointWidth,
			pointPadding = defined(optionPointWidth) ? (pointOffsetWidth - optionPointWidth) / 2 : 
				pointOffsetWidth * options.pointPadding,
			pointWidth = pick(optionPointWidth, pointOffsetWidth - 2 * pointPadding),
			columnIndex = (reversedXAxis ? columnCount - 
				series.columnIndex : series.columnIndex) || 0,
			pointXOffset = pointPadding + (groupPadding + columnIndex *
				pointOffsetWidth -(categoryWidth / 2)) *
				(reversedXAxis ? -1 : 1),
			translatedY0 = series.yAxis.getZeroPlane(options.baseValue || 0),
			minPointLength = options.minPointLength,
			barX,
			barY,
			barW,
			barH;
			
			
		// record the new values
		each (data, function(point) {
			barX = point.plotX + pointXOffset;
			barY = math.min(point.plotY, translatedY0); 
			barW = pointWidth;
			barH = mathAbs((point.yBottom || translatedY0) - point.plotY);
			if (minPointLength && mathAbs(barH) < minPointLength) { // handle options.minPointLength
				barH = (barH < 0 ? 1 : -1) * minPointLength;
			}
			
			
			extend (point, {
				barX: barX,
				barY: barY, 
				barW: barW,
				barH: barH
			});
			point.shapeType = 'rect';
			/*point.shapeArgs = [
				barX,
				barY,
				barW,
				barH,
				options.borderRadius,
				options.borderWidth
			]*/
			point.shapeArgs = {
				x: barX,
				y: barY,
				width: barW,
				height: barH,
				r: options.borderRadius
			};
		});
		
	},
	
	getSymbol: function(){
	},
	
	/** 
	 * Columns have no graph
	 */
	drawGraph: function() {},
	
	/**
	 * Draw the columns. For bars, the series.group is rotated, so the same coordinates
	 * apply for columns and bars. This method is inherited by scatter series.
	 * 
	 */
	drawPoints: function() {
		var series = this,
			options = series.options,
			//radius = options.borderRadius,
			renderer = series.chart.renderer,
			graphic,
			shapeArgs;		
		
		
		// draw the columns
		each (series.data, function(point) {			
			
			if (defined(point.plotY)) {
				graphic = point.graphic;
				shapeArgs = point.shapeArgs;

				if (graphic) { // update
					graphic.attr(shapeArgs);
				
				} else {
					point.graphic = renderer[point.shapeType](shapeArgs)
						.attr(point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE])
						.add(series.group)
						.shadow(options.shadow);
				}
			
			}
		});
	},
	/**
	 * Draw the individual tracker elements.
	 * This method is inherited by scatter and pie charts too.
	 */
	drawTracker: function() {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			shapeArgs,
			tracker;
			
		each (series.data, function(point) {
			tracker = point.tracker;
			shapeArgs = point.trackerArgs || point.shapeArgs;
			if (tracker) {// update
				tracker.attr(shapeArgs);
				
			} else {
				point.tracker = 
					renderer[point.shapeType](shapeArgs)
					//.attr(shapeArgs)
					.attr({
						isTracker: true,
						fill: TRACKER_FILL
					})
					.on('mouseover', function() {
						chart.hoverPoint = point;
						series.onMouseOver();
					})
					.add(chart.trackerGroup, 1);
			}
		});				
	},
	
	/**
	 * Extend the base cleanData method by getting the closest pair of points.
	 * This is needed for determining the automatic point width.
	 */
	cleanData: function() {
		var series = this,
			data = series.data,
			interval,
			smallestInterval,
			closestPoints,
			i;
			
		// apply the parent method
		Series.prototype.cleanData.apply(series);
			
		// find the closes pair of points
		for (i = data.length - 1; i >= 0; i--) {
			if (data[i - 1]) {
				interval = data[i].x - data[i - 1].x;
				if (smallestInterval === UNDEFINED || interval < smallestInterval) {
					smallestInterval = interval;
					closestPoints = i;	
				}
			}
		}
		series.closestPoints = closestPoints;
	},
	
	/**
	 * Animate the column heights one by one from zero
	 * @param {Boolean} init Whether to initialize the animation or run it 
	 */
	animate: function(init) {
		var series = this,
			data = series.data;
			//chart = series.chart;
			//inverted = chart.inverted;
			
		if (!init) { // run the animation
			/*
			 * Note: Ideally the animation should be initialized by calling
			 * series.group.hide(), and then calling series.group.show()
			 * after the animation was started. But this rendered the shadows
			 * invisible in IE8 standards mode. If the columns flicker on large
			 * datasets, this is the cause.
			 */
			
			each (data, function(point) {
				var graphic = point.graphic;
				
				if (graphic) {
					// start values
					graphic.attr({ 
						height: 0,
						y: series.yAxis.translate(0, 0, 1)
					});
					
					// animate
					graphic.animate({ 
						height: point.barH,
						y: point.barY
					}, {
						duration: 1000
					});
				}
			});
			
			
			// delete this function to allow it only once
			series.animate = null;
		}
		
	},
	/**
	 * Remove this series from the chart
	 */
	remove: function() {
		var series = this,
			chart = series.chart;
			
		// column and bar series affects other series of the same type
		// as they are either stacked or grouped
		if (chart.hasRendered) {
			each (chart.series, function(otherSeries) {
				if (otherSeries.type == series.type) {
					otherSeries.isDirty = true;
				}
			});
		}
		
		Series.prototype.remove.apply(series, arguments);
	}
});
seriesTypes.column = ColumnSeries;

var BarSeries = extendClass(ColumnSeries, {
	type: 'bar',
	init: function(chart) {
		chart.inverted = this.inverted = true;
		ColumnSeries.prototype.init.apply(this, arguments);
	}
});
seriesTypes.bar = BarSeries;

/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',
	
	/**
	 * Extend the base Series' translate method by adding shape type and
	 * arguments for the point trackers
	 */
	translate: function() {
		var series = this;

		Series.prototype.translate.apply(series);

		each (series.data, function(point) {
			point.shapeType = 'circle';
			point.shapeArgs = {
				x: point.plotX,
				y: point.plotY,
				r: series.chart.options.tooltip.snap
			};
		});
	},
	
	
	/**
	 * Create individual tracker elements for each point
	 */
	drawTracker: ColumnSeries.prototype.drawTracker,
	
	/**
	 * Cleaning the data is not necessary in a scatter plot
	 */
	cleanData: function() {}
});
seriesTypes.scatter = ScatterSeries;

/**
 * Extended point object for pies
 */
var PiePoint = extendClass(Point, {
	setState: function(state) {
		this.series.setPointState(this, state);
	},
	init: function () {
		
		Point.prototype.init.apply(this, arguments);
		
		var point = this,
			//series = point.series,
			toggleSlice;
		
		//visible: options.visible !== false,
		extend(point, {
			visible: point.visible !== false,
			name: pick(point.name, 'Slice')
		});
		
		// add event listener for select
		toggleSlice = function() {
			point.slice();
		};
		addEvent(point, 'select', toggleSlice);
		addEvent(point, 'unselect', toggleSlice);
		
		return point;
	},
	setVisible: function(vis) {
	
		var point = this, 
			chart = point.series.chart;
		
		// if called without an argument, toggle visibility
		point.visible = vis = vis === UNDEFINED ? !point.visible : vis;
		
		
		if (vis) {
			//layer.show();
			point.group.show();
			point.tracker.show();
			
			
		} else { 
			//layer.hide();
			point.group.hide();
			point.tracker.hide();
			
		}
	
		if (point.legendItem) {
			chart.legend.colorizeItem(point, vis);
		}
	},
	
	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled 
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function(sliced, redraw) {
		var point = this,
			series = point.series,
			chart = series.chart,
			//center = point.center,
			slicedTranslation = point.slicedTranslation;
		
		// redraw is true by default
		redraw = pick(redraw, true);
			
		// if called without an argument, toggle
		sliced = point.sliced = defined(sliced) ? sliced : !point.sliced;
		
		// todo: use centertranslation
		point.group.animate({
			translateX: (sliced ? slicedTranslation[0] : chart.plotLeft),
			translateY: (sliced ? slicedTranslation[1] : chart.plotTop)
		}, 100);
		
	}
});

/**
 * The Pie series class
 */
var PieSeries = extendClass(Series, {
	type: 'pie',
	isCartesian: false,
	pointClass: PiePoint,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color'
	},
	
	/**
	 * Pies have one color each point
	 */
	getColor: function() {},
	
	
	translate: function() {
		var total = 0,
			series = this,
			cumulative = -0.25, // start at top
			options = series.options,
			slicedOffset = options.slicedOffset,
			positions = options.center,
			chart = series.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			start,
			end,
			angle,
			data = series.data,
			circ = 2 * math.PI,
			fraction,
			isPercent;
			
		// get positions - either an integer or a percentage string must be given
		positions.push(options.size);
		positions = map (positions, function(length, i) {
			isPercent = /%$/.test(length);
			return isPercent ? 
				// i == 0: centerX, relative to width
				// i == 1: centerY, relative to height
				// i == 2: size, relative to height
				[plotWidth, plotHeight, math.min(plotWidth, plotHeight)][i] *
					parseInt(length, 10) / 100:
				length;
		});
					
		// get the total sum
		each (data, function(point) {
			total += point.y;
		});
		
		each (data, function(point) {
			// set start and end angle
			fraction = total ? point.y / total : 0;
			start = cumulative * circ;
			cumulative += fraction;
			end = cumulative * circ;
			
			
			// set the shape
			point.shapeType = 'arc';
			point.shapeArgs = {
				x: positions[0],
				y: positions[1],
				r: positions[2] / 2,
				start: start,
				end: end
			};
			
			// center for the sliced out slice
			angle = (end + start) / 2;
			point.slicedTranslation = map([
				mathCos(angle) * slicedOffset + chart.plotLeft, 
				mathSin(angle) * slicedOffset + chart.plotTop
			], mathRound);
			
			
			// set the anchor point for tooltips
			point.tooltipPos = [
				positions[0] + mathCos(angle) * positions[2] * 0.35,
				positions[1] + mathSin(angle) * positions[2] * 0.35
			];
			
			// API properties
			point.percentage = fraction * 100;
			point.total = total;
			
		});
		
		this.setTooltipPoints();
	},
	
	/**
	 * Render the slices
	 */
	render: function() {
		var series = this;
			//chart = series.chart;
			
		/*
		if (!series.group) {
			series.group = chart.renderer.g('series').add(null, 3);
		}
		*/
		
		// cache attributes for shapes
		series.getAttribs();
		

		this.drawPoints();
		
		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}
		
		this.drawDataLabels();
		
	},
	
	/**
	 * Draw the data points
	 */
	drawPoints: function() {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			groupTranslation,
			//center,
			graphic,
			shapeArgs;
		
		// draw the slices
		each (this.data, function(point) {
			graphic = point.graphic;
			shapeArgs = point.shapeArgs;

			// create the group the first time
			if (!point.group) {
				// if the point is sliced, use special translation, else use plot area traslation
				groupTranslation = point.sliced ? point.slicedTranslation : [chart.plotLeft, chart.plotTop];
				point.group = renderer.g('point').add(series.group).
					translate(groupTranslation[0], groupTranslation[1]);
			}
			
			// draw the slice
			if (graphic) {
				graphic.attr(shapeArgs);
			} else {
				point.graphic = 
					renderer.arc(shapeArgs)
					.attr(point.pointAttr[NORMAL_STATE])
					.add(point.group);
			}
			
			// detect point specific visibility
			if (point.visible === false) {
				point.setVisible(false);
			}
					
		});
		
	},
	
	/**
	 * Draw point specific tracker objects. Inherit directly from column series.
	 */
	drawTracker: ColumnSeries.prototype.drawTracker,
	
	/**
	 * Pies don't have point marker symbols
	 */
	getSymbol: function() {}
	
});
seriesTypes.pie = PieSeries;


// global variables
win.Highcharts = {
	Chart: Chart,
	dateFormat: dateFormat,
	defaultOptions: defaultOptions,
	numberFormat: numberFormat,
	Point: Point,
	Renderer: Renderer,
	seriesTypes: seriesTypes,
	setOptions: setOptions,
	Series: Series,
		
	// Expose utility funcitons for modules
	addEvent: addEvent,
	createElement: createElement,
	discardElement: discardElement,
	css: css,
	each: each,
	extend: extend,
	map: map,
	merge: merge,
	pick: pick,
	extendClass: extendClass
};

})();