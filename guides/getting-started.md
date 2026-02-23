# Getting Started: Setting Up VS Code for Design Work

Welcome! This guide walks you through setting up VS Code with GitHub Copilot so you can start building things — even if you've never written code before.

---

## What you'll need

- A computer (Mac, Windows, or Linux)
- A free GitHub account — [sign up here](https://github.com/signup)
- About 15 minutes

---

## Step 1: Install VS Code

VS Code is a free code editor made by Microsoft. It's fast, flexible, and works great for design projects.

1. Go to [code.visualstudio.com](https://code.visualstudio.com/)
2. Click **Download** and follow the installer for your operating system
3. Open VS Code once it's installed

---

## Step 2: Enable GitHub Copilot

GitHub Copilot is an AI assistant built into VS Code. It can write code, explain things, and answer questions as you work.

1. Go to [github.com/features/copilot](https://github.com/features/copilot) and sign up (there's a free plan)
2. In VS Code, open the Extensions panel (the icon that looks like four squares, or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **GitHub Copilot** and click **Install**
4. Sign in with your GitHub account when prompted

Once installed, you'll see the Copilot icon in the bottom status bar. You're ready to go.

---

## Step 3: Open Copilot Chat

Copilot Chat is where you can ask questions and have a conversation with Copilot — like a pair programmer who's always available.

1. Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac) to open Copilot Chat
2. Try asking it something like: *"How do I create an HTML file?"* or *"What's the simplest way to build a webpage?"*

---

## Step 4: Open a folder and start building

VS Code works best when you have a project folder open.

1. Create a new folder on your computer (e.g. `my-first-project`)
2. In VS Code, go to `File > Open Folder` and select your new folder
3. Create a new file: `index.html`
4. In Copilot Chat, ask: *"Create a simple HTML page for a portfolio site"*

Copilot will suggest code. You can accept it, modify it, and keep building from there.

---

## Step 5: Customize Copilot with instructions

You can guide how Copilot behaves in your project by adding an instructions file. This is especially useful if you want Copilot to use a specific style, avoid certain patterns, or explain things in plain language.

1. Create a folder called `.github/instructions/` inside your project
2. Create a file called `my-project.instructions.md`
3. Write your guidelines — see the [example instructions file](../.github/instructions/example-design-project.instructions.md) in this repo for inspiration

---

## What's next?

- Browse the [`examples/`](../examples/) folder to see real projects you can learn from
- Try the [`prompts/`](../prompts/) folder for ready-to-use Copilot prompts
- Check the [`tools/`](../tools/) folder for scripts that can save you time

You don't need to know everything before you start. Open VS Code, ask Copilot a question, and see what happens.
