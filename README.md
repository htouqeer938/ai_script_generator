# AI Script Generator

## Purpose

This is a full-stack web app that generates video scripts using AI.  
Users can enter a topic, select a tone and video length, and get a structured script suitable for narration.

---

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- React Hook Form + Yup
- OpenAI API

---

## How It Works

1. User enters a topic
2. Selects tone and video length
3. Frontend sends request to `/api/generate`
4. Backend builds a prompt and calls OpenAI API
5. AI returns a script
6. Script is displayed on the screen

---
