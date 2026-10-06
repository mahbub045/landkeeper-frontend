import { IconName, iconNames } from 'lucide-react/dynamic';

const kebabToPascal = (name: string) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

// "ArrowUp01" -> "arrow-up-0-1", built from lucide's own name list so
// numbers and edge cases always match.
const PASCAL_TO_KEBAB = new Map<string, IconName>(
  iconNames.map((name) => [kebabToPascal(name), name]),
);
const KEBAB_NAMES = new Set<string>(iconNames);

// Accepts JSX copied from lucide.dev (`<Check />`, `<Check className="..." />`),
// a PascalCase name (`Check`, `CheckIcon`) or a kebab-case name (`check`).
// Returns lucide's kebab-case icon name, or null when it isn't a lucide icon.
export function parseLucideIcon(input: string | null | undefined) {
  const match = input?.trim().match(/^<?\s*([A-Za-z][\w-]*)/);
  if (!match) return null;

  const raw = match[1];
  if (KEBAB_NAMES.has(raw)) return raw as IconName;

  const pascal = raw.endsWith('Icon') ? raw.slice(0, -4) : raw;
  return PASCAL_TO_KEBAB.get(pascal) ?? PASCAL_TO_KEBAB.get(raw) ?? null;
}

// Formats a stored icon name back to the JSX lucide.dev copies (`check` ->
// `<Check />`). Values that aren't lucide icons are returned unchanged.
export function toLucideJsx(value: string) {
  const name = parseLucideIcon(value);
  return name ? `<${kebabToPascal(name)} />` : value;
}
