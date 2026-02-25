# AI Workshop for Software Engineers

## Project Purpose
This is a workshop/course content project. The goal is to create a practical, hands-on workshop teaching developers how to leverage AI for software engineering.

## Workflow
- User provides rough ideas, notes, and outlines
- Claude enhances, structures, and consolidates them into practical workshop format
- Content is organized into modules with hands-on exercises

## Format Conventions
- Workshop content lives in `modules/` directory
- Each module has a README.md with objectives, content, and exercises
- Supporting code examples go in `examples/` within each module
- Main syllabus is in `syllabus.md`
- Use clear, practical language — this is for working developers, not academics

## Platform Decision
We use a **static site generator (MkDocs Material)** to publish the workshop as a website. This gives us:
- Markdown-based authoring (easy to maintain)
- Beautiful developer-friendly docs site
- Code syntax highlighting out of the box
- Search, navigation, dark mode
- Can be hosted free on GitHub Pages or Netlify

## Key Principles
- Every concept must have a hands-on exercise
- Focus on practical patterns, not theory
- Examples should use real-world scenarios
- Progressive difficulty: basics → intermediate → advanced
