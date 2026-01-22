"use client";
import { ProjectNotesProps } from "@/interfaces";

export default function ProjectNotes({
  notes,
  showCreateNote,
  setShowCreateNote,
  noteTitle,
  setNoteTitle,
  noteContent,
  setNoteContent,
  createNote,
  deleteNote,
}: ProjectNotesProps) {
  return (
    <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[700px]">
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-lg font-bold text-white">Project Notes</h2>
          </div>
          <button
            onClick={() => setShowCreateNote(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all text-sm font-medium shadow-lg"
          >
            + New
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {showCreateNote && (
          <div className="bg-slate-700/30 rounded-xl p-4 mb-4 border border-slate-600 shadow-lg">
            <form onSubmit={createNote} className="space-y-3">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Note title..."
                required
                autoFocus
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all"
                placeholder="Note content..."
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateNote(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all text-sm font-medium shadow-lg"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <svg
                className="w-12 h-12 mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">No notes yet</p>
              <p className="text-xs text-gray-600 mt-1">
                Click "+ New" to create one
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-slate-700/30 rounded-xl p-4 border border-slate-600 hover:border-green-500/50 transition-all shadow-md group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold text-base">
                    {note.title}
                  </h4>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-sm transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                {note.content && (
                  <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
