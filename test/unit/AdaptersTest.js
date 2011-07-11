var AdaptersTest = TestCase('AdaptersTest');

/**
 * Test the each method.
 */
AdaptersTest.prototype.testEach = function() {
	// Arrange
	var arr = [1];

	// Act 
	each(arr, function(value, i) {
		arr[i] = 2;
	});

	// Assert
	assertEquals('each value', 2, arr[0]);
};

/**
 * Test the grep method.
 */
AdaptersTest.prototype.testGrep = function() {
	// Arrange
	var arr = [1, 2];

	// Act 
	arr = grep(arr, function(value) {
		return (value === 1);
	});

	// Assert
	assertEquals('grep length', 1, arr.length);
	assertEquals('grep value', 1, arr[0]);
};

/**
 * Test the map method.
 */
AdaptersTest.prototype.testMap = function() {
	// Arrange
	var arr = [1];

	// Act 
	arr = map(arr, function(value) {
		return value + 1;
	});

	// Assert
	assertEquals('mapped value', 2, arr[0]);
};

/**
 * Test the merge method.
 */
AdaptersTest.prototype.testMerge = function() {
	// Arrange
	var obj1 = {
			prop1: 1,
			prop2: null,
			prop3: {dummy: 1},
			firstLevel: {
				secondLevel: {
					thirdLevel: 1
				}
			}
		},
		obj2 = {
			prop1: null,
			prop2: 2,
			prop3: null,
			firstLevel: {
				originalProp: {
					thirdLevel: 2
				}
			}
		},
		obj3 = {
			firstLevel: {
				secondLevel: {
					thirdLevel: 3
				}
			},
			arr: [1]
		},
		obj4;

	// Act 
	obj4 = merge(obj1, obj2, obj3);

	assertEquals('merge properties', 3, obj4.firstLevel.secondLevel.thirdLevel);
	assertEquals('merge properties', 2, obj4.firstLevel.originalProp.thirdLevel);
	assertEquals('merge length', 1, obj4.arr.length);
	assertNull('prop1 should be null', obj4.prop1);
	assertEquals('prop2 should be 2', 2, obj4.prop2);
	assertNull('prop3 should be null', obj4.prop3);
};

/**
 * Test an event that fires once and removes itself.
 *
 * The counter is just a property of an object.
 */
AdaptersTest.prototype.testObjectEventSelfRemove = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
			removeEvent(o, 'customEvent', f);
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test an event that triggers another event that remove itself.
 *
 * The counter is just a property of an object.
 */
