
//Walk through the DOM, look for elements with 
//data-text attribute and change their HTML according
//to the set language
$( document ).ready(function() {
    console.log( "ready!" );
    lang = get_language();
    console.log("lang: " + lang);
	$.getJSON("language_strings.json", function( json ) {
		console.log( "loaded JSON!" );
		langdict = json[lang];
		$('*').each(function() {
		    	if ($(this).attr('data-text')) {
		    		text = $(this).attr('data-text')
		    		translated_text = langdict[text];
		    		console.log(translated_text);

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
});

function changeLanguageEn() {
	set_language("en");
	location.reload();
}

function changeLanguageSv() {
	set_language("sv")
	location.reload();
}

function set_language(language) {
	localStorage.language = language;
}

function get_language() {
	if (localStorage.language) 
	{
		return localStorage.language;
	}
	else 
	{
		return "en"
	}
}