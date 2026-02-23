/**
 * generate-dashboard.js
 * 
 * Reads your tasks.md and notes/ folder, then builds a local HTML dashboard
 * you can view right inside VS Code using Simple Browser.
 * 
 * No frameworks, no build tools, no dependencies — just Node.js 
 * (which comes with VS Code's terminal).
 * 
 * USAGE:
 *   node generate-dashboard.js            — generate once and exit
 *   node generate-dashboard.js --serve    — start a local server, watch for
 *                                           changes, and auto-refresh the
 *                                           dashboard in Simple Browser
 * 
 * HOW IT WORKS:
 * 1. Reads tasks.md and parses each checkbox line into a task object
 * 2. Reads every .md file in the notes/ folder
 * 3. Converts the markdown into simple HTML
 * 4. Writes two files: dashboard.html (tasks) and notepad.html (notes)
 * 5. You open either file in VS Code's Simple Browser to see your dashboard
 * 
 * In --serve mode it also:
 * 6. Starts a tiny HTTP server on port 4242 so Simple Browser can load the pages
 * 7. Watches tasks.md and notes/ for changes and regenerates automatically
 * 8. Injects a small auto-refresh snippet into the HTML so the browser reloads
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

/* ------------------------------------------------------------------ */
/*  Mode: "serve" (watch + local server) or "build" (one-shot)         */
/* ------------------------------------------------------------------ */
const SERVE_MODE = process.argv.includes("--serve");
const PORT = 4242;

/* ------------------------------------------------------------------ */
/*  Paths — everything is relative to this script's folder             */
/* ------------------------------------------------------------------ */
const ROOT = __dirname;
const TASKS_FILE = path.join(ROOT, "tasks.md");
const NOTES_DIR = path.join(ROOT, "notes");
const OUT_DIR = path.join(ROOT, "_site");

/* ------------------------------------------------------------------ */
/*  Tiny Markdown-to-HTML helper (covers the basics, no library needed)*/
/* ------------------------------------------------------------------ */
function markdownToHtml(md) {
  let html = md
    // Headings (must come before bold so ### line isn't partially bolded)
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Links — only allow http/https URLs (no javascript: or data: URIs)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Horizontal rules
    .replace(/^---$/gm, "<hr>")
    // Line breaks — blank line becomes paragraph break
    .replace(/\n\n/g, "</p><p>")
    // Simple unordered list items (not checkboxes — those are handled separately)
    .replace(/^- (?!\[[ x]\])/gm, "• ");

  return "<p>" + html + "</p>";
}

/* ------------------------------------------------------------------ */
/*  Parse tasks.md into structured data                                */
/* ------------------------------------------------------------------ */
function parseTasks(filePath) {
  if (!fs.existsSync(filePath)) {
    return { inProgress: [], upNext: [], done: [] };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const tasks = { inProgress: [], upNext: [], done: [] };
  let currentSection = "inProgress";

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect section headings
    if (/^##\s+in\s*progress/i.test(trimmed)) {
      currentSection = "inProgress";
      continue;
    }
    if (/^##\s+up\s*next/i.test(trimmed)) {
      currentSection = "upNext";
      continue;
    }
    if (/^##\s+done/i.test(trimmed)) {
      currentSection = "done";
      continue;
    }

    // Parse checkbox lines: - [ ] or - [x]
    const checkboxMatch = trimmed.match(/^- \[([ x])\]\s+(.+)$/);
    if (checkboxMatch) {
      const completed = checkboxMatch[1] === "x";
      let text = checkboxMatch[2];

      // Extract tags like #design, #research
      const tags = [];
      text = text.replace(/#(\w+)/g, (_, tag) => {
        tags.push(tag);
        return "";
      });

      // Extract due date like (due: 2026-03-01)
      let dueDate = null;
      text = text.replace(/\(due:\s*([^)]+)\)/g, (_, date) => {
        dueDate = date.trim();
        return "";
      });

      tasks[currentSection].push({
        text: text.trim(),
        completed,
        tags,
        dueDate,
      });
    }
  }

  return tasks;
}

