//where route handlers go
//import Express to server file
const express = require('express');


//invoke express
const app = express();
app.use(express.json());
	//tells the server that all req's coming in are formatted in JSON
app.use(express.static('public'));
	//if someone goes to the homepage, serve up the public directory
	//public/index.html -- can get rid of normal app.get

app.locals.pets = [
	{id: 1, name: 'Marcus Aurelius', type: 'parakeet'},
	{id: 2, name: 'Craisins', type: 'cat'},
	{id: 3, name: 'Lazarus', type: 'dog'},
	{id: 4, name: 'Otto', type: 'dog'}
];

//similar to React's state

//to help server be ready to listen... 
// (1) set up a port for server to run on
// (2) tell the server to listen to req's

app.set('port', process.env.PORT || 3001);
//SETTER
//sets it up to run on localhost:30001

// app.get('/', (request, response) => {
// 	response.send('Welcome to the Pet-API');
// 		//the response obj. sent back
// })
//takes in 2 arguments, the req & the response

app.get('/api/v1/pets', (request, response) => {
	response.status(200).json(app.locals.pets);
})

app.get('/api/v1/pets/:type', (request, response) => {
	const givenType = request.params.type;
	const foundType = app.locals.pets.filter(pet => pet.type === givenType);

	if (!foundType.length) response.sendStatus(404);

	response.status(200).json(foundType);
})

app.get('/api/v1/pets/:id', (request, response) => {
	console.log(request.params) //request.params gives an object

	const petID = parseInt(request.params.id);
	const foundPet = app.locals.pets.find(pet => pet.id === petID);

	if (!foundPet) {
		response.sendStatus(404);
				//sendStatus is a method -- we set up for error handling
				//response.status(404).send(`Sorry no pet was found with the id of ${petID}`);
				//to send a more explicit msg
	}

	response.status(200).json(foundPet); //returns that var
})

app.post('/api/v1/pets', (request, response) => {
	const id = Date.now();
	const { name, type } = request.body;
		//destructuring from the request body
		//client will send {name: '', type: ''}

	for (let requiredParameter of ['name', 'type']) {
		if (!request.body[requiredParameter]) {
			return response.status(422).send({
				error: `Expected format: {name: <string>, type: <string>}. Missing a required parameter of ${requiredParameter}!`
			})
		}
	}

	app.locals.pets.push({ id, name, type }); //push new pet into our data

	response.status(201).json({id, name, type});
})

app.post('/api/v1/pets/:id', (request, response) => {
	const { name } = request.body;
	const petID = parseInt(request.params.id);
	const foundPet = app.locals.pets.find(pet => pet.id === petID);

	foundPet.name = name;

	response.status(205).json(foundPet);
})

app.listen(app.get('port'), () => {
	console.log(`Pet-API is now listening on port ${app.get('port')}!`)
	//will console log into the terminal
})
//GETTER