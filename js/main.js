
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


	UTILS.ajax("data/config.json", {
									method	: 'get',
									done  	: handleConfigData
	});

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



function handleConfigData(result) {
										
	result 				= JSON.parse(result);

	//update the notification area
	notification 		= result.notification;
	notificationElement = document.getElementById('notification-area');
	//alert(notification);
	if( ( notification != undefined ) && ( notification !== '' ) ) {
		notificationElement.innerHTML = result.notification;
	}
	else {
		notificationElement.display   = "none";
	}


	//udpade the quick actions links
	mainNav = document.getElementById('main-nav');

	quickActions = result.quickActions;
	for ( i = 0; i < quickActions.length; ++i ) {

		var currentMainDiv 						= document.createElement("DIV"); 
		currentMainDiv.className				= "nav-section";
		currentMainDiv.style.backgroundImage 	= "url('img/icons/" + quickActions[i].icon + ".png')"

		var mainLabel							= document.createElement("P");
		mainLabel.innerHTML						= quickActions[i].label;

		currentMainDiv.appendChild(mainLabel);

		var menuDiv 							= document.createElement("DIV");
		menuDiv.className 						= "menu";

		var menuCaptionDiv						= document.createElement("DIV");
		menuCaptionDiv.className 				= "menu-caption";

		var menuCaptionPar 						= document.createElement("P");
		menuCaptionPar.innerHTML 				= quickActions[i].actionsLabel;

		menuCaptionDiv.appendChild(menuCaptionPar);
		menuDiv.appendChild(menuCaptionDiv);

		var currentUl 							= document.createElement("UL"); 
		currentUl.className						= "action-list";

		quickLinks = quickActions[i];

		//for every ul update its lis
		for ( j = 0; j < quickLinks.actions.length; ++j ) {

			var currentLi 						= document.createElement("LI");  
			var currentALink 					= document.createElement("A"); 

			currentALink.innerHTML 				= quickLinks.actions[j].label;
			currentALink.href					= quickLinks.actions[j].url;

			currentLi.appendChild(currentALink);
			currentUl.appendChild(currentLi);
		}

		menuDiv.appendChild(currentUl);
		currentMainDiv.appendChild(menuDiv);
		mainNav.appendChild(currentMainDiv);

	}



	//update the fixed iframes
	tabList = result.tabsList;

	//my folder iframe
	myFoldersDiv	 = document.getElementById('my-folders-frame');
	myFoldersframe   = document.createElement("IFRAME");
	myFoldersframe.setAttribute('src',tabList[1].options.url);
	myFoldersDiv.appendChild(myFoldersframe);

	//public folders iframe
	publicFoldersDiv	 = document.getElementById('public-folders-frame');
	publicFoldersframe   = document.createElement("IFRAME");
	publicFoldersframe.setAttribute('src',tabList[3].options.url);
	publicFoldersDiv.appendChild(publicFoldersframe);
}

/*
 * check whether str is in url format or not
*/
function isUrl(str) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(str);
}