// show hide toggle visible.
// var global_q = "word";
var global_q = "word";
var global_params = "&keyfrom=mdict.3.0.1.iphone&vendor=AppStore&version=iphone_3.0&version=iphone_3.0";
var image_path="";
function collinsTitleChange(block){var span=$(block+"_t");if(span){var t = span.innerHTML;if(t=="+"){span.innerHTML="-";}else{span.innerHTML="+";}}}
function showCollinsContent(block){var span=$(block+"_t");if(span){span.innerHTML="-";}showDefinition(block);}
function showSpecSent(){var ss=document.all('special_sent');if(!ss.length){ss.show();}for(i=0;i<ss.length;i++){ss[i].show();}var btn=$('lookSent');btn.hide();}
if ( !window.Element )
{
        Element = function(){}

        var __createElement = document.createElement;
        document.createElement = function(tagName)
        {
        	var element = __createElement(tagName);
        	for(var key in Element.prototype)
        		element[key] = Element.prototype[key];
        	return element;
        }

        var __getElementById = document.getElementById
        document.getElementById = function(id)
        {
        	var element = __getElementById(id);
			if	(element != null){
				for(var key in Element.prototype)
					element[key] = Element.prototype[key];
			}
        	return element;
        }
}

Element.prototype.visible = function() {
	return this.style.display != 'none';
};
Element.prototype.hide = function() {
	this.style.display = 'none';
};
Element.prototype.show = function() {
	this.style.display = '';
};
Element.prototype.toggle = function() {
	if (this.visible()) {
		this.hide();
	} else {
		this.show();
	}
};

var isDebug = false;
var proxy_server_url = "http://dict.youdao.com/dp/";
if (isDebug) {
    proxy_server_url = "http://tb104x.corp.youdao.com:1122/";
}


