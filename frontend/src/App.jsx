
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, FileText, Trash2, Pencil, X, Menu,
  LayoutGrid, List, SlidersHorizontal, Clock3,
  CheckCircle2, MoreHorizontal, StickyNote, Sparkles,
  AlertCircle, RefreshCw, ArrowUpDown
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/notes";

const colors = ["yellow", "purple", "blue", "green", "pink"];

function formatDate(date) {
  if (!date) return "Just now";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(0);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Unable to load notes");
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : data.notes || []);
    } catch {
      notify("Could not connect to the server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialNotes = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Unable to load notes");
        const data = await response.json();
        if (active) setNotes(Array.isArray(data) ? data : data.notes || []);
      } catch {
        if (active) notify("Could not connect to the server.", "error");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitialNotes();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const initialUpdate = setTimeout(() => setNow(Date.now()), 0);
    const interval = setInterval(() => setNow(Date.now()), 60_000);

    return () => {
      clearTimeout(initialUpdate);
      clearInterval(interval);
    };
  }, []);

  const openCreate = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setModal(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setModal(true);
  };

  const saveNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      notify("Please enter both title and content.", "error");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingNote);
      const url = isEditing
        ? `${API_URL}/${editingNote._id}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      await fetchNotes();
      setModal(false);
      setTitle("");
      setContent("");
      setEditingNote(null);
      notify(isEditing ? "Note updated successfully" : "Note created successfully");
    } catch {
      notify("Unable to save note. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setNotes((previous) => previous.filter((note) => note._id !== id));
      notify("Note deleted successfully");
    } catch {
      notify("Unable to delete note.", "error");
    }
  };

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (note) =>
          note.title?.toLowerCase().includes(query) ||
          note.content?.toLowerCase().includes(query)
      );
    }

    if (filter === "recent") {
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      result = result.filter(
        (note) => new Date(note.updatedAt || note.createdAt).getTime() >= weekAgo
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [notes, search, filter, sort, now]);

  const recentCount = notes.filter((note) => {
    const date = new Date(note.updatedAt || note.createdAt).getTime();
    return date >= now - 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><StickyNote size={23} /></div>
          <span>NoteSpace<span className="brand-dot">.</span></span>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <button className="nav-item active" onClick={() => {
          setFilter("all");
          setSidebarOpen(false);
        }}>
          <FileText size={19} />
          <span>All Notes</span>
          <span className="nav-count">{notes.length}</span>
        </button>

        <button className={`nav-item ${filter === "recent" ? "active" : ""}`}
          onClick={() => {
            setFilter("recent");
            setSidebarOpen(false);
          }}>
          <Clock3 size={19} />
          <span>Recently Updated</span>
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-promo">
            <div className="promo-icon"><Sparkles size={20} /></div>
            <h4>Your ideas matter.</h4>
            <p>Keep your thoughts organized and turn ideas into action.</p>
            <button onClick={openCreate}>Create a note <Plus size={15} /></button>
          </div>
          <div className="profile-row">
            <div className="avatar">N</div>
            <div>
              <strong>My Workspace</strong>
              <span>Personal space</span>
            </div>
            <MoreHorizontal size={20} />
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>All Notes</strong>
          </div>
          <div className="workspace-status">
            <span className="status-dot" /> Your workspace
          </div>
        </header>

        <div className="content-area">
          <section className="welcome-section">
            <div>
              <div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL WORKSPACE</div>
              <h1>Your thoughts,<br className="mobile-break" /> organized<span>.</span></h1>
              <p>A calm space to capture ideas, plan your work, and stay focused.</p>
            </div>
            <button className="primary-button" onClick={openCreate}>
              <Plus size={19} /> Create Note
            </button>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-purple"><FileText size={21} /></div>
              <div>
                <span>Total Notes</span>
                <h2>{notes.length}</h2>
                <small>All your saved thoughts</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-green"><CheckCircle2 size={21} /></div>
              <div>
                <span>Recently Updated</span>
                <h2>{recentCount}</h2>
                <small>Updated in the last 7 days</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-orange"><Clock3 size={21} /></div>
              <div>
                <span>Latest Activity</span>
                <h2 className="stat-date">
                  {notes.length
                    ? formatDate(
                        [...notes].sort(
                          (a, b) =>
                            new Date(b.updatedAt || b.createdAt) -
                            new Date(a.updatedAt || a.createdAt)
                        )[0].updatedAt ||
                          [...notes].sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )[0].createdAt
                      )
                    : "No activity"}
                </h2>
                <small>Your latest note update</small>
              </div>
            </div>
          </section>

          <section className="notes-section">
            <div className="section-heading">
              <div>
                <h2>Your Notes</h2>
                <p>Everything you want to remember, in one place.</p>
              </div>
              <span className="notes-total">{filteredNotes.length} notes</span>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={19} />
                <input
                  type="text"
                  placeholder="Search by title or content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")}><X size={16} /></button>
                )}
              </div>

              <div className="toolbar-actions">
                <div className="select-wrap">
                  <SlidersHorizontal size={16} />
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All notes</option>
                    <option value="recent">Recently updated</option>
                  </select>
                </div>
                <div className="select-wrap sort-select">
                  <ArrowUpDown size={16} />
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
                <div className="view-toggle">
                  <button className={view === "grid" ? "selected" : ""}
                    onClick={() => setView("grid")} title="Grid view">
                    <LayoutGrid size={17} />
                  </button>
                  <button className={view === "list" ? "selected" : ""}
                    onClick={() => setView("list")} title="List view">
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <RefreshCw className="spin" size={25} />
                <p>Loading your notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><StickyNote size={32} /></div>
                <h3>{search ? "No matching notes" : "Your space is waiting"}</h3>
                <p>{search
                  ? "Try another search term."
                  : "Start capturing your thoughts. Your first note is just a click away."}</p>
                {!search && <button className="primary-button" onClick={openCreate}>
                  <Plus size={18} /> Create your first note
                </button>}
              </div>
            ) : (
              <div className={`notes-grid ${view === "list" ? "list-view" : ""}`}>
                {filteredNotes.map((note, index) => (
                  <article className={`note-card note-${colors[index % colors.length]}`}
                    key={note._id}>
                    <div className="note-card-top">
                      <span className="note-date">{formatDate(note.updatedAt || note.createdAt)}</span>
                      <div className="note-actions">
                        <button title="Edit note" onClick={() => openEdit(note)}>
                          <Pencil size={16} />
                        </button>
                        <button title="Delete note" onClick={() => deleteNote(note._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3>{note.title}</h3>
                    <p className="note-preview">{note.content}</p>
                    <div className="note-card-footer">
                      <span><span className="note-indicator" /> NOTE</span>
                      <button onClick={() => openEdit(note)}>Open note <span>↗</span></button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="app-footer">
            <span>© 2026 NoteSpace</span>
            <span>Made for your thoughts <span className="footer-heart">♥</span></span>
          </footer>
        </div>
      </main>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setModal(false);
        }}>
          <form className="note-modal" onSubmit={saveNote}>
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">{editingNote ? "EDIT NOTE" : "NEW NOTE"}</span>
                <h2>{editingNote ? "Update your note" : "Create a note"}</h2>
                <p>Capture that thought before it slips away.</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setModal(false)}>
                <X size={20} />
              </button>
            </div>

            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="modal-input"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              autoFocus
            />

            <label htmlFor="note-content">Your thoughts</label>
            <textarea
              id="note-content"
              className="modal-textarea"
              placeholder="Start writing here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
            />

            <div className="modal-footer">
              <span>{content.length} characters</span>
              <div>
                <button type="button" className="secondary-button"
                  onClick={() => setModal(false)}>Cancel</button>
                <button className="primary-button" disabled={saving}>
                  {saving ? "Saving..." : <><CheckCircle2 size={17} /> {editingNote ? "Save Changes" : "Create Note"}</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : ""}`}>
          {toast.type === "error"
            ? <AlertCircle size={19} />
            : <CheckCircle2 size={19} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
