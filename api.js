//build api string based on the currently logged in user
function get_api_basestring() {
    var username = get_username();
    var base = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+username;
    return base;
}

//build api string based on the currently logged in user
function purchases_get_all_string() {
    var base = get_api_basestring();
    base = base + "&action=" + "purchases_get_all";
    return base;
}

//build api string based on the currently logged in user
function iou_get_all_string() {
	var base = get_api_basestring();
	base= base + "&action=iou_get_all";
	return base;
}