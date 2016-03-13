
// global arrays wich help the developer(s) prevent badly duplicate code.

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

var userData 	 = {
					quickReportsData:{
						data1: {
								name :'comverse',
								url  :'http://charlie10.github.io/comverse/'
							},

						data2: {
								name :'',
								url  :''
						},

						data3: {
								name :'ynet',
								url  :'http://ynet.co.il'
						}
					},

					myTeamData:{
						data1: {
								name :'',
								url  :''
							},

						data2: {
								name :'comverse',
								url  :'http://charlie10.github.io/comverse/'
						},

						data3: {
								name :'ynet',
								url  :'http://ynet.co.il'
						}
					}

};
window.onload = function(){

	var hashString = window.location.hash;
	if ( hashString == '' ) {
		window.location.hash = ( "/quick-reports" ); //by default show quick - reports frame
	}

	// set the on click event listener to all the tabs
	for ( i = 0; i < tabsIds.length; ++i ) {
		document.getElementById(tabsIds[i]).onclick = handleTabClick;
	}

	// set the on change event listener to all the urls' names' inputs
	for ( i = 0; i < urlsNamesIds.length; ++i) {
		document.getElementById(urlsNamesIds[i]).onchange = handleNameChange;
	}

	// on reload go to the relevant (last) tab
	handleTabChange(-1, 0);

	// set the on click listener to the save button
	saveQuickReportButton = document.getElementById('save-quick-report-button');
	saveQuickReportButton.onclick = handleSaveURLs;	

	/* on load update the setting data in the Quick Reports tab and
	  in the My Team Folders tab according to localStorage*/
	  updateSettings();

	/* get the config.json file and handle the data via the
	   handleConfigData function */
	UTILS.ajax("data/config.json", {
									method	: 'get',
									done  	: handleConfigData
	});

}

/*
 * on tab click call the handleTabChange function with IsClick = 1
*/

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

	if( isClick === 1 ) { // handle tab click
		window.location.hash 				= ( "/" + element.id );
		var frameElementPrefix 				= element.id;


	}
	else { // handle page reloading
		var hashString 						= window.location.hash;
		if(hashString == '') {
			return ;
		}
		var frameElementPrefix 				= hashString.substring(2);
	}

	for ( i = 0; i < tabsIds.length; ++i ) {
		// restore all the tabs to the default state
		TabLi 								= document.getElementById( tabsIds[i] );
		TabFrame							= document.getElementById( tabsIds[i] + '-frame' );
		TabFrame.style.display 				= "none";
		TabLi.style.backgroundColor 		= "#646464";
		TabLi.style.color 					= "white";
	}

	// view only the current tab.
	var currentTab 							= document.getElementById( frameElementPrefix + "-frame" );
	var currentTabLi 						= document.getElementById( frameElementPrefix );
	currentTab.style.display 				= "block";
	currentTabLi.style.backgroundColor 		= "#EBEBEB";
	currentTabLi.style.color 				= "black";
}

/*
 * Handle urls names (labels) change
 * Description: on name change define its url input as required
*/

function handleNameChange() {
	var urlNumber 				= this.id.substring(4);
	var thisUrl				 	= document.getElementById( "url" + urlNumber );

	if( ( this.value == undefined ) || ( this.value == '' ) ) {
		thisUrl.required 		= false;
		thisUrl.style.border 	= "none";
	}
	else {
			thisUrl.required 	= true;
			//thisUrl.style.border = "solid red";
	}

}


 function handleSaveURLs() {

 	//alert('save form')

	for ( i = 0; i < urlsNamesIds.length; ++i) {
		currentUrlName 		= document.getElementById(urlsNamesIds[i])
		currentUrl 			= document.getElementById(urlsIds[i])
		if ( currentUrlName.value != '' ) {
			if ( currentUrl.value != '') {
				if ( UTILS.isUrl( currentUrl.value ) ) {	
				/*	userData[ 'data' + i ] = {
						'name'	: currentUrlName.value,
						'url'	: currentUrl.value
					}
					localStorage.setItem("url"+i , userData[i].url);
					alert(localStorage.url1);
				*/

				}
			}
		}
	}

 	//return false;
 }


/*
 * Handle the data we got from the config.json file function.
 * Description: Create and update the HTML elements according to the data 
 				read from the config.json file.
 * Parameters: 
 			 - result: The data got from the config.json file
					  via the get method.
 * Returns: nothing.
*/
function handleConfigData(result) {
					
	/* if result is not in json format 				
	   parse it to json.
	*/
	if ( ! UTILS.isObject (  result ) ) {
		result 			= JSON.parse(result);
	}

	/********************************
	* Update the notification area
	*********************************/
	notification 		= result.notification;
	notificationElement = document.getElementById('notification-area');
	//alert(notification);
	if( ( notification != undefined ) && ( notification !== '' ) ) {
		notificationElement.innerHTML = result.notification;
	}
	else {
		notificationElement.display   = "none";
	}

	/********************************
	* Update the quick actions links
	*********************************/
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



	/****************************
	* Update the fixed iframes
	****************************/
	tabList = result.tabsList;

	//my folder iframe
	myFoldersDiv		 = document.getElementById('my-folders-frame');
	myFoldersframe  	 = document.createElement("IFRAME");
	myFoldersframe.setAttribute('src',tabList[1].options.url);
	myFoldersDiv.appendChild(myFoldersframe);

	//public folders iframe
	publicFoldersDiv	 = document.getElementById('public-folders-frame');
	publicFoldersframe   = document.createElement("IFRAME");
	publicFoldersframe.setAttribute('src',tabList[3].options.url);
	publicFoldersDiv.appendChild(publicFoldersframe);
}



function updateSettings() {
	//alert('update');
}