(function() {
	const outterLinkRegex = new RegExp(/(http.*?\w+?\.\w+?\/|www\.\w+\.\w+)/);
	const leftStyleRegex = new RegExp(/left:.*?(\d+\.?\d+)/);
	const topStyleRegex = new RegExp(/top:.*?(\d+\.?\d+)/);
	const widthStyleRegex = new RegExp(/width:.*?(\d+\.?\d+)/);
	const multipleLineComment = new RegExp(/^\/[\s\S]+\/$/gm);
	
	return {
		outterLinkRegex: outterLinkRegex,
		leftStyleRegex: leftStyleRegex,
		topStyleRegex: topStyleRegex,
		widthStyleRegex: widthStyleRegex,
		multipleLineComment: multipleLineComment,
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