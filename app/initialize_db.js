var nStore = require('nStore');
var trivia = nStore('data/trivia.db');
/*
trivia.save(
	'id',
	{
		"zone": "a", 
		"category": "a", 
		"dificulty": "a", 
		"question": "a", 
		"wrong1": "a", 
		"wrong2": "a", 
		"wrong3": "a", 
		"correct": "a", 
		}
	);
	
trivia.save(
	'id',
	{
		"zone": "a", 
		"category": "a", 
		"dificulty": "a", 
		"question": "a", 
		"wrong1": "a", 
		"wrong2": "a", 
		"wrong3": "a", 
		"correct": "a", 
		}
	);
	
trivia.save(
	'id',
	{
		"zone": "a", 
		"category": "a", 
		"dificulty": "a", 
		"question": "a", 
		"wrong1": "a", 
		"wrong2": "a", 
		"wrong3": "a", 
		"correct": "a", 
		}
	);
	
trivia.save(
	'id',
	{
		"zone": "a", 
		"category": "a", 
		"dificulty": "a", 
		"question": "a", 
		"wrong1": "a", 
		"wrong2": "a", 
		"wrong3": "a", 
		"correct": "a", 
		}
	);
	
trivia.save(
	'id',
	{
		"zone": "a", 
		"category": "a", 
		"dificulty": "a", 
		"question": "a", 
		"wrong1": "a", 
		"wrong2": "a", 
		"wrong3": "a", 
		"correct": "a", 
		}
	);
	
trivia.save(
	'id',
	{
		"zone": "a", 
		"category": "a", 
		"dificulty": "a", 
		"question": "a", 
		"wrong1": "a", 
		"wrong2": "a", 
		"wrong3": "a", 
		"correct": "a", 
		}
	);
	
trivia.save(
	'id',
	{
		"zone": "a", 
		"category": "a", 
		"dificulty": "a", 
		"question": "a", 
		"wrong1": "a", 
		"wrong2": "a", 
		"wrong3": "a", 
		"correct": "a", 
		}
	);
	*/
trivia.save(
	'test',
	{
		"zone": "General Knowledge", 
		"category": "Literature", 
		"dificulty": 2, 
		"question": "What do the Shakespearean characters Viola and Rosalind have in common?", 
		"wrong1": "Both Are Banished", 
		"wrong2": "Each Has A Twin", 
		"wrong3": 'Both Are From "Twelfth Night"', 
		"correct": "Both Cross-Dress", 
	}, 
	function (err, key) {
		if (err) { throw err; }
	}
);
/*
"457337","Entertainment","Performing Arts",2,"Which London musical features the song ""Tell Me It's Not True""?","Cabaret","Sunset Boulevard","Sister Act","Blood Brothers"
"87953","General Knowledge","Science",3,"What is the Beaufort scale used to measure?","Barometre Readings","Surf","Volcanic Activity","Wind Intensity"
"10525","Entertainment","Music",1,"Who sang ""Do You Really Want to Hurt Me?"" in the 1980's?","Mike Tyson","Sinead O'Connor","Bon Jovi","Boy George"
"330031","Entertainment","Celebrities",1,"What is the name of Angelina Jolie's eldest son?","Suri","Zahara","Coco","Maddox"
"92937","Sports","Soccer",3,"Which Italian soccer player died tragically in an accident in January 2002?","Davide Possanzini","Aimo Diana","Dario Hubner","Vittorio Mero"
"88348","General Knowledge","Food & Beverage",2,"Which country does the chorizo sausage come from?","Italy","Brazil","Mexico","Spain"
"300862","Entertainment","Music",3,"Which Reggae band helped Sean Paul launch his career?","Steel Pulse","UB40","Musical Youth","Third World"
*/
	
trivia.save(
	null,
	{
		"zone": "General Knowledge", 
		"category": "History", 
		"dificulty": 2, 
		"question": "What was the Roman name for London?", 
		"wrong1": "Crete", 
		"wrong2": "Londonitious", 
		"wrong3": "Britannicus", 
		"correct": "Londinium", 
	}, 
	function (err, key) {
		if (err) { throw err; }
	}
);
	
trivia.save(
	null,
	{
		"zone": "General Knowledge", 
		"category": "Art", 
		"dificulty": "2", 
		"question": "Pablo Picasso painted a famous picture depicting which bombed city?", 
		"wrong1": "London", 
		"wrong2": "Brandenburg", 
		"wrong3": "Cartagena", 
		"correct": "Guernica", 
	}, 
	function (err, key) {
		if (err) { throw err; }
	}
);

/*
setTimeout(function () {
trivia.compact();
}, 500);

*/
