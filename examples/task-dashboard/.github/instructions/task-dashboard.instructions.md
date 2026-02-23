---
applyTo: "examples/task-dashboard/**"
---

# Task Dashboard Project

This project uses markdown files to store tasks and notes, and a simple Node.js script to generate an HTML dashboard.

## Key files

- `tasks.md` — the source of truth for all tasks. Uses `- [ ]` and `- [x]` checkbox syntax.
- `notes/` — folder of markdown files that become pages in the notepad view.
- `generate-dashboard.js` — reads the markdown files and outputs `_site/dashboard.html` and `_site/notepad.html`.
- `.vscode/tasks.json` — VS Code task definitions for starting and building the dashboard.

## Conventions

- Tasks use sections: `## In Progress`, `## Up Next`, `## Done`
- Tags are written as `#tagname` inline on a task line
- Due dates are written as `(due: YYYY-MM-DD)` inline on a task line
- Notes are any `.md` file in the `notes/` folder
- The generated HTML goes in the `_site/` folder and should not be edited by hand

## Running the dashboard

- The primary way to use this is `node generate-dashboard.js --serve` (or the "Start Dashboard" VS Code task). This starts a local HTTP server on port 4242 and watches for file changes.
- After starting the server, both the task dashboard and notepad should be opened in VS Code's Simple Browser:
  - `http://localhost:4242/dashboard.html`
  - `http://localhost:4242/notepad.html`
- When the user saves changes to `tasks.md` or any file in `notes/`, the script automatically regenerates the HTML and the pages auto-refresh in Simple Browser — no manual reload needed.
- For a one-time build without a server, use `node generate-dashboard.js` (or the "Generate Dashboard (once)" VS Code task).
