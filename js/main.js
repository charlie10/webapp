
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


window.onload = function(){

	var hashString = window.location.hash;
	if ( ( hashString == undefined ) || ( hashString == '' )  ) {
		window.location.hash = ( "/quick-reports" ); //by default show quick - reports frame
	}

	//restore the last tab
	var hashString = window.location.hash;
	var lastTab = UTILS.loadStorage().lastTab;
	window.location.hash = ( "/" + lastTab );

	// set the on click event listener to all the tabs
	for ( i = 0; i < tabsIds.length; ++i ) {
		document.getElementById(tabsIds[i]).onclick = handleTabClick;
	}

	// on reload go to the relevant (last) tab
	handleTabChange(-1, 0);

	// set the on click listener to the save button
	saveQuickReportButton = document.getElementById('save-quick-report-button');
	saveQuickReportButton.onclick = handleSaveURLs;	

	document.getElementById('quick-reports-settings-button').onclick = handleSettingClick;
	document.getElementById('quick-reports-cancel-settings-button').onclick = handleCancelSettingClick;

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

	// update the iframe to be the first url
	for ( i = ( quickReportsData.length - 1 ); i >= 0 ; --i ) {

		if( UTILS.notEmpty(quickReportsData[i].url) ) {
			document.getElementById('quick-reports-iframe').setAttribute('src', quickReportsData[i].url);
			document.getElementById('external-website-frame-button').setAttribute('href', quickReportsData[i].url);
		}

	}

	for ( i = 0; i < quickReportsData.length; ++i ) {
		
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

	if ( isClick === 1 ) { // handle tab click
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


/*
 * validate settings input number inputNumber
*/
function validateSettingsInput(inputNumber) {

	var thisName						= document.getElementById( "name" + inputNumber );
	var thisUrl				 			= document.getElementById( "url" + inputNumber );
	var thisNameValue 					=  thisName.value;
	var thisUrlValue 					= thisUrl.value

	if ( UTILS.notEmpty(thisNameValue) ) {

		if ( ( !UTILS.notEmpty(thisUrlValue) ) || ( !UTILS.isUrl(thisUrlValue) ) ) {

			thisUrl.style.border 		= "solid red";
			thisName.style.border 		= "transparent";
			thisUrl.required			= true;

			return false;		

		}
		else {

			thisUrl.style.border 		= "transparent";
			thisName.style.border 		= "transparent";

			return true;

		}

	}
	else {

		if ( UTILS.notEmpty(thisUrlValue) ) {

			thisName.style.border 		= "solid red";
			thisUrl.style.border		= "transparent";
			thisName.required 			= true;

			return false;

		}
		else {

			thisUrl.style.border 		= "transparent";
			thisName.style.border 		= "transparent";
			thisName.required 			= false;
			thisUrl.required			= false;	

			return true;

		}
	}

}

 function handleSaveURLs() {

 	//validate the data
 	for ( i = 1; i <= urlsNamesIds.length; ++i) {

 		if ( validateSettingsInput(i) == false ) {

 			for ( i = i + 1; i <= urlsNamesIds.length; i++) {
 				var thisName						= document.getElementById( "name" + i );
				var thisUrl				 			= document.getElementById( "url" + i );
				thisUrl.style.border		 		= "transparent";
				thisName.style.border 				= "transparent";

 			}
 			return;
 		}
 	}

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

	document.getElementById('quick-reports-settings').style.display				   = "none";
	document.getElementById('quick-reports-settings-button').style.backgroundColor = "inherit";

	UTILS.storeStorage(newData);

	updateDropDownList();
	updateUserDataOnTheScreen();

 }


function updateDropDownList() {
	var dropDownList 			= document.getElementById("quick-reports-drop-down-links");
	dropDownList.innerHTML 		= "";
	dropDownList.onchange = handleOptionClick;
	var urlsCtr 				= 0;
	var externalWebsiteButton 	= document.getElementById('external-website-frame-button');
	var cancelButton  		  	= document.getElementById('quick-reports-cancel-settings-button');

	// Update the drop-down list at the quick reports tab
	for ( i = 0; i < urlsNamesIds.length; ++i) {
		currentUrlName 					= document.getElementById(urlsNamesIds[i]);
		currentUrl 						= document.getElementById(urlsIds[i]);
		if ( UTILS.notEmpty(currentUrlName.value) && UTILS.notEmpty(currentUrl.value) ) {
			
			urlsCtr++;
			var currentOption			= document.createElement("OPTION");

			currentOption.value 		= currentUrl.value;
			currentOption.innerHTML 	= currentUrlName.value;

 			dropDownList.appendChild(currentOption);
		}
	}

	if( urlsCtr > 0) {

		dropDownList.style.display 		    = "inline-block";
		externalWebsiteButton.style.display = "inline-block";
		cancelButton.style.display			= "inline-block";

	}
	else {

		/* If there are no links, hide dropdown list, external 
		   website button and the cancel button*/
		dropDownList.style.display 		    = "none";
		externalWebsiteButton.style.display = "none";
		cancelButton.style.display			= "none";

		document.getElementById('quick-reports-iframe').setAttribute('src', '');
		document.getElementById('external-website-frame-button').setAttribute('href', '');
		document.getElementById('quick-reports-settings').style.display 			   = "block";
		document.getElementById('quick-reports-settings-button').style.backgroundColor = "white";

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
	if ( ( notification != undefined ) && ( notification !== '' ) ) {
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
	this.style.backgroundColor = "white";
}




function handleCancelSettingClick() {

	if ( this.id == 'quick-reports-cancel-settings-button' ) {

		document.getElementById('quick-reports-settings').style.display 			   = "none";
		document.getElementById('quick-reports-settings-button').style.backgroundColor = "inherit";

	}

	else if ( this.id == 'my-team-folders-cancel-settings-button' ) {
		//handle this case
	}
}

function handleOptionClick() {
	document.getElementById('quick-reports-iframe').setAttribute('src', this.value);
	document.getElementById('external-website-frame-button').setAttribute('href', this.value);
	document.getElementById('quick-reports-settings').style.display = "none";
	document.getElementById('quick-reports-settings-button').style.backgroundColor = "inherit";

}