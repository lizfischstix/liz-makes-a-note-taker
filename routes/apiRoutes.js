const router = require('express').Router();
//POST notes

//helper to gen unique note ID
const uuid = require('../helper/uuid');

//helper to read / write to JSON file
const { readFromFile, readAndAppend } = require('../helper/fsUtils')

//localhost/api/notes
router.get('/notes', (req, res) => {

   //Need to read the db.json file and return all saved notes 
   console.info(`${req.method} input recieved for new notes`);

   readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//localhost/api/notes
router.post('/notes', (req, res) => {
console.log(req.body);
   //Need to read the db.json file and return all saved notes 
   console.info(`${req.method} input recieved for new notes`);
   const { title, text } = req.body
   if (title && text) {
      const newNote = {
         title,
         text,
         id: uuid(),
      }
      readAndAppend(newNote, './db/db.json');
   }
   res.json('working')
});

//need  post route that recieves new notes and saves 

module.exports = router;