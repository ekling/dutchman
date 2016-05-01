//Store a key-value pair with username and its userlevel
function set_user(username, userlevel) {
    localStorage.user = username;
    localStorage.userlevel = userlevel;
    //Maybe set first and last name here if needed
}

//Retreive the username
function get_username() {
    if (localStorage.user) {
            return localStorage.user;
    }
    else {
        return "";
    }
}

//Retreive the userlevel
function get_userlevel() {
    return localStorage.userlevel;
}

//Logout
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userlevel");
    window.location.href = "homepage.html";
}