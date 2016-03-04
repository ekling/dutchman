
//Walk through the DOM, look for elements with 
//data-text attribute and change their HTML according
//to the set language
$( document ).ready(function() {
    lang = get_language();
	$.getJSON("language_strings.json", function( json ) {
		langdict = json[lang];
		
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
		//Todo: handle this default case nicer?
		return "en";
	}
}