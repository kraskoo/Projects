function replaceByPositions(collection, firstIndex, secondIndex) {
	let temproary = collection[firstIndex];
	collection[firstIndex] = collection[secondIndex];
	collection[secondIndex] = temproary;
};

function shuffleArray(array) {
	for (let index = array.length - 1; index > 0; index--) {
		let nextIndex = Math.floor(Math.random() * (index + 1));
		replaceByPositions(array, index, nextIndex);
	}
	
	return array;
};
	
function compareArrays(firstArray, secondArray) {
	let hasEqualValues = true;
	for(let index = 0; index < firstArray.length; index++) {
		if(firstArray[index] !== secondArray[index]) {
			hasEqualValues = false;
			break;
		}
	}
	
	return hasEqualValues;
};

function choosePic() {
	let imagesContent = document.getElementById("images-content").children;
	let allImgs = [];
	for(let i = 0; i < imagesContent.length; i++) {
		if(imagesContent[i].id !== "start") {
			allImgs.push(imagesContent[i].id);
		}
	}
	
	function transperantBorders() {
		for(let i = 0; i < allImgs.length; i++) {
			document.getElementById(allImgs[i]).style.border = "5px solid transparent";
		}
	};
	
	let imageSrc = null;
	for(let i = 0; i < allImgs.length; i++) {
		document.getElementById(allImgs[i]).addEventListener("click", function(image) {
			transperantBorders();
			let currentImage = image.currentTarget;
			currentImage.style.border = "5px solid #759BCE";
			imageSrc = currentImage.src;
		}, false);
	}
	
	document.getElementById("start").addEventListener("click", function() {
		if(imageSrc !== null) {
			document.getElementById("images-content").style.display = "none";
			document.getElementById("canvas-content").style.display = "block";
			loadCanvas(imageSrc);
			let imageName = imageSrc.split("/");
			let imageId = "image-" + (imageName[imageName.length - 1]).replace(".jpg", "");
			document.getElementById(imageId).style.display = "block";
		}
	}, false);
};

function loadCanvas(imageSrc) {
	let paddTop = 10;
	let paddLeft = 39;
	let restart = document.getElementById("restart");
	restart.addEventListener("click", function() {
		location.reload();
	}, false);
	
	let originalCords = [];
	let pieces = [];
	let cords = [];
	let x = [];
	let y = [];
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	canvas.width = 601;
	canvas.height = 601;
	
	for(let row = 0.5; row <= canvas.width; row += 120) {
		x.push(row);
		ctx.moveTo(row, 0);
		ctx.lineTo(row, canvas.width);
	}
	
	for(let col = 0.5; col <= canvas.height; col += 120) {
		y.push(col);
		ctx.moveTo(0, col);
		ctx.lineTo(canvas.height, col);
	}
	
	ctx.strokeStyle = "black";
	ctx.stroke();
	for(let i = 1; i < x.length; i++) {
		for(let j = 1; j < y.length; j++) {
			pieces.push((x[i - 1] + 0.5) + ", " + (y[j - 1] + 0.5) + ", " + "118.5, 118.5, ");
			cords.push((x[i - 1] + 1) + ", " + (y[j - 1] + 0.5) + ", 118.5, 118.5);");
			originalCords.push((x[i - 1] + 1) + ", " + (y[j - 1] + 0.5) + ", 118.5, 118.5);");
		}
	};
	
	shuffleArray(cords);
	let image = new Image();
	image.onload = function() {
		for(let i = 0; i < pieces.length; i++) {
			eval("ctx.drawImage(image, " + pieces[i] + cords[i]);
		}
	};
	
	image.src = imageSrc;
	let smallImg = document.getElementById("helper-image");
	let ending = document.getElementById("ending");
	smallImg.src = image.src;
	ending.src = image.src;
	let firstPiece = null;
	let secondPiece = null;
	let firstExchanger = null;
	let secondExchanger = null;
	let cordinates = null;
	let falsePosition = null;
	let firstReplacedValue = 0;
	let secondReplacedValue = 0;
	function onClickPart(ev) {
		let fX = [], fY = [], rX = [], rY = [];
		for(let i = 0; i < cords.length; i++) {
			let xy = cords[i].substring(0, cords[i].length - 2).split(", ");
			let fXY = pieces[i].substring(0, pieces[i].length - 2).split(", ");
			fX.push(parseInt(fXY[0]));
			fY.push(parseInt(fXY[1]));
			rX.push(parseInt(xy[0]));
			rY.push(parseInt(xy[1]));
		}
		
		for(let i = 1; i <= pieces.length; i++) {
			if(ev.offsetX - paddLeft >= (rX[i - 1] + 1) &&
				ev.offsetX - paddLeft <= (rX[i - 1] + 118.5) &&
				ev.offsetY - paddTop >= (rY[i - 1] + 0.5) &&
				ev.offsetY - paddTop <= (rY[i - 1] + 118.5)) {
				if(firstPiece === null && secondPiece === null) {
					firstReplacedValue = i - 1;
					cordinates = (rX[i - 1] + 0.5) + ", " +  (rY[i - 1]);
					falsePosition = (fX[i - 1] + 0.5) + ", " +  (fY[i - 1]);
					firstExchanger = ("ctx.drawImage(image, " + falsePosition + ", 119, 119, ");
					ctx.fillStyle = "rgba(0, 139, 139, 0.3)";
					ctx.fillRect((rX[i - 1] + 0.5), (rY[i - 1] + 0.5), 118, 118);
					firstPiece = (cordinates + ", 119, 119);");
					break;
				} else if(firstPiece !== null && secondPiece === null) {
					secondReplacedValue = i - 1;
					cordinates = (rX[i - 1] + 0.5) + ", " +  (rY[i - 1]);
					falsePosition = (fX[i - 1] + 0.5) + ", " +  (fY[i - 1]);
					secondExchanger = ("ctx.drawImage(image, " + falsePosition + ", 119, 119, ");
					secondPiece = (cordinates + ", 119, 119);");
					break;
				}
			}
		}
		
		if(firstPiece !== null && secondPiece !== null) {
			firstPiece = secondExchanger + firstPiece;
			secondPiece = firstExchanger + secondPiece;
			eval(firstPiece);
			eval(secondPiece);
			replaceByPositions(cords, firstReplacedValue, secondReplacedValue);
			firstReplacedValue = 0;
			secondReplacedValue = 0;
			firstPiece = null;
			secondPiece = null;
			firstExchanger = null;
			secondExchanger = null;
			cordinates = null;
			falsePosition = null;
			if(compareArrays(cords, originalCords) === true) {
				canvas.style.display = "none";
				smallImg.style.display = "none";
				ending.style.display = "block";
				restart.style.display = "block";
			}
		}
	};
	
	canvas.addEventListener("click", onClickPart, false);
};

this.onload = choosePic;
this.oncontextmenu = function () {
	return false;
}

this.onselectstart = function () {
	return false;
}

this.ondragstart = function() {
	return false;
}