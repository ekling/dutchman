function clicked() {

	var user = document.getElementById('username');
	var pass = document.getElementById('password');

	var coradmin = ['ervtod', 'hirchr', 'jorass', 'saskru', 'svetor'];
	var coruser = ['aamsta', 'anddar', 'ankov', 'aqulyn', 'aubbla', 'benfau',
	 'bratam', 'ceznew', 'dansch', 'didwat', 'domolh', 'edraug', 'einyam', 
	 'elepic', 'eulcou', 'eusgor', 'felbar', 'felfra', 'fercrn', 'giamik', 
	 'gollan', 'hyrlap', 'jacabb', 'janhei', 'jeaats', 'jershi', 'jovsit', 
	 'karbly', 'katfab', 'kaywan', 'kenolg', 'krysan', 'larsch', 'lasnic', 
	 'liatra', 'livzha', 'maihon', 'marpug', 'marsti', 'molbab', 'muhtof', 
	 'nikpro', 'olislu', 'olubra', 'oludra', 'orapan', 'pauaaf', 'pomgra', 
	 'prabar', 'rewes', 'schjou', 'shapet', 'sivan', 'steber', 'sulpen', 
	 'sulstr', 'symzim', 'teojen', 'tohei', 'valpag', 'yevowe', 'zulgor']
	
	if(pass.value == user.value){

		if(coradmin.indexOf(user.value) != -1){

			//window.alert("You are logged in as admin " + user.value);
			set_user(user.value, "admin");
			window.location.href = "admin.html";


		} else if(coruser.indexOf(user.value) != -1) {
			//window.alert("You are logged in as user " + user.value)
			set_user(user.value, "user");
			window.location.href = "user.html";

		} else {
			window.alert("Incorrect username or password!");
		}
	} else {
		window.alert("Incorrect username or password!");
	}
}

function guest() {
	set_user("guest", "guest");
	location.replace("beerList.html")
}