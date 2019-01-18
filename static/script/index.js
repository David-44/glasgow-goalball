"use strict";




// Viewport sizes

const vSmallViewport = 500,
	  smallViewport  = 800,
	  mediumViewport = 1000,
	  largeViewport  = 1200,
	  maxViewport    = 1400;





// Sitewide Elements

const navMenus  = document.getElementById("nav-menus"),
	  hamburg   = document.getElementById("hamburger"),
	  currentYear = document.getElementById("year"),
	  iFrames   = document.getElementsByTagName("iframe"),

		preview = document.getElementById("preview"),
		title = document.getElementById("title"),
		test = document.getElementById("text"),
		blogPreview = document.getElementById("blog-preview");





// Helper functions


let addZero = function(num){
  if (num.toString.length == 1) {num = "0" + num;}
  return num;
};


function toArray(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) {
    array[i] = obj[i];
  }
  return array;
}


function toggleMenus(){
	navMenus.classList.remove("is-hidden");
	navMenus.classList.toggle("nav-menus__open");
}


function hideMenusSmallScreen(){
	if (window.innerWidth >= smallViewport) {
		navMenus.classList.remove("is-hidden");
	} else {
		navMenus.classList.add("is-hidden");
	}
	navMenus.classList.remove("nav-menus__open");
}


function resizeIframe(obj) {
	// Safari seems to believe that the content window's width is always 0 for trnasforming lives and calendar...
	obj.style.height = obj.contentWindow.innerWidth === 0 ? "300px" : obj.contentWindow.innerWidth * 0.5625 + "px";
 }




// previewing a blog Post
function buildPost() {
	let file = document.getElementById('image').files[0];
	let now = new Date();
	let datetime = now.getFullYear() + "-" + addZero(now.getMonth() + 1) + "-" + addZero(now.getDate());

	let article = '<article class="news-article article" role="region">';
	article += '<h3 class="section-subtitle">' + title.value;
	article += '<time class="article-date" datetime="' + datetime + '">' + now.toLocaleDateString("en-GB") + '</time></h3>';
	article +='<p>' + text.value.replace(/\r?\n/g, '<br />') + '</p></article>';

	if(file) {
		article += "<img class='blog-image' src= '" + URL.createObjectURL(file) + "'>"
	}

	blogPreview.innerHTML = article;
}




// Init

const init = function() {

	hideMenusSmallScreen();
	currentYear.innerHTML = new Date().getFullYear().toString();

	// Events
	hamburg.onclick = toggleMenus;
	window.onresize = hideMenusSmallScreen;
	if (preview) {
		preview.onclick = buildPost;
	}

	// keep last because sometimes it blocks due to cross-origin error
	toArray(iFrames).forEach(function(frame){
		resizeIframe(frame);
	});

}();
