(function() {
	const outterLinkRegex = new RegExp(/(http.*?\w+?\.\w+?\/|www\.\w+\.\w+)/);
	const leftStyleRegex = new RegExp(/left:.*?(\d+\.?\d+)/);
	const topStyleRegex = new RegExp(/top:.*?(\d+\.?\d+)/);
	const widthStyleRegex = new RegExp(/width:.*?(\d+\.?\d+)/);
	const measurementStyleRegex = new RegExp(/([A-Za-z]+)/)
	
	function initialRepeat() {
		if (!String.prototype.repeat) {
			String.prototype.repeat = function(count) {
				'use strict';
				if (this == null) throw new TypeError('Can\'t convert ' + this + ' to object');
				let str = '' + this;
				count = +count;			
				if (count != count) count = 0;
				if (count < 0) throw new RangeError('Repeat count must be non-negative');
				if (count == Infinity) throw new RangeError('Repeat count must be less than infinity');
				count = Math.floor(count);
				if (str.length == 0 || count == 0) return '';
				if (str.length * count >= 1 << 28) throw new RangeError('Repeat count must not overflow maximum string size');
				let rpt = '';
				for (;;) {
					if ((count & 1) == 1) rpt += str;
					count >>>= 1;
					if (count == 0) break;
					str += str;
				}
				
				return rpt;
			}
		}
	};
	
	return {
		outterLinkRegex: outterLinkRegex,
		leftStyleRegex: leftStyleRegex,
		topStyleRegex: topStyleRegex,
		widthStyleRegex: widthStyleRegex,
		measurementStyleRegex: measurementStyleRegex,
		initialRepeat: initialRepeat,
		fixNumberLength: function(currentNumber, neededLength) {
			let numAsString = currentNumber.toString();
			let lengthToFill = neededLength - numAsString.length;
			if(lengthToFill == 0) {
				return numAsString;
			}
			
			numAsString = ("0".repeat(lengthToFill) + numAsString);
			return numAsString;
		},
		contains: function(inString, searchedWord) {
			if(!(typeof inString === 'string') || !(typeof searchedWord === 'string')) {
				throw new TypeError('Instances of `inString` and `searchedWord` must be string type.');
			}
			
			if (inString === "" || searchedWord === "" || searchedWord.length > inString.length) {
				return false;
			}
			
			let counter = 0;
			while(searchedWord.length + counter <= inString.length) {
				if(inString.substring(counter, searchedWord.length + counter) === searchedWord) {
					return true;
				}
				
				counter++;
			}
			
			return false;
		}
	};
}());