
var tabsIds 	 = [
						"quick-reports",
						"my-folders",
						"my-team-folders",
						"public-folders"
];

var urlsNamesIds = [
						"name1",
						"name2",
						"name3"
]

var urlsIds 	 = [
						"url1",
						"url2",
						"url3"
]


window.onload = function(){

	var hashString = window.location.hash;
	if ( hashString == '' ) {
		window.location.hash = ( "/quick-reports" ); //by default show quick - reports frame
	}

	for ( i = 0; i < tabsIds.length; ++i ) {
		document.getElementById(tabsIds[i]).onclick = handleTabClick;
	}

	for ( i = 0; i < urlsNamesIds.length; ++i) {
		document.getElementById(urlsNamesIds[i]).onchange = handleNameChange;
	}

	handleTabChange(-1, 0);

	saveQuickReportButton = document.getElementById('save-quick-report-button');
	saveQuickReportButton.onclick = handleSaveURLs;	

}


function handleTabClick() {

	handleTabChange(this, 1)
}

/*
 * Handle navigation between tabs function.
 * Description: change the url when it's tab click and show the relevant tab frame\
 * 				or just show the relevant tab on page reload.
 * Parameters: 
 			 - element: the li element was clicked if the function\
 			  			was called by tab click, or -1 if it's page\
 			  			reload.
 			 - isClick: equal to 1 if it's a click call or 0 if it\
 			 			is a reload call.
 * Returns: nothing.
*/
function handleTabChange(element, isClick) {

	if( isClick === 1 ) {
		window.location.hash = ( "/" + element.id );
		var frameElementPrefix = element.id;

	for ( i = 0; i < tabsIds.length; ++i ) {
		TabLi = document.getElementById( tabsIds[i] );
		TabFrame = document.getElementById( tabsIds[i] + '-frame' );
		TabFrame.style.display = "none";
		TabLi.style.backgroundColor = "#646464";
		TabLi.style.color = "white";
	}

	}
	else {
		var hashString = window.location.hash;
		if(hashString == '') {
			return ;
		}
		var frameElementPrefix = hashString.substring(2);
	}

	var currentTab = document.getElementById( frameElementPrefix + "-frame" );
	var currentTabLi = document.getElementById( frameElementPrefix );
	currentTab.style.display = "block";
	currentTabLi.style.backgroundColor = "#EBEBEB";
	currentTabLi.style.color = "black";
}


function handleNameChange() {
	var urlNumber = this.id.substring(4);
	var thisUrl = document.getElementById( "url" + urlNumber );

	if( ( this.value == undefined ) || ( this.value == '' ) ) {
		thisUrl.required = false;
		thisUrl.style.border = "none";
	}
	else {
			thisUrl.required = true;
			//thisUrl.style.border = "solid red";
	}

}

 function handleSaveURLs() {

 	//alert('save form')

	for ( i = 0; i < urlsNamesIds.length; ++i) {
		currentUrlName = document.getElementById(urlsNamesIds[i])
		currentUrl = document.getElementById(urlsIds[i])
		if ( currentUrlName.value != '' ) {
			if ( currentUrl.value != '') {
				if ( isUrl( currentUrl.value ) ) {	
					localStorage.setItem("", "");
				}
			}
		}
	}

 	//return false;
 }

/*
check wheter str is in url format or not
*/
function isUrl(str) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(str);
}