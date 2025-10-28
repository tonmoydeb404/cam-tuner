# Cam Tuner Monorepo

This project uses pnpm workspaces to manage multiple packages in a single repository.

## Structure

```
cam-tuner/
├── apps/
│   ├── extension/    # Browser extension (Chrome/Firefox)
│   └── website/      # Next.js marketing website
├── scripts/          # Build and utility scripts
└── package.json      # Root workspace configuration
```

## Available Scripts

### Development

- `pnpm dev:extension` - Run extension in development mode
- `pnpm dev:website` - Run website in development mode

### Building

- `pnpm build:extension` - Build extension for production
- `pnpm build:website` - Build website for production
- `pnpm build:all` - Build all packages

### Linting

- `pnpm lint:all` - Lint all packages

### Maintenance

- `pnpm clean` - Remove all build outputs and node_modules
- `pnpm sync-version` - Sync root version to extension manifest

## Workspace Configuration

### Package-Specific Dependencies

Each workspace package has its own dependencies for package-specific needs.

## Environment Requirements

- **Node.js**: v22.12.0 (specified in `.nvmrc`)
- **Package Manager**: pnpm v10.19.0

## Development Workflow

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development:
   - Extension: `pnpm dev:extension`
   - Website: `pnpm dev:website`

## Configuration Files

- `.npmrc` - pnpm workspace configuration
- `pnpm-workspace.yaml` - Workspace package definitions
- `.nvmrc` - Node.js version specification
- `tsconfig.json` - TypeScript configuration (in each package)

## Notes

- All packages share a single `pnpm-lock.yaml` at the root
- Dependencies are hoisted to the root `node_modules` where possible
- Each package maintains its own build configuration
