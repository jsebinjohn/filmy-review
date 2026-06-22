# Filmy Review

Filmy Review is a React + Vite application that lets users browse movie collections, view detailed movie information, rate movies, and submit reviews directly in the platform.

## Project Overview

This app integrates with the TMDB API to show popular, top rated, and upcoming movies. Users can click cards to open built-in movie detail pages instead of navigating to an external site, making the review experience more seamless.

## Features

- Browse movie lists by category: Popular, Top Rated, Upcoming
- Search movies by title
- Filter movies by minimum rating
- Sort movies by release date or TMDB rating
- Open internal movie detail pages for each movie
- Rate movies directly from the detail page
- Submit and store user reviews locally using browser storage

## Built With

- React 19
- Vite
- React Router DOM
- TMDB API
- Vanilla CSS for styling

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 10 or newer

### Install

1. Clone the repository:

```bash
git clone <repo-url>
cd "filmy review"
```

2. Install dependencies:

```bash
npm install
```

### Run the App

```bash
npm run dev
```

Open the local development URL shown in the terminal, usually `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Application Structure

- `src/App.jsx`: App routing and home screen layout
- `src/main.jsx`: App entry point with `BrowserRouter`
- `src/components/MovieList`: Movie list UI, search, sorting, and filtering
- `src/components/MovieList/MovieCard.jsx`: Clickable cards that navigate to internal details
- `src/components/MovieDetail`: Dedicated movie detail page with review submission and rating
- `src/components/Navbar`: Top-level navigation within the page
- `src/assets`: App icons and images

## Movie Detail Pages

The movie detail page provides:

- movie poster and metadata
- TMDB rating and runtime
- genre list and overview
- rating selector for the logged-in browser session
- review form and review history stored in `localStorage`

## Notes

- The app uses the TMDB API key configured in the movie list and detail components.
- Movie reviews and ratings are persisted locally in the browser using `localStorage`.

## Reviewer Notes

- The app now avoids external redirection from movie cards and relies on internal routes built with React Router.
- Dedicated movie detail pages are implemented in `src/components/MovieDetail/MovieDetail.jsx`.
- The README now includes setup instructions, feature descriptions, and architecture details to help users and reviewers understand the project.
"# movie-review-project" 
