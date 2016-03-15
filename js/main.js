
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

var optionsIds	= [
						"option1",
						"option2",
						"option3"
]

var exmpUserData 	 = {
					quickReportsData:[
						 {
								name :'',
								url  :''
							},

						 {
								name :'',
								url  :''
						},

						 {
								name :'',
								url  :''
						}
					],

					myTeamData:[
						 {
								name :'',
								url  :''
							},

						 {
								name :'',
								url  :''
						},

						 {
								name :'',
								url  :''
						}
					]

};
window.onload = function(){

	//restore the last tab
	var hashString = window.location.hash;
	var lastTab = UTILS.loadStorage().lastTab;
	window.location.hash = ( "/" + lastTab );

	// set the on click event listener to all the tabs
	for ( i = 0; i < tabsIds.length; ++i ) {
		document.getElementById(tabsIds[i]).onclick = handleTabClick;
	}

	// set the on change event listener to all the urls' names' inputs
	for ( i = 0; i < urlsNamesIds.length; ++i) {
		document.getElementById(urlsNamesIds[i]).onchange = handleNameChange;
	}

	// set the on change event listener to all the urls' inputs
	for ( i = 0; i < urlsIds.length; ++i) {
		document.getElementById(urlsIds[i]).onchange = handleUrlChange;
	}

	// on reload go to the relevant (last) tab
	handleTabChange(-1, 0);

	// set the on click listener to the save button
	saveQuickReportButton = document.getElementById('save-quick-report-button');
	saveQuickReportButton.onclick = handleSaveURLs;	

	document.getElementById('quick-reports-settings-button').onclick = handleSettingClick;
	document.getElementById('quick-reports-cancel-settings-button').onclick = handleCancelSettingClick;
	document.getElementById('external-website-frame-button').onclick = handleExternalWebsite;

	/* get the config.json file and handle the data via the
	   handleConfigData function */
	UTILS.ajax("data/config.json", {
									method	: 'get',
									done  	: handleConfigData
	});

	/* on load update the setting data in the Quick Reports tab and
	  in the My Team Folders tab according to localStorage*/
	updateUserDataOnTheScreen();

	updateDropDownList();

}

function updateUserDataOnTheScreen() {

	var data = UTILS.loadStorage();

	// Update Quick Reports data
	var quickReportsData = data.quickReportsData
	for( i = 0; i < quickReportsData.length; ++i ) {
		
		var currentUrlName 			= document.getElementById( urlsNamesIds[i] );
		var currentUrl 				= document.getElementById( urlsIds[i] );

		currentUrlName.value		= quickReportsData[i].name;
		currentUrl.value 			= quickReportsData[i].url;
	}

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

		//update the lastTab
		data = UTILS.loadStorage();
		data.lastTab = element.id;
		UTILS.storeStorage(data);

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

function handleExternalWebsite() {

}

/*
 * Handle urls names (labels) change
 * Description: on name change make its url input as required
*/

function handleNameChange() {
	var urlNumber 				= this.id.substring(4);
	var thisUrl				 	= document.getElementById( "url" + urlNumber );

	if( ( this.value == undefined ) || ( this.value == '' ) ) {
		thisUrl.required 			= false;
		thisUrl.style.border.color 	= "transparent";
	}
	else {
			thisUrl.required 		= true;
			thisUrl.style.border 	= "solid red";
	}

}


/*
 * Handle urls change
 * Description: on url change make its url input as required
 * SHOULD BE UPDATED !!!
*/

function handleUrlChange() {
	var nameNumber 				= this.id.substring(3);
	var thisName				= document.getElementById( "name" + nameNumber );

	if ( UTILS.notEmpty(thisName.value) ) {
		this.required = true;
		if ( !UTILS.notEmpty(this.value) || !UTILS.isUrl(this.value) ) {

			this.style.border.color = "solid red";

		}
		else {

			this.style.border.color = "transparent";

		}
	}
	else {
		if ( UTILS.notEmpty(this.value) ) {

			thisName.required = true;
			thisName.style.border.color = "solid red";
		}
		else {

			thisName.required 			= false;
			this.required 				= false;
		}
	}

}


 function handleSaveURLs() {

 	//alert('save form')
 	var newData = UTILS.loadStorage();
	for ( i = 0; i < urlsNamesIds.length; ++i) {

		currentUrlName 		= document.getElementById(urlsNamesIds[i]);
		currentUrl 			= document.getElementById(urlsIds[i]);

		if ( UTILS.isUrl( currentUrl.value ) || ( ( currentUrlName.value == '' ) && ( currentUrl.value == '' ) )) {
		
			newData.quickReportsData[i] = {
				name	: currentUrlName.value,
				url		: currentUrl.value
			}

			//alert(localStorage.url1);		
		}
	}

	UTILS.storeStorage(newData);

	updateDropDownList();
	document.getElementById('quick-reports-settings-button').style.display = "none";
 	//return false;
 }


function updateDropDownList() {
	var dropDownList 			= document.getElementById("quick-reports-drop-down-links");
	dropDownList.innerHTML 		= "";
	dropDownList.onchange = handleOptionClick;

	// Update the drop-down list at the quick reports tab
	for ( i = 0; i < urlsNamesIds.length; ++i) {
		currentUrlName 					= document.getElementById(urlsNamesIds[i]);
		currentUrl 						= document.getElementById(urlsIds[i]);
		if ( UTILS.notEmpty(currentUrlName.value) && UTILS.notEmpty(currentUrl.value) ) {
			dropDownList.style.display  = "inline-block";

			var currentOption			= document.createElement("OPTION");

			currentOption.value 		= currentUrl.value;
			currentOption.innerHTML 	= currentUrlName.value;

 			dropDownList.appendChild(currentOption);
		}
	}

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
	mainNav 		  = document.getElementById('main-nav');
	mainNav.innerHTML = "";

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


function handleSettingClick() {

	if ( this.id == 'quick-reports-settings-button' ) {

		document.getElementById('quick-reports-settings').style.display = "block";

	}

	else if ( this.id == 'my-team-folders-settings-button' ) {
		//handle this case
	}
}




function handleCancelSettingClick() {

	if ( this.id == 'quick-reports-cancel-settings-button' ) {

		document.getElementById('quick-reports-settings').style.display = "none";

	}

	else if ( this.id == 'my-team-folders-cancel-settings-button' ) {
		//handle this case
	}
}

function handleOptionClick() {
	document.getElementById('quick-reports-iframe').setAttribute('src', this.value);
	document.getElementById('external-website-frame-button').setAttribute('href', this.value);
}