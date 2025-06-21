const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware'); //  Import the auth middleware

//  POST: Create new note
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, content, tags, archived } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newNote = new Note({
      userId: req.user.userId, //  Use the userId from JWT token
      title,
      content,
      tags: tags || [],
      archived: archived || false
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
});

//  GET: Retrieve all notes for current user
router.get('/', auth, async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }); //  Only user-specific notes
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

//  GET: Retrieve a note by ID (ensure it belongs to user)
router.get('/:id', auth, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.userId }); //  Restrict access
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

//  PUT: Update a note
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { title, content, tags, archived } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, //  Ensure note belongs to user
      { title, content, tags, archived, updatedDate: new Date() },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: 'Note not found or unauthorized' });
    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
});

// DELETE: Delete a note
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // User scope
    if (!deletedNote) return res.status(404).json({ message: 'Note not found or unauthorized' });

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
});

//  GET: Search notes by title for current user
router.get('/search/title', auth, async (req, res, next) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: 'Title parameter is required for search' });

    const notes = await Note.find({
      userId: req.user.userId, // Restrict search to current user's notes
      title: new RegExp(title, 'i')
    });

    res.json(notes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
