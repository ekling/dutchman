function set_user(username, userlevel) {
    localStorage.user = username;
    localStorage.userlevel = userlevel;
    //Maybe set first and last name here if needed
}

function get_username() {
    if (localStorage.user) {
            return localStorage.user;
    }
    else {
        return "";
    }
}

function get_userlevel() {
    return localStorage.userlevel;
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userlevel");
    window.location.href = "homepage.html";
}