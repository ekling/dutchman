function set_user(username, userlevel) {
    localStorage.user = username;
    localStorage.userlevel = userlevel;
    //Maybe set first and last name here if needed
}

function get_username() {
    return localStorage.user;
}

function get_userlevel() {
    return localStorage.userlevel;
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("userlevel");
}