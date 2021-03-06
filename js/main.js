
// global arrays wich help the developer(s) prevent badly duplicate code.

var notificationMessage;

/*
* the tabs ids.
*/
var tabsIds 	 = [
						"quick-reports",
						"my-folders",
						"my-team-folders",
						"public-folders"
];

/*
 * quick reports urls' names' ids.  
*/
var urlsNamesIds = [
						"name1",
						"name2",
						"name3"
]

/*
 * my team folders urls' names' ids.  
*/
var urlsNamesIds2 = [
						"name4",
						"name5",
						"name6"
]

/*
 * quick reports urls' ids. 
*/
var urlsIds 	 = [
						"url1",
						"url2",
						"url3"
]

/*
 * my team folders urls' ids. 
*/
var urlsIds2 	 = [
						"url4",
						"url5",
						"url6"
]


window.onload = function(){

	var hashString = window.location.hash;
	if ( ( hashString == undefined ) || ( hashString == '' )  ) {
		window.location.hash = ( "/quick-reports" ); //by default show quick - reports frame
	}

	//restore the last tab
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

	document.getElementById("save-my-team-folders-button").onclick = saveMyTeamFolders;

	document.getElementById('quick-reports-settings-button').onclick = handleSettingClick;
	document.getElementById('quick-reports-cancel-settings-button').onclick = handleCancelSettingClick;

	document.getElementById('my-team-folders-settings-button').onclick = handleSettingClick;
	document.getElementById('my-team-folders-cancel-settings-button').onclick = handleCancelSettingClick;

	document.getElementById('search-form').onsubmit = searchReport;



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
	updateDropDownList2();

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

	// Update My Team Folder data
	var myTeamData = data.myTeamData

	// update the iframe to be the first url
	for ( i = 0; i < myTeamData.length ; ++i ) {

		if( UTILS.notEmpty(myTeamData[i].url) ) {
			document.getElementById('my-team-folders-iframe').setAttribute('src', myTeamData[i].url);
			document.getElementById('my-team-folders-external-website-frame-button').setAttribute('href', myTeamData[i].url);
			break;
		}

	}

	for ( i = 0; i < myTeamData.length; ++i ) {
		
		var currentUrlName 			= document.getElementById( urlsNamesIds2[i] );
		var currentUrl 				= document.getElementById( urlsIds2[i] );

		currentUrlName.value		= myTeamData[i].name;
		currentUrl.value 			= myTeamData[i].url;
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

/*
 * this fucntion saves quick reports reports.
*/
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
 			return ;
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

		}
	}

	document.getElementById('quick-reports-settings').style.display				   = "none";
	document.getElementById('quick-reports-settings-button').style.backgroundColor = "inherit";

	UTILS.storeStorage(newData);

	updateDropDownList();
	updateUserDataOnTheScreen();
	return false;

 }

/*
 * this fucntion saves my team folders reports.
*/
function saveMyTeamFolders() {
	 	//validate the data
 	for ( i = 4; i <= 6; ++i) {

 		if ( validateSettingsInput(i) == false ) {

 			for ( i = i + 1; i <= 6; i++) {
 				var thisName						= document.getElementById( "name" + i );
				var thisUrl				 			= document.getElementById( "url" + i );
				thisUrl.style.border		 		= "transparent";
				thisName.style.border 				= "transparent";

 			}
 			return ;
 		}
 	}

 	var newData = UTILS.loadStorage();
	for ( i = 0; i < urlsNamesIds2.length; ++i) {

		currentUrlName 		= document.getElementById(urlsNamesIds2[i]);
		currentUrl 			= document.getElementById(urlsIds2[i]);

		if ( UTILS.isUrl( currentUrl.value ) || ( ( currentUrlName.value == '' ) && ( currentUrl.value == '' ) )) {
		
			newData.myTeamData[i] = {
				name	: currentUrlName.value,
				url		: currentUrl.value
			}

		}
	}

	document.getElementById('my-team-folders-settings').style.display				   = "none";
	document.getElementById('my-team-folders-settings-button').style.backgroundColor = "inherit";

	UTILS.storeStorage(newData);

	updateDropDownList2();
	updateUserDataOnTheScreen();
	return false;

}

/*
 * update the drop down list in my team folders
*/
function updateDropDownList2() {
	var dropDownList 			= document.getElementById("my-team-folders-drop-down-links");
	dropDownList.innerHTML 		= "";
	dropDownList.onchange 		= handleOptionClick2;
	var urlsCtr 				= 0;
	var externalWebsiteButton 	= document.getElementById('my-team-folders-external-website-frame-button');
	var cancelButton  		  	= document.getElementById('my-team-folders-cancel-settings-button');

	// Update the drop-down list at the quick reports tab
	for ( i = 0; i < urlsNamesIds2.length; ++i) {
		currentUrlName 					= document.getElementById(urlsNamesIds2[i]);
		currentUrl 						= document.getElementById(urlsIds2[i]);
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

		document.getElementById('my-team-folders-iframe').setAttribute('src', '');
		document.getElementById('my-team-folders-external-website-frame-button').setAttribute('href', '');
		document.getElementById('my-team-folders-settings').style.display 			   = "block";
		document.getElementById('my-team-folders-settings-button').style.backgroundColor = "white";

	}
}

