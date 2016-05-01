
//Walk through the DOM, look for elements with
//data-text attribute and change their HTML according
//to the set language
function translate() {
	lang = get_language();
	$.getJSON("https://raw.githubusercontent.com/ekling/dutchman/master/language_strings.json", function( json ) {
		langdict = json[lang];
    lang == "en" ? $('#cartUndo').css('margin-top', '37px') : $('#cartUndo').css('margin-top', '2px');
    lang == "en" ? sessionStorage.lang = "en" : sessionStorage.lang = "sv";

		$('*').each(function() {
		    	if ($(this).attr('data-text')) {

		    		text = $(this).attr('data-text')
		    		translated_text = langdict[text];

		    		if ($(this).attr("value")) {
		    			//Case for buttons etc, where the translated
		    			//text resides inside the value attribute
		    			$(this).val(translated_text);
		    		} else {
		    			$(this).text(translated_text);
		    		}

		    	}
		    })
	 });
}

//Trigger the translate function on load
$( document ).ready(function() {
    translate();
});

//Set language and update DOM
function changeLanguageEn() {
	set_language("en");
	translate();
}

//Set language and update DOM
function changeLanguageSv() {
	set_language("sv")
	translate();
}

//Store language as a HTML5 localstorage variable
function set_language(language) {
	localStorage.language = language;
}

//Get the currently used language
function get_language() {
	if (localStorage.language)
	{
		return localStorage.language;
	}
	else
	{
		return "en";
	}
}
