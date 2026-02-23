# 📋 Task Dashboard & Notepad

A personal productivity setup that turns simple text files into a visual task board and notepad — all inside VS Code.

**No coding required.** You write tasks and notes in plain text, run one command, and get a polished dashboard you can view without leaving VS Code.

![What you'll build: a dark-themed task dashboard showing tasks organized by status, plus a notepad view of your markdown notes](https://img.shields.io/badge/status-example_project-blue)

---

## What's inside

| File / Folder | What it does |
|---|---|
| `tasks.md` | Your to-do list. Each line is a task with a checkbox. |
| `notes/` | A folder of notes. Each `.md` file becomes a page in the notepad. |
| `generate-dashboard.js` | The script that reads your files and builds the dashboard. |
| `_site/` | Where the generated dashboard HTML files go (created automatically). |
| `.vscode/tasks.json` | A shortcut so you can start the dashboard with one click from VS Code. |

---

## Getting started

### Step 1: Get the files onto your computer

There are two ways to get this example — pick whichever feels easier.

#### Option A: Download as a ZIP (simplest)

1. Go to the [vscode-for-designers repository](https://github.com/jo-oikawa/vscode-for-designers) in your web browser
2. Click the green **Code** button
3. Click **Download ZIP**
4. Unzip the file — you'll get a folder called `vscode-for-designers-main`
5. Inside it, find the `examples/task-dashboard` folder — that's the one you need

#### Option B: Clone with VS Code (slightly more setup, but great to learn)

> **What does "clone" mean?** It means making a copy of someone's project from GitHub onto your computer. Think of it like downloading a template.

1. Open VS Code
2. Press `Cmd + Shift + P` (this opens the **Command Palette** — a search bar for VS Code actions)
3. Type `Git: Clone` and select it
4. Paste this URL: `https://github.com/jo-oikawa/vscode-for-designers.git`
5. Choose where to save it on your computer
6. When VS Code asks "Would you like to open the cloned repository?" — click **Open**

---

### Step 2: Open the example folder

1. In VS Code, go to **File → Open Folder**
2. Navigate to the `examples/task-dashboard` folder and open it
3. You should see the file list on the left side:
   - `tasks.md`
   - `notes/` (folder)
   - `generate-dashboard.js`

> **Tip:** If you see the whole `vscode-for-designers` folder, you went one level too high. Navigate deeper into `examples/task-dashboard`.

---

### Step 3: Add your own tasks

1. Click on `tasks.md` in the left sidebar to open it
2. You'll see some sample tasks already there — feel free to change them!
3. The format is simple:

```
## In Progress

- [ ] Design the landing page header
- [ ] Pick a color palette

## Up Next

- [ ] Build the about page

## Done

- [x] Set up VS Code
```

**How it works:**
- `- [ ]` = a task that's not done yet (space between the brackets)
- `- [x]` = a completed task (letter x between the brackets)
- `## In Progress`, `## Up Next`, `## Done` = section headings that organize your tasks
- `#design` = a tag (optional — shows up as a colored label on the dashboard)
- `(due: 2026-03-01)` = a due date (optional — shows up with a 📅 icon)

---

### Step 4: Add your own notes

1. Open the `notes/` folder in the sidebar
2. You'll see two sample notes — click one to see the format
3. To add a new note, right-click the `notes/` folder → **New File**
4. Name it anything ending in `.md` (for example: `meeting-notes.md`)
5. Write whatever you want! Here's a simple starting point:

```markdown
# My Note Title

Some text about the thing I'm working on.

## Ideas

- First idea
- Second idea
- Third idea
```

---

### Step 5: Start the dashboard

This is the fun part — turning your text files into a visual dashboard that updates automatically.

1. Open the **Terminal** in VS Code:
   - Go to **Terminal → New Terminal** in the top menu, or
   - Press `` Ctrl + ` `` (that's the backtick key, usually above Tab)
2. A panel will appear at the bottom of VS Code — this is the terminal
3. Type this command and press **Enter**:

```
node generate-dashboard.js --serve
```

4. You should see output like:

```
📋 Reading tasks.md...
   Found 9 tasks
📝 Reading notes...
   Found 2 note(s)
✅ Dashboard → .../_site/dashboard.html
✅ Notepad   → .../_site/notepad.html

🌐 Server running at http://localhost:4242
   📋 Dashboard → http://localhost:4242/dashboard.html
   📝 Notepad   → http://localhost:4242/notepad.html

👀 Watching for changes... (press Ctrl+C to stop)
```

> **What just happened?** The script read your files and created two HTML pages. It also started a small local server on your computer (nothing goes to the internet — it's completely private). The server watches your files and automatically rebuilds the pages when you save changes.

---

### Step 6: Open the dashboard and notepad in Simple Browser

VS Code has a built-in mini browser called **Simple Browser**. You'll open **two** Simple Browser panels — one for the task dashboard and one for the notepad.

#### Open the Task Dashboard

1. Press `Cmd + Shift + P` to open the **Command Palette**
2. Type `Simple Browser: Show` and select it
3. It will ask for a URL — type:
   ```
   http://localhost:4242/dashboard.html
   ```
4. Press **Enter** — your task dashboard appears in a panel!

#### Open the Notepad

1. Press `Cmd + Shift + P` again
2. Type `Simple Browser: Show` and select it
3. This time enter:
   ```
   http://localhost:4242/notepad.html
   ```
4. Press **Enter** — your notepad appears in a second panel!

> **Tip: Arrange your panels.** You can drag the Simple Browser tabs to sit side-by-side, or next to your editor. A nice setup is: your markdown files on the left, and the dashboard/notepad panels on the right. That way you can see changes as you make them.

#### Alternative: Use the VS Code task runner

Instead of typing the command in the terminal, you can use a shortcut:

1. Press `Cmd + Shift + P`
2. Type `Tasks: Run Task` and select it
3. Choose **Start Dashboard**

This does the same thing as `node generate-dashboard.js --serve`.

---

### Step 7: Edit and watch it refresh

Now for the magic — the dashboard updates automatically when you save your files.

1. Click on `tasks.md` in the sidebar to open it
2. Change a task — for example, mark one as done by changing `- [ ]` to `- [x]`
3. Save the file (`Cmd + S`)
4. Look at the dashboard panel — **it refreshes automatically** within a couple of seconds!
5. Try the same with a note file in `notes/` — edit it, save, and watch the notepad update

> **What's happening behind the scenes?** The server watches your files. When you save a change, it regenerates the HTML pages. A tiny script inside the pages checks for updates every 1.5 seconds and reloads when it detects new content. You never need to manually refresh.

---

## Starting your day

Here's what your morning routine looks like once everything is set up:

1. **Open VS Code** and open the `task-dashboard` folder
2. **Start the server** — open the terminal (`` Ctrl + ` ``) and run:
   ```
   node generate-dashboard.js --serve
   ```
   Or use the task runner: `Cmd + Shift + P` → `Tasks: Run Task` → **Start Dashboard**
3. **Open the dashboard** — `Cmd + Shift + P` → `Simple Browser: Show` → `http://localhost:4242/dashboard.html`
4. **Open the notepad** — `Cmd + Shift + P` → `Simple Browser: Show` → `http://localhost:4242/notepad.html`
5. **Arrange your windows** — drag the panels so the dashboard and notepad are visible alongside your editor
6. **Start working!** — edit `tasks.md` or your notes, save, and watch the views update

> **Stopping the server:** When you're done for the day, click in the terminal and press `Ctrl + C` to stop the server. Next time, just run the command again.

---

## Daily workflow

Once your dashboard and notepad are open, the loop is simple:

1. **Open `tasks.md`** — check off completed tasks, add new ones, move things between sections
2. **Open or create files in `notes/`** — jot down ideas, meeting notes, anything
3. **Save** (`Cmd + S`) — the dashboard and notepad refresh automatically
4. That's it! No need to re-run any commands or manually refresh.

---

## Making it your own

### Change the colors

Open `generate-dashboard.js` and look for the section near the top that says:

```css
:root {
  --color-bg: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-accent: #6c63ff;
  ...
}
```

Change any of these color values to match your preferred palette. For example, to switch the accent color to coral:

```css
--color-accent: #ff6b6b;
--color-accent-light: #ff8787;
```

Then re-run `node generate-dashboard.js` to see the change.

### Add more task sections

In `tasks.md`, you can add any section heading you want under `## Your Section Name`. The dashboard currently groups tasks under three headings — ask Copilot to help you add support for additional sections if you'd like.

### Add more note files

Just create more `.md` files in the `notes/` folder. Each file becomes its own card on the notepad page.

### Ask Copilot to customize the dashboard

This is the best part! Open Copilot Chat in VS Code and try prompts like:

- *"Add a priority field to my tasks — high, medium, or low"*
- *"Make the dashboard show tasks in a kanban board layout"*
- *"Add a search bar to the notepad page"*
- *"Change the notepad to show one note at a time with tabs"*
- *"Add a dark/light mode toggle to the dashboard"*

Copilot can read the project files and help you make any of these changes.

---

## Troubleshooting

### "node: command not found"

Node.js needs to be installed on your computer. It's what runs the dashboard script.

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version (the one that says "Recommended for most users")
3. Install it
4. Close and reopen VS Code
5. Try `node generate-dashboard.js` again

### "No such file or directory"

Make sure you opened the `task-dashboard` folder specifically (not a parent folder). Check by looking at the top of VS Code — it should say `task-dashboard`.

### The dashboard looks empty

Make sure your `tasks.md` file has tasks in the `- [ ]` or `- [x]` format. The script looks for lines starting with `- [ ]` or `- [x]` — the format needs to be exact.

### Changes aren't showing up

- Make sure the server is still running (you should see "Watching for changes..." in the terminal). If you stopped it, run `node generate-dashboard.js --serve` again.
- Make sure you **saved** the file (`Cmd + S`) — the watcher only detects saved changes.
- Try refreshing the Simple Browser panel manually (click the reload icon in the Simple Browser toolbar) if auto-refresh isn't working.

---

## What you'll learn from this example

- **Markdown** — a simple way to format text that's used everywhere in tech
- **The VS Code terminal** — running commands, which opens the door to all kinds of tools
- **HTML & CSS** — the dashboard is generated as HTML, so you can inspect it and learn how web pages work
- **Project structure** — how files are organized in a real project
- **GitHub Copilot** — use the chat to ask questions about any file, or to help you customize the dashboard

---

## File structure

```
task-dashboard/
├── tasks.md                  ← Your task list (edit this!)
├── notes/
│   ├── welcome.md            ← Sample note
│   └── design-inspiration.md ← Sample note
├── generate-dashboard.js     ← The script that builds the dashboard
├── _site/                    ← Generated HTML (don't edit by hand)
│   ├── dashboard.html
│   └── notepad.html
├── .vscode/
│   └── tasks.json            ← VS Code task runner shortcut
└── README.md                 ← You are here!
```
