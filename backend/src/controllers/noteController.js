import Joi from "joi";
import Note from "../models/Note.js";

const noteSchema = Joi.object({
  title: Joi.string().max(255).default("Untitled Note"),
  content: Joi.string().allow(null, "").default(""),
});

export async function listNotes(req, res, next) {
  try {
    const userId = req.userId;
    const notes = await Note.findAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
}

export async function getNoteById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const note = await Note.findOne({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
}

export async function createNote(req, res, next) {
  try {
    const { error, value } = noteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    const note = await Note.create({
      userId,
      title: value.title,
      content: value.content,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const { error, value } = noteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const note = await Note.findOne({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await note.update({
      title: value.title !== undefined ? value.title : note.title,
      content: value.content !== undefined ? value.content : note.content,
    });

    res.json(note);
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const note = await Note.findOne({
      where: { id, userId },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await note.destroy();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
}
