function Session(socket)
{
    this.username = '';
    this.socket = $.client.socket;
}
 
Session.prototype.login = function(y)
{
	console.log('Session login');
	
    username = this.getSession();
    //console.log(session);
    
    if (username === null || username.length === 0) {
		console.log('no username set');
		var login = new Login();
	} else {
		console.log('username set: '+username);
		console.log(username);
		$.client.socket.emit('set nickname', { name: username });
	}
}
 
Session.prototype.getSession = function()
{
	if (typeof(localStorage) == 'undefined' ) {
		this.showUpgradeNotice();
	} else { 
		//var session = {};
		//session.session = localStorage.getItem("session");
		return localStorage.getItem("username");
		
		//return session; //Hello World!
		//localStorage.removeItem("name"); //deletes the matching item from the database
	}
}

Session.prototype.setSession = function(session)
{
	console.log('setSession');
	if (typeof(localStorage) == 'undefined' ) {
		this.showUpgradeNotice();
	} else {
		try {
			var username = session.name;
			if (username !== '') {
				localStorage.setItem("username", username); //saves to the database, "key", "value"
				this.username = username;
			}
			//localStorage.setItem("session", session); //saves to the database, "key", "value"
			
		} catch (e) {
			 if (e == QUOTA_EXCEEDED_ERR) {
				 alert('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
			}
			return false;
		}
		return true;
	}
}

Session.prototype.logout = function()
{
	if (typeof(localStorage) == 'undefined' ) {
		this.showUpgradeNotice();
	} else {
		localStorage.removeItem("username"); //deletes the matching item from the database
	}
}

Session.prototype.checkLogin = function()
{
	console.log('check login');
	if (this.username === '') {
		this.login();
	}
}

Session.prototype.showUpgradeNotice = function()
{
	alert('Your browser does not support HTML5 localStorage.');
}



