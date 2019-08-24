
sortProperties = function(o, fn) {
	var res = {};
	var props = keys(o);
	props = fn ? props.sort(fn): props.sort();
	
	for(var i = 0; i < props.length; i++) {
		res[props[i]] = o[props[i]];
	}
	return res;
};

var orderedStrigify = function(o, fn) {
	var val = o;
	var type = types[whatis(o)];
	if(type === 3) {
		val = _objectOrderedStrignify(o, fn);
    	} else if(type === 2) {
    		val = _arrayOrderedStringify(o, fn);
    	} else if(type === 1) {
    		val = '"'+val+'"';
    	}
    
	if(type !== 4)
		return val;
};

var _objectOrderedStrignify = function(o, fn) {
	var res = '{';
	var props = keys(o);
	props = fn ? props.sort(fn) : props.sort();
	
	for(var i = 0; i < props.length; i++) {
		var val = orderedStrigify(o[props[i]], fn);
        if(val !== undefined)
        	res += '"'+props[i]+'":'+ val+',';
	}
	var lid = res.lastIndexOf(',');
	if (lid > -1)
		res = res.substring(res, lid);
    return res+'}';
};

var _arrayOrderedStringify = function(a, fn) {
	var res = '[';
	for(var i = 0; i < a.length; i++) {
		var val = orderedStrigify(a[i], fn);
        if(val !== undefined)
        	res += ''+ val+',';
	}
	var lid = res.lastIndexOf(',');
	if (lid > -1)
		res = res.substring(res, lid);
	return res+']';
};

//SORT WITHOUT STRINGIFICATION

var deepSortProperties = function(o, fn) {
	var res = o;
	var type = types[whatis(o)];
	if(type === 3) {
		res = _objectSortProperties(o, fn);
	} else if(type === 2) {
		res = _arraySortProperties(o, fn);
	}
	return res;
};

var _objectSortProperties = function(o, fn) {
	var props = keys(o);
	props = fn ? props.sort(fn) : props.sort();

	var res = {};	
	for(var i = 0; i < props.length; i++) {
		res[props[i]] = deepSortProperties(o[props[i]]);
	}
	return res;
};

var _arraySortProperties = function(a, fn) {
	var res = [];
	for(var i = 0; i < a.length; i++) {
		res[i] = deepSortProperties(a[i]);
	}
	return res;
};

 
//HELPER FUNCTIONS

var keys = function(o) {
	if(Object.keys)
		return Object.keys(o);
	var res = [];
	for (var i in o) {
		res.push(i);
	}
	return res;
};
 
var types = {
	'integer': 0,
	'float': 0,
	'string': 1,
	'array': 2,
	'object': 3,
	'function': 4,
	'regexp': 5,
	'date': 6,
	'null': 7,
	'undefined': 8,
	'boolean': 9
}
 
var getClass = function(val) {
	return Object.prototype.toString.call(val)
		.match(/^\[object\s(.*)\]$/)[1];
};
 
var whatis = function(val) {
 
	if (val === undefined)
		return 'undefined';
	if (val === null)
		return 'null';
		
	var type = typeof val;
	
	if (type === 'object')
		type = getClass(val).toLowerCase();
	
	if (type === 'number') {
		if (val.toString().indexOf('.') > 0)
			return 'float';
		else
			return 'integer';
	}
	
	return type;
};

function hash (obj) {
    return CryptoJS.SHA1(orderedStrigify(obj)).toString()
}

// https://stackoverflow.com/questions/5111164/are-there-any-one-way-hashing-functions-available-in-native-javascript