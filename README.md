# Workout Tracker

> 💭 **Vibe Coding Experiment**
> **NOTE: This message is the only thing in this entire repo written by a human.**
> This app was created through "vibe coding," i.e., instructing an AI agent (Claude 3.7 Sonnet) what to build. I didn't touch the code. I dunno... the future is uncertain and mildly concerning. But also it's cool to be able to describe an app that is, essentially, just a CRUD interface, and to just have 'someone' else code it for me. I've thought a lot about how inefficient programming can be; I compare it to creating a new car and building (like, literally sketching out and creating from scratch) an engine each time. At some point, we as programmers need a common toolbox, right? I mean, how many times do we have to write a DB middle layer that's essentially exactly the same each time, except with a couple different buisness logics or fields.
>
> Anyway. I guess my point (especially to anyone looking at this repo to investigate if I'm a good programmer) is, I didn't write any of this code myself.

A simple, offline-first web application for tracking your workouts, weights, and progress. This "vibe coded" app is designed to be minimal, fast, and perfect for quick use at the gym when you're exhausted after a hard set.

## Features

- Track different workouts with names, types (Arms, Legs, Back, Shoulders, Other), and weights
- Mark workouts as completed with a single click
- View when you last completed each workout
- Filter workouts by type using a simple button interface
- Sort workouts alphabetically, by type, most recent, or oldest first
- Fully offline capable - works without internet connection
- Data persists in local storage
- Export/import functionality for easy backup and transfer between devices

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```
npm install
```

or

```
yarn
```

3. Start the development server:

```
npm run dev
```

or

```
yarn dev
```

4. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Building for Production

To create a production build:

```
npm run build
```

or

```
yarn build
```

The build output will be in the `dist` directory.

## Usage

1. Add new workouts using the input field at the top and select a workout type
2. Record weights for each workout
3. Click "Done Today" to mark a workout as completed on the current date
4. Expand the "Filters & Sorting" section to filter and sort your workouts
5. Use the Backup/Restore feature to export your data or transfer it between devices
6. All data is automatically saved to your browser's local storage

### Backup and Transfer Data

This app is designed to work locally without a server, but you can still back up your data:

1. Click the "Backup/Restore" button at the top right
2. In the export section, click the copy button to copy your workout data to the clipboard
3. Paste this data somewhere safe (like a text message to yourself or a note app)
4. To restore data, paste your backup into the import field and click "Import"

## Offline Support

This app works fully offline and can be installed as a Progressive Web App (PWA) on mobile devices:

1. On iOS: Open in Safari, tap the Share button, then "Add to Home Screen"
2. On Android: Open in Chrome, tap the menu button, then "Add to Home Screen"

The app is designed to load instantly and work without an internet connection, making it perfect for use at the gym.

## Installation on Mobile

1. Host the app (GitHub Pages works great)
2. Visit the app URL on your mobile device
3. Install it to your home screen using your browser's "Add to Home Screen" option
4. The app will now appear on your home screen with its own icon
5. Open it anytime, even without internet access

## Technologies Used

- Vue.js 3
- Tailwind CSS
- PrimeVue
- Service Workers for offline capability
- LocalStorage for data persistence

## About This App

This "vibe coded" web app was designed for personal use with simplicity and speed in mind. It focuses on being immediately usable when you're exhausted after a workout, with large buttons and minimal interaction required to log your progress.