/* ------------------------------------------------------------------ */
/*  Auto-refresh snippet (injected into HTML only in --serve mode)     */
/*  Polls a tiny /version endpoint on the local server. When the       */
/*  version number changes (= files were regenerated), the page        */
/*  reloads itself. Simple and dependency-free.                        */
/* ------------------------------------------------------------------ */
let buildVersion = 0; // incremented on every regeneration

const AUTO_REFRESH_SCRIPT = `
<script>
(function() {
  var currentVersion = null;
  setInterval(function() {
    fetch('/version').then(function(r) { return r.text(); }).then(function(v) {
      if (currentVersion === null) { currentVersion = v; return; }
      if (v !== currentVersion) { location.reload(); }
    }).catch(function() {});
  }, 1500);
})();
</script>`;

/* ------------------------------------------------------------------ */
/*  Read all notes from the notes/ folder                              */
/* ------------------------------------------------------------------ */
function readNotes(notesDir) {
  if (!fs.existsSync(notesDir)) return [];

  const files = fs.readdirSync(notesDir).filter((f) => f.endsWith(".md"));
  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(notesDir, filename), "utf-8");
    // Use the first heading as the title, or fall back to filename
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace(".md", "");
    return { filename, title, html: markdownToHtml(raw) };
  });
}

/* ------------------------------------------------------------------ */
/*  Shared CSS — clean, modern, design-friendly                        */
/* ------------------------------------------------------------------ */
const SHARED_CSS = `
  :root {
    /* Easy to customize — change these to match your style */
    --color-bg: #0f0f0f;
    --color-surface: #1a1a1a;
    --color-surface-hover: #222222;
    --color-border: #2a2a2a;
    --color-text: #e5e5e5;
    --color-text-muted: #888888;
    --color-accent: #6c63ff;
    --color-accent-light: #8b83ff;
    --color-success: #4ade80;
    --color-warning: #fbbf24;
    --color-tag-bg: #2a2a3e;
    --color-tag-text: #a5a0ff;
    --font-sans: "Inter", "SF Pro Display", -apple-system, system-ui, sans-serif;
    --font-mono: "SF Mono", "Fira Code", "Cascadia Code", monospace;
    --radius: 12px;
    --radius-sm: 8px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font-sans);
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
    padding: 2rem;
    max-width: 960px;
    margin: 0 auto;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  h2 {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 2rem 0 0.75rem;
  }

  .subtitle {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  .nav-link {
    display: inline-block;
    margin-top: 0.5rem;
    color: var(--color-accent-light);
    text-decoration: none;
    font-size: 0.9rem;
  }
  .nav-link:hover { text-decoration: underline; }

  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    margin-bottom: 0.5rem;
    transition: background 0.15s ease;
  }
  .card:hover { background: var(--color-surface-hover); }

  .task-text { font-size: 0.95rem; }
  .task-text.completed {
    text-decoration: line-through;
    color: var(--color-text-muted);
  }

  .tag {
    display: inline-block;
    background: var(--color-tag-bg);
    color: var(--color-tag-text);
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    margin-left: 0.5rem;
    font-weight: 500;
  }

  .due-date {
    font-size: 0.8rem;
    color: var(--color-warning);
    margin-left: 0.75rem;
  }

  .stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .stat-card {
    flex: 1;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1.25rem;
    text-align: center;
  }
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }
  .stat-label {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  .note-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  .note-card h1, .note-card h2, .note-card h3 {
    text-transform: none;
    letter-spacing: normal;
    color: var(--color-text);
  }
  .note-card h1 { font-size: 1.35rem; margin-bottom: 1rem; }
  .note-card h2 { font-size: 1.1rem; margin: 1.25rem 0 0.5rem; }
  .note-card h3 { font-size: 0.95rem; margin: 1rem 0 0.5rem; }
  .note-card p { margin-bottom: 0.5rem; font-size: 0.95rem; }
  .note-card code {
    background: var(--color-tag-bg);
    color: var(--color-tag-text);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }
  .note-card a {
    color: var(--color-accent-light);
    text-decoration: none;
  }
  .note-card a:hover { text-decoration: underline; }
  .note-card hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 1rem 0;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .checkbox {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid var(--color-border);
    border-radius: 4px;
    margin-right: 0.75rem;
    vertical-align: middle;
    position: relative;
    flex-shrink: 0;
  }
  .checkbox.checked {
    background: var(--color-success);
    border-color: var(--color-success);
  }
  .checkbox.checked::after {
    content: "✓";
    position: absolute;
    top: -2px;
    left: 2px;
    font-size: 13px;
    color: var(--color-bg);
    font-weight: 700;
  }

  .task-row {
    display: flex;
    align-items: center;
  }

  .footer {
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
  }
`;

