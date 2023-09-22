const mongoose = require("mongoose");

const User = require("../models/User");
const Note = require("../models/Note");

// desc get all notes
// route GET /notes
// access private
const getAllNotes = async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length) {
    return res.status(404).json({ message: "Dont have any note" });
  }

  const notesWithUsername = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user);
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUsername);
};

// @desc create new note
// @route POST /notes
// @access private
const createNote = async (req, res) => {
  const { user: userId, title, text } = req.body;

  //   Confirm data
  if (!userId || !title || !text) {
    return res.status(400).json({ message: "All field are required" });
  }

  //   Check for duplicate
  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Title" });
  }

  //Check have user that note will be assigned
  const user = await User.findById(userId).lean().exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `Don't have user with id ${userId} ` });
  }

  const noteObj = { user: userId, title, text };
  console.log(noteObj);

  const result = await Note.create(noteObj);
  console.log("result");

  if (result) {
    res.status(201).json({ message: "Create note successful" });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
};

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const { id, user: userId, title, text, completed } = req.body;

  //   Confirm data
  if (!id || !userId || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All field are required" });
  }

  //   Check have note'
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();
  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  //   Check have user
  const userWillAssign = await User.findById(userId).exec();
  if (!userWillAssign) {
    return res.status(400).json({ message: "User that note assign not found" });
  }

  note.user = userId;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updateNote = await note.save();
  res.json({ message: `${updateNote.title} updated` });
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  //   Check have note
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const result = await Note.deleteOne(note);
  const reply = `Note ${note.title} with ID ${note._id} deleted`;
  res.json(reply);
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
