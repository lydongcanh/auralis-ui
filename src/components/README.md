# Component Organization

This directory contains all React components organized by feature and responsibility.

## Directory Structure

```
src/components/
├── common/           # Shared utility components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── NotFound.tsx
│   └── index.ts
├── layout/           # Layout components
│   ├── RootLayout.tsx
│   └── index.ts
├── project/          # Project-related components
│   ├── Dashboard.tsx
│   ├── ProjectDataRooms.tsx
│   ├── ProjectUsers.tsx
│   ├── ProjectView.tsx
│   └── index.ts
├── data-room/        # Data room components
│   ├── DocumentTree.tsx
│   └── index.ts
├── ui/               # Shadcn/ui components (design system)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   └── index.ts
└── index.ts          # Main export file
```