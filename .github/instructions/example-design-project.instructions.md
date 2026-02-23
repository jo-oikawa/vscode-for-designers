---
applyTo: "**"
---

# Design Project Instructions for Copilot

These instructions guide GitHub Copilot's behavior when working in this project.
Place this file at `.github/instructions/` in your own project to customize how Copilot assists you.

## Tone and style

- Write clear, plain-English explanations — avoid jargon
- Prefer simple solutions over clever ones
- Always add comments to explain *why*, not just *what*

## Code style

- Use descriptive variable names (e.g. `buttonColor` not `bc`)
- Keep functions small and focused on one task
- Prefer `const` over `let` unless the value needs to change

## Design-specific guidance

- When working with colors, use CSS custom properties (variables) so they're easy to update
- When building UI components, consider accessibility from the start (ARIA labels, keyboard navigation)
- Prefer relative units (`rem`, `%`, `vw`) over fixed pixel values for responsive layouts

## When I ask for help

- Explain what the code does in plain language before showing it
- If there are multiple approaches, briefly describe the tradeoffs
- If you're unsure, say so — don't guess silently
