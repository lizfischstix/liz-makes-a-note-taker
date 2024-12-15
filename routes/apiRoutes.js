// const router = require('express').Router();

// //helper to gen unique note ID
// const uuid = require('../helper/uuid');

// //helper to read / write to JSON file
// const { readFromFile, readAndAppend, writeToFile } = require('../helper/fsUtils')

// //localhost/api/notes
// router.get('/notes', (req, res) => {

//    //Need to read the db.json file and return all saved notes 
//    console.info(`${req.method} input recieved for new notes`);

//    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
// });

// //localhost/api/notes
// router.post('/notes', (req, res) => {
// console.log(req.body);
//    //Need to read the db.json file and return all saved notes 
//    console.info(`${req.method} input recieved for new notes`);
//    const { title, text 
//    } = req.body
//    if (title && text) {
//       const newNote = {
//          title,
//          text,
//          id: uuid(),
//       }
//       readAndAppend(newNote, './db/db.json');
//    }
//    res.json('working')
// });

// router.delete('/notes/:id', (req, res) => {
//    const { id } = req.params;
//    console.info(`${req.method} request received to delete note with ID: ${id}`);
   
//    if (id) {
//       deleteNote(id, './db/db.json');
//       res.json(`Note with ID: ${id} has been deleted.`);
//    } else {
//       res.status(400).json('Error: No ID provided.');
//    }
// });
// // //DELETE notes by uuid from api/notes
// // router.delete('/notes/:id', (req, res) => {
// //    console.info(req.body);
// //       //Need to read the db.json file, and re-write excluding object with selected uuid 
// //       console.info(`${req.method} note deleted`);
// //       const { title, text } = req.body
// //       if (uuid) {
// //          const deleteNote = {
// //             title,
// //             text,
// //             id: uuid(),
// //          }
// //          readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
// //       }
// //       res.json('working')
// //    });

// module.exports = router;

const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// Helper to generate unique note ID
const uuid = require('../helper/uuid');

// Helper to read/write to JSON file
const { readFromFile, readAndAppend, writeToFile } = require('../helper/fsUtils');

// File path to database JSON
const dbFilePath = path.join(__dirname, '../db/db.json');

// GET all notes
router.get('/notes', (req, res) => {
   console.info(`${req.method} request received for notes`);
   readFromFile(dbFilePath).then((data) => res.json(JSON.parse(data)));
});

// POST a new note
router.post('/notes', (req, res) => {
   console.info(`${req.method} request received to add a note`);
   const { title, text } = req.body;

   if (title && text) {
      const newNote = {
         title,
         text,
         id: uuid(),
      };
      readAndAppend(newNote, dbFilePath);
      res.status(201).json(`Note added successfully`);
   } else {
      res.status(400).json('Error in adding note');
   }
});

// DELETE a note by ID
router.delete('/notes/:id', (req, res) => {
   const { id } = req.params;
   console.info(`${req.method} request received to delete note with ID: ${id}`);

   readFromFile(dbFilePath)
      .then((data) => JSON.parse(data))
      .then((notes) => {
         const updatedNotes = notes.filter((note) => note.id !== id);

         writeToFile(dbFilePath, updatedNotes);
         res.json(`Note with ID: ${id} has been deleted.`);
      })
      .catch((err) => res.status(500).json(`Error: ${err.message}`));
});

module.exports = router;