// ajax
HTTP={}
HTTP.newRequest = function () {
	if (window.ActiveXObject) {
		return new ActiveXObject('Microsoft.XMLHTTP');
	} else if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else {
		 return false;
	}
};
HTTP.getText = function(url, callback) {
	window.location = "cmd://nav/" + callback;
	var request = HTTP.newRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			callback(request.responseText);
		}
	};
	
	request.open("GET", url);
	request.send(null);
};
// ajax end
function $(x) {
	return document.getElementById(x);
}
function displayImg(block){
	// we got two kinds of css in v1.0 and v1.1, this code will make both of them work.
	var blockImg = $(block + "_right");
	if (blockImg) {
		if (blockImg.tagName == "DIV") {	// it's div in v1.1
			blockImg.className = "title_right_display";
		} else {	// it's img in v1.0
			blockImg.src = image_path + "title_right_display.gif";
		}
	}
}
function foldImg(block){
	var blockImg = $(block + "_right");
	if (blockImg) {
		if (blockImg.tagName == "DIV") {
			blockImg.className = "title_right_fold";
		} else {
			blockImg.src = image_path + "title_right_fold.gif";
		}
	}
}
var getElemXY = function (elem) {
	var sumTop = 0;
	var sumLeft = 0;
	while (elem) {
		sumLeft += elem.offsetLeft  || 0;
		sumTop += elem.offsetTop  || 0;
		elem = elem.offsetParent;
	}
	return {x:sumLeft, y:sumTop};
};
function loadingNext() {
	$("main").hide();
	$("loading_tip").show();
}
function cancelLoading() {
	$("loading_tip").hide();
	$("main").show();
}
function trimBlank(i) {
	var str = i.innerHTML;
	i.innerHTML = str.replace(/\s/gi,"");
}
function changeBlock(hideId, showId) {
	$(hideId).hide();
	$(showId).show();
}
function showDefinition(block) {
	// 如果block这个id存在，并且有内容，我们只是将其变成hidden，如果不存在，则需要下载。
	var eleBlock = $(block);
	if (eleBlock) {
		var blockBody = $(block+"_body");
		displayImg(block);
		if (blockBody) {
			blockBody.show();
		} else {
			var additionalParam = eleBlock.getAttribute("addP") || "";
			var prefixQuery = eleBlock.getAttribute("preQ") || "";
			var suffixQuery = eleBlock.getAttribute("sufQ") || "";
			$(block).innerHTML = ("<p align=center><img align='absmiddle' src='" + image_path + "loading.gif' width='35'/><b>加载中...</b></p>");
			HTTP.getText(proxy_server_url + "dp?block=" + block + additionalParam + "&q=" + prefixQuery + encodeURIComponent(global_q) + suffixQuery + global_params, function(transport) {
				$(block).innerHTML = transport;
			}
			);
		}
	}
}
function loadMoreLj() {
	var moreSentenseDiv = $("more_sentence");
	$("more_lj").innerHTML = ("<img align='absmiddle' src='" + image_path + "loading.gif' width='35'><b>更多例句加载中...</b>");
	HTTP.getText(proxy_server_url + "dp?block=morelj&q=lj:" + encodeURIComponent(global_q) + global_params, function(transport) {
		moreSentenseDiv.innerHTML = transport;
		$("more_lj").hide();
	}
	);
}
function loadMoreBlock(divName, tipTagName, blockName, additionalParam, prefixQuery, suffixQuery, loadingString) {
	additionalParam = additionalParam || "";
	prefixQuery = prefixQuery || "";
	suffixQuery = suffixQuery || "";
	loadingString = loadingString || "加载中...";
	var moreContentDiv = $(divName);
	$(tipTagName).innerHTML = ("<img align='absmiddle' src='" + image_path + "loading.gif' width='35'><b>"+loadingString+"</b>");
	HTTP.getText(proxy_server_url + "dp?block=" + blockName + additionalParam + "&q=" + prefixQuery + encodeURIComponent(global_q) + suffixQuery + global_params, function(transport) {
		moreContentDiv.innerHTML = transport;
		$(tipTagName).hide();
	}
	);
}
function fold(block) {
	var blockBody = $(block+"_body");
	if (blockBody) {
		window.scrollTo(0, getElemXY(blockBody).y-43);
	}
	hideDefinition(block);
}
function hideDefinition(block) {
	var blockBody = $(block+"_body");
	if (blockBody) {
		foldImg(block);
		blockBody.hide();
	}
}
function toggleShowHide(block) {
	var blockBody = $(block+"_body");
	if (blockBody) {
		blockBody.toggle();
		if (blockBody.visible()) {
			displayImg(block);
		} else {
			foldImg(block);
		}
	} else {
		showDefinition(block);
	}
}
function showAll() {
	var elems = getBlocks($("main"));
	if (elems.length > 0) {
		for (var i = 0; i < elems.length; i++) {
			showDefinition(elems[i].id);
		}
	} else {
		var blocks = ['ee', 'hh', 'auth', 'phrase', 'synonyms', 'web', 'authsent', 'sentence', 'baike'];
		for (var i = 0; i < blocks.length; i++) {
			showDefinition(blocks[i]);
		}
	}
}
function hideAll() {
	var elems = getBlocks($("main"));
	if (elems.length > 0) {
		for (var i = 0; i < elems.length; i++) {
			hideDefinition(elems[i].id);
		}
	} else {
		var blocks = ['ee', 'hh', 'auth', 'phrase', 'synonyms', 'web', 'authsent', 'sentence', 'baike'];
		for (var i = 0; i < blocks.length; i++) {
			hideDefinition(blocks[i]);
		}
	}
}
function getBlocks(element) {
	var children = element.childNodes;
	var elems = [];
	if (children) {
		for (var i=0; i<children.length; i++) {
			if (children[i].nodeType == document.ELEMENT_NODE) {
				if (children[i].tagName == "DIV" && children[i].getAttribute("foldable")) {
					elems.push(children[i]);
				}
			}
		}
	}
	return elems;
}
function changeBlock(block) {
	var blockBody = $(block+"_body");
	if (blockBody) {
		blockBody.show();
		var blockTab = $(block+"_tab");
		if (blockTab) {
			blockTab.className = "active";
		}
		var container = blockBody.parentNode;
		if (container) {
			var children = container.childNodes;
			if (children) {
				for (var i = 0; i < children.length; i++) {
					if (children[i].nodeType == document.ELEMENT_NODE) {
						var indexBlockName = children[i].id.indexOf("_body");
						if (children[i].tagName == "DIV" && indexBlockName > 0) {
							var childName = children[i].id.substring(0, indexBlockName);
							if (childName != block) {
								children[i].hide();
								var childTab = $(childName+"_tab");
								if (childTab) {
									childTab.className = "";
								}
							}
						}
					}
				}
			}
		}
	}
}

// the follow fuctions is used in iPhoneDict
// because iOS's webkit doesn's surpport Objective-C and JavaScript Bindings
// so we thought some more logic to implement its Interactive 
function localFold(block) {

    fold(block);
    window.location = "disphide:" + block.toString();
}

function localShowHide(block) {
	var blockBody = $(block+"_body");
	if (blockBody) {

		blockBody.toggle();
		if (blockBody.visible()) {
			displayImg(block);
            window.location = "dispshow:" + block.toString();
		} else {
			foldImg(block);
            window.location = "disphide:" + block.toString();
		}
	}
}

function showMoreResult(block) {
    var blockBodyPart = $(block+"_body_part");
    if (blockBodyPart) {
        blockBodyPart.hide();
    }
    
    var blockBodyFull = $(block+"_body_full");
    if (blockBodyFull) {
        blockBodyFull.show();
    }
}
