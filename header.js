//This functions triggers on each page load
//It handles the language selection and logout options by attaching these options to the #header div 
$( document ).ready(function() {
    var username = get_username();
    var logout = "";

    //No logout on first page
    if (username) {
        logout = '<input id="buttontext" type="button" data-text="logout" value="logout" onClick="logout()">';
    };


    $( "#header" ).append(
            '<center>'+logout+
            '<input id="buttontext" type="button" value="Svenska" onClick="changeLanguageSv()">'+
            '<input id="buttontext" type="button" value="English" onClick="changeLanguageEn()">'+
            '</center>'
        );
});

