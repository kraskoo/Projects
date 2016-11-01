(function() {
    if(!Storage.prototype.setObject) {
        Storage.prototype.setObject = function setObject(key, obj) {
            this.setItem(key, JSON.stringify(obj));
        };
    }

    if(!Storage.prototype.getObject) {
        Storage.prototype.getObject = function getObject(key) {
            return JSON.parse(this.getItem(key));
        };
    }

    if(!this.Object.prototype.addToObject) {
        this.Object.prototype.addToObject = function addToObject(key, value) {
            this[key] = value;
        };
    }

    if(!this.Object.prototype.getObjectValue) {
        this.Object.prototype.getObjectValue = function getObjectValue(key) {
            return this[key];
        };
    }
})();

this.onload = function() {
    if(localStorage.getObject('rateImages') === null) {
        var rateImages = {
            'image0' : 1 
        }

        for(var i = 1; i < 25; i++) {
            rateImages.addToObject(('image' + i), 1)
        }

        localStorage.setObject('rateImages', rateImages);
    }
    
    var articlesNumber = document.querySelectorAll("articlenumber");
    var figures = document.querySelectorAll("article > figure");
    var contextmenu = document.getElementById("contextmenu");
    var contextmenuChoise = document.querySelector("#contextmenu > #choise");
    var contextmenuInfo = document.querySelector("#contextmenu > #info");
    var contextmenuBigSize = document.querySelector("#contextmenu > #big");
    var contextmenuRateCount = document.querySelector("#contextmenu > #rateCount");
    var hasShownContextMenu = false;
    var hasShownLargeImage = false; 
    var lastArticleNumber = -1;
    var lastSelected = -1;
	// ***Uncomment this allows you to have more than one page
    // var nextButton = document.getElementById("nextButton");
    // var previousButton = document.getElementById("previousButton");
    var backButton = document.getElementById("backButton");
    var articles = document.querySelectorAll("article");
    var articleIndex = 0;
    var voteIndex = parseInt(document.getElementById("voteIndex").innerHTML);
    var voteButton = document.getElementById("vote");
    var takenVotes = [];
    var percentageCells = document.querySelectorAll("#rateState > #percentageCell");
    var unfillCell = document.querySelectorAll("#rateState > #unfillCell");
    var cells = document.querySelectorAll("#rateState > #cell");
    var rateVotes = document.querySelectorAll("#rateState > #rateVote");
    var percentageFiller = 0;
    for(var i = 0; i < percentageCells.length; i++) {
        percentageFiller = (i * 18) + 12;
        percentageCells[i].style.left = percentageFiller + "px";
        unfillCell[i].style.left = 31 + percentageFiller + "px";
        cells[i].style.left = 31 + percentageFiller + "px";
        rateVotes[i].style.left = 31 + percentageFiller + "px";
    }

	// ***Uncomment this allows you to have more than one page
    // nextButton.addEventListener("click", function() {
        // articles[articleIndex].style.display = "none";
        // articleIndex++;
        // if(articleIndex == articles.length) {
            // articleIndex = 0;
        // }

        // articles[articleIndex].style.display = "block";
    // }, false);
    // previousButton.addEventListener("click", function() {
        // articles[articleIndex].style.display = "none";
        // articleIndex--;
        // if(articleIndex == -1) {
            // articleIndex = articles.length - 1;
        // }

        // articles[articleIndex].style.display = "block";
    // }, false);

    this.addEventListener("click", function() {
        if(hasShownContextMenu) {
            contextmenu.removeAttribute("style");
            contextmenu.style.display = "none";
            hasShownContextMenu = false;
        }
        
        if(hasShownLargeImage) {
            var largeImageId = document.getElementById("largeImage");
            document.getElementById("main").removeChild(largeImageId);
            hasShownLargeImage = false;
        }
        
        if(lastArticleNumber !== -1 && getStyleValueByElement(lastArticleNumber, "display") === "block") {
            lastArticleNumber.removeAttribute("style");
            lastArticleNumber = -1;
        }
    }, true);

    contextmenuChoise.addEventListener("click", function() {
        if(lastSelected != -1) {
            var lastSelectedIndex = parseInt(lastSelected.getAttribute("index"));
            var hasSelected = lastSelected.getAttribute("hasSelect");
            if(hasSelected === "false" && voteIndex >= 1) {
                lastSelected.style.backgroundColor = "#D67B19";
                lastSelected.setAttribute("hasSelect", "true");
                voteIndex--;
                document.getElementById("voteIndex").innerHTML = voteIndex;
                if(parseInt(document.getElementById("voteIndex").innerHTML) < 10) {
                    voteButton.style.display = "block";
                }

                takenVotes.push(lastSelectedIndex);
            } else if(hasSelected === "true") {
                lastSelected.style.backgroundColor = "white";
                lastSelected.setAttribute("hasSelect", "false");
                var indexForRemove = takenVotes.indexOf(lastSelectedIndex);
                if(indexForRemove > -1) {
                    takenVotes.splice(indexForRemove, 1);
                }

                lastSelected = -1;
                voteIndex++;
                document.getElementById("voteIndex").innerHTML = voteIndex;
                if(parseInt(document.getElementById("voteIndex").innerHTML) === 10) {
                    voteButton.style.display = "none";
                }
            }
        }
    }, false);

    contextmenuBigSize.addEventListener("click", function() {
        if(lastSelected != -1) {
            var indexOfLarge = lastSelected.getAttribute("index");
            var imageWindow = document.createElement("div");
            imageWindow.setAttribute("id", "largeImage");
            var newLargeImage = new Image();
            newLargeImage.src = "large-size/" + indexOfLarge + ".png";
            imageWindow.appendChild(newLargeImage);
            document.getElementById("main").appendChild(imageWindow);
            newLargeImage.addEventListener("load", function(ev) {
                var currentWidth = ev.currentTarget.width;
                var thisImgContainer = ev.currentTarget.parentNode;
                if(currentWidth === 800) {
                    thisImgContainer.style.top = "200px";
                    thisImgContainer.style.left = "250px";
                } else {
                    thisImgContainer.style.top = "80px";
                    thisImgContainer.style.left = "350px";
                }
            }, false);
            hasShownLargeImage = true;
        }
    }, false);

    voteButton.addEventListener("click", function() {
        for(var i = 0; i < takenVotes.length; i++) {
            increaseValueByIndex(takenVotes[i]);
        }

        for(var i = 0; i < figures.length; i++) {
            figures[i].setAttribute('hasSelect', 'false');
            figures[i].style.backgroundColor = "white";
        }

        takenVotes.length = 0;
        document.getElementById("voteIndex").innerHTML = 10;
        voteIndex = parseInt(document.getElementById("voteIndex").innerHTML);
        document.getElementById("main").style.display = "none";
        document.getElementById("rateState").style.display = "block";
        var ratedImages = localStorage.getObject('rateImages');
        var sum = 0;
        for(var i = 0; i < cells.length; i++) {
            var indexKey = 'image' + i;
            sum += parseInt(ratedImages.getObjectValue(indexKey));
        }
        
        for(var i = 0; i < cells.length; i++) {
            var key = 'image' + i;
            var cellIndex = parseInt(ratedImages.getObjectValue(key));
            var lengthOfCellIndex = cellIndex.toString().length;
            var valueOfCellIndex = "";
            if(lengthOfCellIndex === 1) {
                valueOfCellIndex = "   " + cellIndex;
            } else if(lengthOfCellIndex === 2) {
                valueOfCellIndex = "  " + cellIndex;
            } else if(lengthOfCellIndex === 3) {
                valueOfCellIndex = " " + cellIndex;
            } else if(lengthOfCellIndex === 4) {
                valueOfCellIndex = cellIndex;
            }

            rateVotes[i].innerHTML = valueOfCellIndex;
            var percentage = (cellIndex / sum) * 100;
            var eachPercentage = percentage * 35;
            if(eachPercentage > 1020) {
                eachPercentage = 1020;
            }

            cells[i].style.height = eachPercentage + "px";
        }
    }, false);

    backButton.addEventListener("click", function() {
        articles[articleIndex].style.display = "none";
        articleIndex = 0;
        articles[articleIndex].style.display = "block";
        document.getElementById("main").style.display = "block";
        document.getElementById("rateState").style.display = "none";
        voteButton.style.display = "none";
    }, false);

    for(var i = 0; i < figures.length; i++) {
        figures[i].addEventListener("click", function(ev) {
            var target = ev.currentTarget;
            var hasSelect = target.getAttribute("hasSelect");
            var index = parseInt(target.getAttribute("index"));
            var key = 'image' + index;
            var cellIndex = parseInt(localStorage.getObject('rateImages').getObjectValue(key));
            contextmenuRateCount.innerHTML = "Votes count: " + cellIndex;
            if(hasSelect === "false") {
                contextmenuChoise.innerHTML = "Mark";
            } else {
                contextmenuChoise.innerHTML = "Unmark";
            }
            
            var y = ev.clientY;
            var x = ev.clientX;
            
            contextmenu.style.left = (x - 300) + "px";
            contextmenu.style.top = (y - 50) + "px";
            contextmenu.style.display = "block";
            if(contextmenu.clientHeight + y >= 1080 && contextmenu.clientWidth + x >= 1920) {
                contextmenu.removeAttribute("style");
                contextmenu.style.right = "50px";
                contextmenu.style.bottom = "50px";
                contextmenu.style.display = "block";
            } else if(contextmenu.clientHeight + y >= 1080) {
                contextmenu.removeAttribute("style");
                contextmenu.style.left = (x - 300) + "px";
                contextmenu.style.bottom = "50px";
                contextmenu.style.display = "block";
            } else if(contextmenu.clientWidth + x >= 1920) {
                contextmenu.removeAttribute("style");
                contextmenu.style.right = "50px";
                contextmenu.style.top = (y - 50) + "px";
                contextmenu.style.display = "block";
            }

            hasShownContextMenu = true;
            contextmenuInfo.addEventListener("click", function() {
                if(lastArticleNumber !== -1 && getStyleValueByElement(lastArticleNumber, "display") === "block") {
                    lastArticleNumber.removeAttribute("style");
                    lastArticleNumber = -1;
                }

                var currentArticleNumber = articlesNumber[index];
                currentArticleNumber.style.top = (y - 80) + "px";
                currentArticleNumber.style.left = (x - 200) + "px";
                currentArticleNumber.style.display = "block";
                if(currentArticleNumber.clientHeight + y >= 1080 && currentArticleNumber.clientWidth + x >= 1920) {
                    currentArticleNumber.removeAttribute("style");
                    currentArticleNumber.style.bottom = "30px";
                    currentArticleNumber.style.right = "30px";
                    currentArticleNumber.style.display = "block";
                } else if(currentArticleNumber.clientHeight + y >= 1080) {
                    currentArticleNumber.removeAttribute("style");
                    currentArticleNumber.style.bottom = "30px";
                    currentArticleNumber.style.left = (x - 200) + "px";
                    currentArticleNumber.style.display = "block";
                } else if(currentArticleNumber.clientWidth + x >= 1920) {
                    currentArticleNumber.removeAttribute("style");
                    currentArticleNumber.style.top = (y - 80) + "px";
                    currentArticleNumber.style.right = "30px";
                    currentArticleNumber.style.display = "block";
                }

                lastArticleNumber = currentArticleNumber;
            }, false);

            lastSelected = target;
        }, false);
    }

    function increaseValueByIndex(index) {
        var indexKey = 'image' + index;
        var rateImages = localStorage.getObject('rateImages');
        var valueByKey = parseInt(rateImages.getObjectValue(indexKey));
        valueByKey++;
        rateImages.addToObject(indexKey, valueByKey);
        localStorage.setObject('rateImages', rateImages);
    }

    function getStyleValueByElement(element, val) {
        return this.getComputedStyle(element, null).getPropertyValue(val);
    }
}

this.oncontextmenu = function() {
    return false;
}

this.ondragstart = function() {
    return false;
}