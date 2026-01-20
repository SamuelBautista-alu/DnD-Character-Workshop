import { create } from "zustand";
import axios from "axios";

export interface Note {
  id?: number;
  userId?: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

type NoteStore = {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;

  fetchNotes: (token: string) => Promise<void>;
  fetchNote: (id: number, token: string) => Promise<void>;
  createNote: (data: Note, token: string) => Promise<Note>;
  updateNote: (id: number, data: Partial<Note>, token: string) => Promise<void>;
  deleteNote: (id: number, token: string) => Promise<void>;
  setCurrentNote: (note: Note | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
};

const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,

  fetchNotes: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ notes: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNote: async (id: number, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/notes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ currentNote: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (data: Note, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/notes`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newNote = response.data;
      set((state) => ({ notes: [newNote, ...state.notes] }));
      return newNote;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (id: number, data: Partial<Note>, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/notes/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedNote = response.data;
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? updatedNote : note)),
        currentNote:
          state.currentNote?.id === id ? updatedNote : state.currentNote,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (id: number, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`http://localhost:3000/api/v1/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        currentNote: state.currentNote?.id === id ? null : state.currentNote,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentNote: (note: Note | null) => set({ currentNote: note }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useNoteStore;
