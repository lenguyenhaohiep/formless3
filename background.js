try{
    chrome.runtime.onMessage.addListener(
    	function(request, sender, sendResponse) {
    		localStorage.data = request.data;
    		localStorage.job = request.job;
    });
} catch (err){
}