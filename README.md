# vivon-app

A desktop application built with Electron, Vite, TypeScript, and React.
Hosted at https://vivon-app.onrender.com/

## Tech Stack

- **Electron** - Cross-platform desktop app framework
- **React** - UI library with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Package manager

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

This starts both the Vite dev server and Electron app with hot reload.

## Building

```bash
# Build for production
pnpm build
```

## Project Structure

```
vivon-app/
├── src/           # Electron main process
├── frontend/      # React renderer process
└── dist/          # Built files
```
