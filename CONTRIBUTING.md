# Contributing to Grabby Inspector

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Test in both Vite and Next.js projects

## Project Structure

```
Grabby Tool/
├── adapters/          # Framework-specific adapters
│   ├── vite.ts       # Vite middleware plugin
│   └── next.ts       # Next.js API handlers
├── client/           # Browser-side HUD
│   └── grabby.js     # Zero-dependency client script
├── scripts/          # Setup automation
│   ├── setup-vite.js
│   └── setup-next.js
├── examples/         # Integration examples
└── package.json
```

## Testing

### Test with Vite

1. Create a test Vite project
2. Link the package: `npm link /path/to/grabby-tool`
3. Run setup: `npm run setup:vite`
4. Test the inspector

### Test with Next.js

1. Create a test Next.js project (both App and Pages Router)
2. Link the package: `npm link /path/to/grabby-tool`
3. Run setup: `npm run setup:next`
4. Test the inspector

## Code Style

- Use TypeScript for adapters
- Keep client script vanilla JS (zero dependencies)
- Follow existing code formatting
- Add comments for complex logic

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a PR with a clear description

## Reporting Issues

- Use GitHub Issues
- Include framework version (Vite/Next.js)
- Provide reproduction steps
- Share error messages and logs

## Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Describe the use case
- Explain why it would be useful
- Consider backward compatibility
