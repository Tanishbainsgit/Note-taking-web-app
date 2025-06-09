const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// POST: Create new note (handles userId, tags, archived)
router.post('/', async (req, res, next) => {
  try {
    const { userId, title, content, tags, archived } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({ message: 'userId, title and content are required' });
    }

    const newNote = new Note({
      userId,
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

// GET: Retrieve all notes
router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// GET: Retrieve a note by ID
router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// PUT: Update a note
router.put('/:id', async (req, res, next) => {
  try {
    const { title, content, tags, archived } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, archived, updatedDate: new Date() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
});

// DELETE: Delete a note
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET: Search notes by title (Search Feature for indexing & optimization)
router.get('/search/title', async (req, res, next) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Title parameter is required for search' });
    }

    const notes = await Note.find({
      title: new RegExp(title, 'i')  // Case-insensitive search
    });

    res.json(notes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