/*
 * update the drop down list in quick reports.
*/
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
	notificationMessage = notification;
	notificationElement = document.getElementById('notification-area');

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
	var myFoldersDiv		 = document.getElementById('my-folders-frame');
	var myFoldersframe  	 = document.createElement("IFRAME");
	var externalWebsite 	 = document.getElementById('my-folders-external-website-frame-button');
	externalWebsite.setAttribute('href', tabList[1].options.url);
	myFoldersframe.setAttribute('src',tabList[1].options.url);
	myFoldersDiv.appendChild(myFoldersframe);


	//public folders iframe
	var publicFoldersDiv	 = document.getElementById('public-folders-frame');
	var publicFoldersframe   = document.createElement("IFRAME");
	var externalWebsite 	 = document.getElementById('public-folders-external-website-frame-button');
	externalWebsite.setAttribute('href', tabList[3].options.url);
	publicFoldersframe.setAttribute('src',tabList[3].options.url);
	publicFoldersDiv.appendChild(publicFoldersframe);
}


/*
 * handle open setting in quick reports 
*/

function handleSettingClick() {

	if ( this.id == 'quick-reports-settings-button' ) {

		document.getElementById('quick-reports-settings').style.display = "block";

	}

	else if ( this.id == 'my-team-folders-settings-button' ) {
		document.getElementById('my-team-folders-settings').style.display = "block"
	}
	this.style.backgroundColor = "white";
}


/*
 * handle open setting in my team folders 
*/
function handleCancelSettingClick() {

	if ( this.id == 'quick-reports-cancel-settings-button' ) {

		document.getElementById('quick-reports-settings').style.display 			  	 = "none";
		document.getElementById('quick-reports-settings-button').style.backgroundColor 	 = "inherit";

	}

	else if ( this.id == 'my-team-folders-cancel-settings-button' ) {
		document.getElementById('my-team-folders-settings').style.display 			  	 = "none";
		document.getElementById('my-team-folders-settings-button').style.backgroundColor = "inherit";
	}
	return false;
}

/*
 * handle option click in quick reports 
*/
function handleOptionClick() {
	document.getElementById('quick-reports-iframe').setAttribute('src', this.value);
	document.getElementById('external-website-frame-button').setAttribute('href', this.value);
	document.getElementById('quick-reports-settings').style.display = "none";
	document.getElementById('quick-reports-settings-button').style.backgroundColor = "inherit";

}

/*
 * handle option click in my team folders 
*/
function handleOptionClick2() {
	document.getElementById('my-team-folders-iframe').setAttribute('src', this.value);
	document.getElementById('my-team-folders-external-website-frame-button').setAttribute('href', this.value);
	document.getElementById('my-team-folders-settings').style.display = "none";
	document.getElementById('my-team-folders-settings-button').style.backgroundColor = "inherit";

}

/**
 * function that search a report according to the query, and 
   update the notification area accordingly.
*/

function searchReport() {

	var notificationArea = document.getElementById('notification-area');
	var query = this.q.value;

	if ( ( query == undefined ) || ( query == '' ) ) {
		notificationArea.innerHTML = notificationMessage;
		notificationArea.style.border = "solid red";
		setTimeout( function() {
			notificationArea.style.border = "transparent";
		}, 1000 );
		return false;
	}

	data = UTILS.loadStorage();

	//search in quick reports
	quickReportsData = data.quickReportsData;
	var i;
	var j = 0;
	for ( i = 0; i < quickReportsData.length; ++i ) {
		var currentReport = quickReportsData[i];

		if ( currentReport.name != '') {
			++j;
		}

		if ( currentReport.name.search(query) >= 0 ) {
			
			var dropDownList 	= document.getElementById("quick-reports-drop-down-links");
			var url = currentReport.url;

			handleTabChange(document.getElementById('quick-reports'), 1);
			dropDownList.selectedIndex = ( j - 1 );

			document.getElementById('quick-reports-iframe').setAttribute('src', url);
			document.getElementById('external-website-frame-button').setAttribute('href', url);
			document.getElementById('quick-reports-settings').style.display = "none";
			document.getElementById('quick-reports-settings-button').style.backgroundColor = "inherit";
			notificationArea.innerHTML = notificationMessage;
			return false;
		}

	}

	//search in my team folders
	myTeamData = data.myTeamData;
	var i;
	var j = 0;
	for ( i = 0; i < myTeamData.length; ++i ) {
		var currentReport = myTeamData[i];

		if ( currentReport.name != '') {
			++j;
		}

		if ( currentReport.name.search(query) >= 0 ) {

			var dropDownList 	= document.getElementById("my-team-folders-drop-down-links");
			var url 			= currentReport.url;

			handleTabChange(document.getElementById('my-team-folders'), 1);
			dropDownList.selectedIndex = ( j - 1 );
			document.getElementById('my-team-folders-iframe').setAttribute('src', url);
			document.getElementById('my-team-folders-external-website-frame-button').setAttribute('href', url);
			document.getElementById('my-team-folders-settings').style.display = "none";
			document.getElementById('my-team-folders-settings-button').style.backgroundColor = "inherit";
			notificationArea.innerHTML = notificationMessage;
			return false;
		}

	}

	notificationArea.innerHTML = query + ' NOT found in the current reports';
	notificationArea.style.border = "solid red";
	setTimeout( function() {
		notificationArea.style.border = "transparent";
	}, 1000 );

	return false;
}