# Connect Vibe Co

Local meetups, weekend trips, and nights out — vetted, bookable, and built
for people who want to show up rather than scroll past.

**Live:** https://connectvibeco.vercel.app

## Overview

Connect Vibe Co is a Next.js web app for discovering and booking local
events and weekend trips. It's built as a fully functional frontend
prototype — real booking flow, real ticket generation, persistent saved
items, and a working dashboard — backed by mock data rather than a live
database, so it can be explored and demoed end-to-end without any setup.

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React, React Icons
- **Persistence:** Browser localStorage (no backend/database yet)
- **Deployment:** Vercel

## Features

**Discovery**
- Browse events and trips with category filters and sorting (date, price, spots)
- Homepage tabs (nearby / this week / trips) with real filtering logic
- Mock "who's going" attendee stack and "filling fast" urgency badges

**Booking**
- Full sign-up/login flow (email/password + mock Google sign-in)
- Book events and trips, generating a real ticket with a unique code
- Ticket receipts and booking history

**Personalization**
- Save/bookmark events and trips (persists across visits)
- Editable profile: avatar (upload or preset), pronouns, orientation, bio
- Dashboard showing available events, your bookings, and saved items

**Content pages**
- About, Blog, Contact (functional form), Terms, Privacy — all real, no dead links
- Custom 404 page matching the brand

**Polish**
- Mobile-first responsive design with hamburger navigation
- Toast notifications, loading skeletons, empty states throughout
- Full SEO setup: Open Graph, Twitter Card, favicon, sitemap-ready metadata

## Getting started

```bash
git clone https://github.com/Bakareferanmi/connectvibeco.git
cd connectvibeco
npm install
npm run dev