/* ------------------------------------------------------------------ */
/*  Generate dashboard.html (task view)                                */
/* ------------------------------------------------------------------ */
function generateDashboard(tasks) {
  const totalTasks =
    tasks.inProgress.length + tasks.upNext.length + tasks.done.length;
  const completedCount = tasks.done.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Helper to render a single task card
  const renderTask = (task) => {
    // Escape HTML entities in text to prevent cross-site scripting
    const escapedText = task.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const tagsHtml = task.tags
      .map((t) => {
        const escapedTag = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<span class="tag">#${escapedTag}</span>`;
      })
      .join("");

    const dueDateHtml = task.dueDate
      ? `<span class="due-date">📅 ${task.dueDate.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`
      : "";

    const checkClass = task.completed ? "checked" : "";
    const textClass = task.completed ? "completed" : "";

    return `
      <div class="card">
        <div class="task-row">
          <span class="checkbox ${checkClass}"></span>
          <span class="task-text ${textClass}">${escapedText}</span>
          ${tagsHtml}
          ${dueDateHtml}
        </div>
      </div>`;
  };

  const renderSection = (title, taskList) => {
    if (taskList.length === 0) return "";
    return `<h2>${title}</h2>\n${taskList.map(renderTask).join("\n")}`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Dashboard</title>
  <style>${SHARED_CSS}</style>
</head>
<body>
  <h1>📋 Task Dashboard</h1>
  <p class="subtitle">Your tasks from <code>tasks.md</code> — ${SERVE_MODE ? "saves auto-refresh this page" : "edit that file and re-run to update"}.</p>
  <a class="nav-link" href="notepad.html">📝 Open Notepad →</a>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-number">${totalTasks}</div>
      <div class="stat-label">Total Tasks</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" style="color: var(--color-accent)">${tasks.inProgress.length}</div>
      <div class="stat-label">In Progress</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" style="color: var(--color-success)">${completedCount}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" style="color: var(--color-warning)">${progressPercent}%</div>
      <div class="stat-label">Progress</div>
    </div>
  </div>

  ${renderSection("🔨 In Progress", tasks.inProgress)}
  ${renderSection("📌 Up Next", tasks.upNext)}
  ${renderSection("✅ Done", tasks.done)}

  ${totalTasks === 0 ? '<div class="empty-state">No tasks yet. Add some to tasks.md and re-run!</div>' : ""}

  <div class="footer">
    Generated from tasks.md · ${SERVE_MODE ? "Watching for changes — saves auto-refresh" : "Edit your tasks and run <code>node generate-dashboard.js</code> to update"}
  </div>
  ${SERVE_MODE ? AUTO_REFRESH_SCRIPT : ""}
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Generate notepad.html (notes view)                                 */
/* ------------------------------------------------------------------ */
function generateNotepad(notes) {
  const notesHtml =
    notes.length > 0
      ? notes.map((n) => `<div class="note-card">${n.html}</div>`).join("\n")
      : '<div class="empty-state">No notes yet. Add .md files to the notes/ folder and re-run!</div>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notepad</title>
  <style>${SHARED_CSS}</style>
</head>
<body>
  <h1>📝 Notepad</h1>
  <p class="subtitle">Your notes from the <code>notes/</code> folder — ${notes.length} note${notes.length === 1 ? "" : "s"} found. ${SERVE_MODE ? "Saves auto-refresh this page." : ""}</p>
  <a class="nav-link" href="dashboard.html">📋 Open Task Dashboard →</a>

  ${notesHtml}

  <div class="footer">
    Generated from notes/ · ${SERVE_MODE ? "Watching for changes — saves auto-refresh" : "Add or edit .md files and run <code>node generate-dashboard.js</code> to update"}
  </div>
  ${SERVE_MODE ? AUTO_REFRESH_SCRIPT : ""}
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Build — generate the HTML files                                    */
/* ------------------------------------------------------------------ */
function build() {
  console.log("📋 Reading tasks.md...");
  const tasks = parseTasks(TASKS_FILE);
  const totalTasks =
    tasks.inProgress.length + tasks.upNext.length + tasks.done.length;
  console.log(`   Found ${totalTasks} tasks`);

  console.log("📝 Reading notes...");
  const notes = readNotes(NOTES_DIR);
  console.log(`   Found ${notes.length} note(s)`);

  // Create the output folder if it doesn't exist
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Write the dashboard
  const dashboardPath = path.join(OUT_DIR, "dashboard.html");
  fs.writeFileSync(dashboardPath, generateDashboard(tasks), "utf-8");
  console.log(`✅ Dashboard → ${dashboardPath}`);

  // Write the notepad
  const notepadPath = path.join(OUT_DIR, "notepad.html");
  fs.writeFileSync(notepadPath, generateNotepad(notes), "utf-8");
  console.log(`✅ Notepad   → ${notepadPath}`);

  // Bump the version so the auto-refresh snippet knows to reload
  buildVersion++;
}

/* ------------------------------------------------------------------ */
/*  Serve mode — local HTTP server + file watcher                      */
/* ------------------------------------------------------------------ */
function startServer() {
  const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
  };

  const server = http.createServer((req, res) => {
    // Version endpoint for the auto-refresh polling
    if (req.url === "/version") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(String(buildVersion));
      return;
    }

    // Serve static files from _site/
    let urlPath = req.url === "/" ? "/dashboard.html" : req.url;
    // Sanitize: only allow simple filenames, no directory traversal
    const safeName = path.basename(urlPath);
    const filePath = path.join(OUT_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(safeName);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(fs.readFileSync(filePath));
  });

  server.listen(PORT, () => {
    console.log(`\n🌐 Server running at http://localhost:${PORT}`);
    console.log(`   📋 Dashboard → http://localhost:${PORT}/dashboard.html`);
    console.log(`   📝 Notepad   → http://localhost:${PORT}/notepad.html`);
    console.log(`\n👀 Watching for changes... (press Ctrl+C to stop)\n`);
  });
}

function startWatcher() {
  // Small debounce so rapid saves don't trigger multiple rebuilds
  let debounceTimer = null;
  const rebuild = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n🔄 Change detected — rebuilding...`);
      build();
      console.log(`   Done! Browser will refresh automatically.\n`);
    }, 300);
  };

  // Watch tasks.md
  if (fs.existsSync(TASKS_FILE)) {
    fs.watch(TASKS_FILE, rebuild);
  }

  // Watch the notes/ directory
  if (fs.existsSync(NOTES_DIR)) {
    fs.watch(NOTES_DIR, { recursive: true }, rebuild);
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */
function main() {
  build();

  if (SERVE_MODE) {
    startServer();
    startWatcher();
  } else {
    console.log(
      "\n🚀 Done! Run with --serve to start a live-updating local server."
    );
    console.log(
      '   Or open the files manually: Cmd+Shift+P → "Simple Browser: Show"'
    );
  }
}

main();
