(function() {
	addEventListener("click", function() {
	var el = document.documentElement
	var rfs = el.requestFullScreen ||
		el.webkitRequestFullScreen ||
		el.mozRequestFullScreen;
	rfs.call(el);});
	function createCard(wrapper) {
		var flipContainer = document.createElement("div");
		flipContainer.setAttribute("class", "flip-container");
		var card = document.createElement("div");
		card.setAttribute("id", "card");
		card.setAttribute("class", "flipper");
		var face = document.createElement("div");
		face.setAttribute("id", "face");
		face.setAttribute("class", "front");
		var backface = document.createElement("div");
		backface.setAttribute("id", "backface");
		backface.setAttribute("class", "back");
		card.appendChild(face);
		card.appendChild(backface);
		flipContainer.appendChild(card);
		wrapper.appendChild(flipContainer);
		return flipContainer;
	};
	
	function shuffleArray(array) {
		for (var index = array.length - 1; index > 0; index--) {
			var nextIndex = Math.floor(Math.random() * (index + 1));
			var temproary = array[index];
			array[index] = array[nextIndex];
			array[nextIndex] = temproary;
		}
		
		return array;
	};
	
	function getImagePathByIndex(index) {
		return "images/" + (index) + ".jpg";
	};
	
	var imageIndices = [];
	for(var i = 0; i < 8; i++) {
		imageIndices.push(i + 1);
	}
	
	for(var i = 15; i >= 8; i--) {
		imageIndices.push((i - 8) + 1);
	}
	
	shuffleArray(imageIndices);
	var innerWrapper = document.getElementById("inner-wrapper");
	var backPathImgFile = "images/back.png";
	var faces = [];
	for(var i = 0; i < 16; i++) {
		var container = createCard(innerWrapper);
		var containerFace = container.children[0].children[0];
		container.children[0].children[1].style.background = "url(" + backPathImgFile + ") 0 0 no-repeat";
		var facePath = getImagePathByIndex(imageIndices[i]);
		containerFace.style.background = "url(" + facePath + ") 0 0 no-repeat";
		faces.push(containerFace);
	}
	
	var firstOpenCard = null;
	var secondOpenCard = null;
	var leftCards = 16;
	var timerRunOn = 0;
	for(var i = 0; i < faces.length; i++) {
		faces[i].parentNode.addEventListener("click", function(cardItem) {
			if(timerRunOn === 0) {
				timerRunOn = 1;
				timer();
			}
			
			var card = cardItem.currentTarget;			
			if(card.parentNode.getAttribute("select") === null &&
				firstOpenCard !== null &&
				firstOpenCard.parentNode.getAttribute("select") !== card.parentNode.getAttribute("select") &&
				secondOpenCard === null) {
				secondOpenCard = card;
				secondOpenCard.className += !strContain(secondOpenCard.className, " flipper-action") ? " flipper-action" : "";
				secondOpenCard.parentNode.setAttribute("select", "2");
			} else if(card.parentNode.getAttribute("select") === null &&
				firstOpenCard === null && secondOpenCard === null) {
				firstOpenCard = card;
				firstOpenCard.className += !strContain(firstOpenCard.className, " flipper-action") ? " flipper-action" : "";
				firstOpenCard.parentNode.setAttribute("select", "1");
			}
			
			if(firstOpenCard !== null && secondOpenCard !== null) {
				if(getBackgroundPathByFlipperContainer(firstOpenCard) !== getBackgroundPathByFlipperContainer(secondOpenCard)) {					
					if(firstOpenCard.parentNode.getAttribute("select") === "1" &&
						secondOpenCard.parentNode.getAttribute("select") === "2") {
						setTimeout(wrongChoise, 1000, firstOpenCard);
						setTimeout(wrongChoise, 1000, secondOpenCard);
						firstOpenCard.parentNode.removeAttribute("select");
						secondOpenCard.parentNode.removeAttribute("select");
						firstOpenCard = null;
						secondOpenCard = null;
					}					
				} else {
					if(firstOpenCard.parentNode.getAttribute("select") === "1" &&
						secondOpenCard.parentNode.getAttribute("select") === "2") {
						setTimeout(correctChoise, 1000, firstOpenCard);
						setTimeout(correctChoise, 1000, secondOpenCard);
						setTimeout(removeChoise, 1400, firstOpenCard);
						setTimeout(removeChoise, 1400, secondOpenCard);
						firstOpenCard = null;
						secondOpenCard = null;
						leftCards -= 2;
					}					
				}
				
				if(leftCards === 0) {
					timerRunOn = 0;
					setTimeout(changeToPersonPanel, 2500);
				}
			}
		}, false);
		
		var restart = document.getElementById("restart");
		restart.addEventListener("click", function() {
			window.location.reload();
		}, false);
		
		var backToMain = document.getElementById("quit");
		backToMain.addEventListener("click", function() {
			window.close();
		}, false);
	}
	
	var time = 0;
	var divider = 100;
	function timer() {
		if (timerRunOn === 1) {
			setTimeout(function () {
				time++;
				var miliDivider = (divider * 10);
				var minutes = Math.floor(time / 10 / 60);
				var seconds = Math.floor(time / 10);
				var miliseconds = time % divider;
				if (minutes < 10) {
					minutes = "0" + minutes;
				}
				
				if (minutes > 0) {
					seconds = seconds - (minutes * 60);
				}
				
				if (seconds < 10) {
					seconds = "0" + seconds;
				}
				
				if (miliseconds > 9) {
					miliseconds = miliseconds % 10;
				}
				
				document.getElementById("timer").innerHTML = minutes + " : " + seconds + "." + miliseconds;
				timer();
			}, divider);
		}
	}
	
	function removeChoise(card) {
		card.parentNode.style.display = "none";
	}
	
	function correctChoise(card) {
		card.childNodes[1].style.background = card.childNodes[0].style.background;
		card.className +=
			!strContain(card.className, " final-act") ?
			" final-act" : "";
	}
	
	function wrongChoise(card) {
		if(card != null && strContain(card.className, " flipper-action")) {
			card.className = card.className.replace(" flipper-action", "");
		}
	}
	
	function strContain(inString, searchedWord) {
		if (inString === null || searchedWord === null || searchedWord.length > inString.length) {
			return false;
		}
		
		var counter = 0;
		while(searchedWord.length + counter <= inString.length) {
			if(inString.substring(counter, searchedWord.length + counter) === searchedWord) {
				return true;
			}
			
			counter++;
		}
		
		return false;
	}
	
	function getBackgroundPathByFlipperContainer(container) {
		return /url\(.*?(image.+?\.jpg).+?\)/.exec(container.children[0].style.background)[1];
	}
	
	var gamePanel = document.getElementById("game-panel");
	function panels() {
		var gamePanel = document.querySelector("#game-panel");
		var games = document.querySelector("#game-panel > #games");
		games.style.borderBottom = "1px solid black";
		games.style.borderRight = "1px solid black";
		games.style.borderLeft = "1px solid black";
		var tabs = document.querySelectorAll("#game-panel > ul > li");
		var currentTab = tabs[0];
		var currentTabAlt = getCurrentTabAlt(currentTab);
		var pageByAlt = getPageByAlt(currentTabAlt);
		pageByAlt.style.display = "block";
		drawCurrentTabBorders(currentTab);
		drawOtherTabsBottomBorder(tabs, currentTab);
		for(var i = 0; i < tabs.length; i++) {
			tabs[i].addEventListener("click", function(t) {
				var target = t.currentTarget;
				if(target != currentTab) {
					currentTabAlt = getCurrentTabAlt(target);
					clearOldTab(currentTab);
					currentTab = target;
					pageByAlt.style.display = "none";
					pageByAlt = getPageByAlt(currentTabAlt);
					pageByAlt.style.display = "block";
					drawCurrentTabBorders(currentTab);
					drawOtherTabsBottomBorder(tabs, currentTab);
					clearCurrentTabBottomBorder(currentTab);
				}
			}, false);
		}
	}
	
	function getPageByAlt(currentTabAlt) {
		return document.getElementById(currentTabAlt);
	}
	
	function getCurrentTabAlt(tab) {
		return tab.childNodes[0].alt;
	}
	
	function clearCurrentTabBottomBorder(tab) {
		tab.style.borderBottom = "none";
	}
	
	function clearOldTab(tab) {
		tab.style.borderTop = "none";
		tab.style.borderRight = "none";
		tab.style.borderLeft = "none";
		tab.style.borderBottom = "none";
	}
	
	function drawOtherTabsBottomBorder(tabs, currentTab) {
		for(var i = 0; i < tabs.length; i++) {
			if(tabs[i] != currentTab) {
				tabs[i].style.borderBottom = "1px solid black";
			}
		}
	}
	
	function drawCurrentTabBorders(tab) {
		tab.style.borderTop = "1px solid black";
		tab.style.borderRight = "1px solid black";
		tab.style.borderLeft = "1px solid black";
	}
	
	var question = document.getElementById("question");
	function changeToPersonPanel() {
		question.style.display = "block";
		innerWrapper.style.display = "none";
		gamePanel.style.display = "block";
		panels();
	}
})();

this.oncontextmenu = function () {
	return false;
}

this.onselectstart = function () {
	return false;
}

this.ondragstart = function() {
	return false;
}