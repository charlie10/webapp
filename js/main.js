

window.onload = function(){

	var openQuickReports = document.getElementById('open-quick-reports');
	//openQuickReports.style.border = "solid red"


	document.getElementById('quick-reports').onclick = handleQuickReports;
	document.getElementById('my-folders').onclick = handleQuickReports;
	document.getElementById('my-team-folders').onclick = handleQuickReports;
	document.getElementById('public-folders').onclick = handleQuickReports;



	saveQuickReportButton = document.getElementById('save-quick-report-button');
	saveQuickReportButton.onclick = handleSaveURLs;	

}



function processAjaxData(response, urlPath){
     document.getElementById("content").innerHTML = response.html;
     document.title = response.pageTitle;
    // window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
 }


 window.onpopstate = function(){
 	var w = window;
 	var h = w.history;
 	var ps =h.pushState;
 	debugger;
 //	window.history.pushState("", "Title", "/nurl");
 }

 function handleQuickReports() {

 	window.location.hash = ( "/" + this.id );

 }


 function handleSaveURLs() {


 }