AdaptersTest.prototype.testObjectEventChainedRemove = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Add a runf handler
	addEvent(o, 'innerEvent', f);

	// remove it on chart destroy
	addEvent(document, 'outerEvent', function() {
		removeEvent(o, 'innerEvent', f);
	});

	// Fire it once
	fireEvent(o, 'innerEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Fire outer to remove inner
	fireEvent(document, 'outerEvent', null, null);
	assertEquals('no change', 1, o.clickedCount);

	// Fire it again
	fireEvent(o, 'innerEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};


/**
 * Test event add/fire/remove on a POJO.
 *
 * The counter is just a property of an object.
 * Remove all handlers.
 */
AdaptersTest.prototype.testObjectEventRemoveAll = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test event add/fire/remove on a POJO.
 *
 * The counter is just a property of an object.
 * Remove handlers of a certain type.
 */
AdaptersTest.prototype.testObjectEventRemoveType = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'customEvent');

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test event add/fire/remove on a POJO.
 *
 * The counter is just a property of an object.
 * Remove a specific handler.
 */
AdaptersTest.prototype.testObjectEventRemoveHandler = function() {
	var o = {clickedCount: 0},
		f = function() {
			o.clickedCount++;
		};

	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('not yet clicked', 0, o.clickedCount);

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('now clicked', 1, o.clickedCount);

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('clicked again, no change', 1, o.clickedCount);
};

/**
 * Test event add/fire/remove on DOM element.
 * 
 * The counter is stored as innerHTML in a div.
 */
AdaptersTest.prototype.testDomElementEventRemoveAll = function() {
	/*:DOC += <div id="o">0</div>*/
	var o = document.getElementById('o'),
		f = function() {
			o.innerHTML = pInt(o.innerHTML) + 1;
		};

	// 1. Test custom events
	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('custom not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom now clicked', 1, pInt(o.innerHTML));

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked again, no change', 1, pInt(o.innerHTML));
	

	// 2. Test HTML events
	// Reset the counter
	o.innerHTML = 0;

	// Setup event handler
	addEvent(o, 'click', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	this.safeFireEvent(o, 'click');
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove all handlers
	removeEvent(o);

	// Fire it again, should do nothing, since the handler is removed
	this.safeFireEvent(o, 'click');
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
};

/**
 * Test event add/fire/remove on DOM element.
 *
 * The counter is stored as innerHTML in a div.
 */
AdaptersTest.prototype.testDomElementEventRemoveType = function() {
	/*:DOC += <div id="o">0</div>*/
	var o = document.getElementById('o'),
		f = function() {
			o.innerHTML = pInt(o.innerHTML) + 1;
		};

	// 1. Test custom events
	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('custom not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'customEvent');

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked again, no change', 1, pInt(o.innerHTML));

	// 2. Test HTML events
	// Reset the counter
	o.innerHTML = 0;

	// Setup event handler
	addEvent(o, 'click', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	this.safeFireEvent(o, 'click');
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Only specifying event type)
	removeEvent(o, 'click');

	// Fire it again, should do nothing, since the handler is removed
	this.safeFireEvent(o, 'click');
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
};

/**
 * Test event add/fire/remove on DOM element.
 *
 * The counter is stored as innerHTML in a div.
 */
AdaptersTest.prototype.testDomElementEventRemoveHandler = function() {
	/*:DOC += <div id="o">0</div>*/
	var o = document.getElementById('o'),
		f = function() {
			o.innerHTML = pInt(o.innerHTML) + 1;
		};

	// 1. Test custom events.
	// Setup event handler
	addEvent(o, 'customEvent', f);
	assertEquals('custom not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'customEvent', f);

	// Fire it again, should do nothing, since the handler is removed
	fireEvent(o, 'customEvent', null, null);
	assertEquals('custom clicked again, no change', 1, pInt(o.innerHTML));

	// 2. Test HTML events
	// Reset the counter
	o.innerHTML = 0;

	// Setup event handler
	addEvent(o, 'click', f);
	assertEquals('not yet clicked', 0, pInt(o.innerHTML));

	// Fire it once
	this.safeFireEvent(o, 'click');
	assertEquals('now clicked', 1, pInt(o.innerHTML));

	// Remove the handler (Most fine-grained)
	removeEvent(o, 'click', f);

	// Fire it again, should do nothing, since the handler is removed
	this.safeFireEvent(o, 'click');
	assertEquals('clicked again, no change', 1, pInt(o.innerHTML));
};

/*
AdaptersTest.prototype.testChartEvent = function() {
	TODO: Implement
}

AdaptersTest.prototype.testDocumentEvent = function() {
	TODO: Implement
}

AdaptersTest.prototype.testWindowEvent = function() {
	TODO: Implement
}
*/

/**
 * A safe way of doing fireEvent. Prototype does not support fireing
 * HTML events it seems.
 */
AdaptersTest.prototype.safeFireEvent = function(target, eventName) {
	if (!this.isPrototypeAdapter()) {
		fireEvent(target, eventName);
	} else {
		this.simulate(target, eventName);
	}
}

/**
 * Simple way to test if we are using the prototype adapter. The prototype
 * library does not fire dom events properly so, use this test to shortcut those tests.
 * Uses implementation details of the adapter.
 */
AdaptersTest.prototype.isPrototypeAdapter = function() {
	return globalAdapter && globalAdapter._extend;
};

/**
 * Simulates events of type HTMLEvent and MouseEvent.
 */
AdaptersTest.prototype.simulate = function(element, eventName) {
	var eventMatchers = {
			'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
			'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
		},
		defaultOptions = {
			pointerX: 0,
			pointerY: 0,
			button: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			bubbles: true,
			cancelable: true
		},
		options = extend(defaultOptions, arguments[2] || {}),
		oEvent, eventType = null;

	for (var name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	}
	
	if (!eventType)
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents')
		{
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else
		{
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
				options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		element.dispatchEvent(oEvent);
	} else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = document.createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent('on' + eventName, oEvent);
	}

	return element;
}

