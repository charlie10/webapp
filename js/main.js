

window.onload = function(){

	window.location.hash = ( "/quick-reports" ); //by default show quick - reports frame
	handleTabChange(-1, 0);

	document.getElementById('quick-reports').onclick = handleTabClick;
	document.getElementById('my-folders').onclick = handleTabClick;
	document.getElementById('my-team-folders').onclick = handleTabClick;
	document.getElementById('public-folders').onclick = handleTabClick;

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
	}
	else {
		var hashString = window.location.hash;
		if(hashString == '') {
			return ;
		}
		var frameElementPrefix = hashString.substring(2);
	}

	var currentTab = document.getElementById( frameElementPrefix + "-frame" );
	currentTab.style.display = "block";
}


 function handleSaveURLs() {


 }