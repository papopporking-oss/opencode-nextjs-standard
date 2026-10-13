# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:code-comments -->

## Code Comments

- All code comments must be written in English.
- Comments must describe the steps or logic of the implementation.
- Use clear and concise language.
- Do not use special characters in comments.
- Avoid unnecessary comments.
- Comments should explain what each step does when clarification is needed.

<!-- END:code-comments -->

<!-- BEGIN:jsx-and-tsx-formatting -->

## JSX and TSX Formatting

- Use compact formatting for JSX and TSX elements.
- Keep element attributes on a single line whenever possible.
- Do not split attributes across multiple lines.
- Keep self-closing tags on a single line whenever possible.
- Place closing brackets on the same line as the final attribute.
- Avoid unnecessary line breaks between JSX elements.
- Preserve proper indentation and readability.
- Follow the compact formatting style demonstrated in existing components.

Example:
```tsx
<input id="sidebar-drawer-id" type="checkbox" className="drawer-toggle"/>
```

Incorrect:
```tsx
<input
  id="sidebar-drawer-id"
  type="checkbox"
  className="drawer-toggle"
/>
```

Correct:
```tsx
<input id="sidebar-drawer-id" type="checkbox" className="drawer-toggle"/>
```

Incorrect:
```tsx
<label
  htmlFor="sidebar-drawer-id"
  className="btn btn-square btn-ghost drawer-button"
  aria-label="Open drawer"
>
```

Correct:
```tsx
<label htmlFor="sidebar-drawer-id" className="btn btn-square btn-ghost drawer-button">
```

Incorrect:
```tsx
<path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth="2"
  d="M4 6h16M4 12h16M4 18h16"
/>
```

Correct:
```tsx
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
```

<!-- END:jsx-and-tsx-formatting -->

<!-- BEGIN:formatting-priority -->

## Formatting Priority

- Apply compact JSX and TSX formatting consistently across the project.
- Do not introduce multiline attributes unless absolutely necessary.
- Do not sacrifice code correctness or readability to enforce compact formatting.
- Follow the project's established formatting rules and avoid conflicts with automated formatters.

<!-- END:formatting-priority -->

<!-- BEGIN:file-naming-conventions -->

## File Naming Conventions

- Follow consistent file naming conventions throughout the project.
- Use PascalCase for React components and TSX files.
- Use camelCase for utility files, hooks, services, and helper functions.
- Use kebab-case only when required by the framework or existing project conventions.
- Do not mix naming conventions within the same file category.
- File names must clearly describe their purpose and responsibility.

## Naming Rules

| File Type | Naming Convention | Examples |
|---|---|---|
| React Components (`.tsx`) | PascalCase | `Navbar.tsx`, `Sidebar.tsx`, `UserProfile.tsx` |
| Pages (`.tsx`) | PascalCase | `Home.tsx`, `Dashboard.tsx`, `Login.tsx` |
| Layout Components (`.tsx`) | PascalCase | `MainLayout.tsx`, `AuthLayout.tsx` |
| Custom Hooks (`.ts`) | camelCase with `use` prefix | `useAuth.ts`, `useFetch.ts` |
| Utility Files (`.ts`) | camelCase | `formatDate.ts`, `validation.ts` |
| Service Files (`.ts`) | camelCase | `authService.ts`, `apiConstants.ts` |
| Type Definition Files (`.ts`) | camelCase | `user.ts`, `product.ts` |
| Constant Files (`.ts`) | camelCase | `appConfig.ts`, `apiConstants.ts` |
| Context Files (`.tsx`) | PascalCase | `AuthContext.tsx`, `ThemeContext.tsx` |

## Component Naming

- React component names must use PascalCase.
- Component file names must match their exported component names whenever possible.
- Use descriptive names that represent the component's purpose.
- Avoid generic names such as `Component.tsx`, `Test.tsx`, or `Temp.tsx` in production code.

Example:
```tsx
// UserProfile.tsx
export default function UserProfile() {
  return <div>User Profile</div>;
}
```

## Custom Hook Naming

- Custom hooks must start with the `use` prefix.
- Use camelCase for hook file names and exported function names.
- Custom hooks must follow React Hooks naming conventions.

Example:
```ts
// useAuth.ts
export function useAuth() {
  // Hook logic
}
```

## Directory Naming

- Use lowercase names for directories.
- Use kebab-case when directory names contain multiple words.
- Keep directory names descriptive and consistent.
- Group files by feature or responsibility when appropriate.

Examples:
```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── UserProfile.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── authService.ts
├── utils/
│   └── formatDate.ts
├── types/
│   └── user.ts
└── pages/
    ├── Home.tsx
    └── Dashboard.tsx
```

## Naming Consistency

- Follow the naming conventions already established in the project.
- Do not rename existing files unless explicitly required or necessary for consistency.
- Do not introduce alternative naming conventions without a clear reason.
- Ensure import paths match the exact file names, including letter casing.
- Use consistent casing to prevent case-sensitive path resolution issues across different operating systems.

<!-- END:file-naming-conventions -->

<!-- BEGIN:prompt-language-handling -->

## Prompt Language Handling

- When the user provides a prompt in Thai, translate it into English before processing the request.
- Use the translated English prompt as the primary context for reasoning, planning, and execution.
- Understand the user's original intent and preserve the full meaning, context, requirements, and constraints during translation.
- Do not simply translate the prompt and stop. Continue reasoning and execute the requested task based on the translated prompt.
- Do not omit, simplify, or modify any requirements from the original prompt.
- Preserve technical terms, programming terminology, file names, API names, framework names, and code identifiers without unnecessary translation.
- If the original prompt contains both Thai and English, translate only the Thai portions while preserving the original English content.
- If the request is ambiguous, interpret it using the surrounding context. Ask for clarification only when the ambiguity materially affects implementation.
- Respond in Thai by default when the user communicates in Thai, unless the user explicitly requests another language.
- All generated code, code comments, variable names, function names, and technical documentation must follow the project's existing language and naming conventions.

<!-- END:prompt-language-handling -->