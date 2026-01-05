# Design System Documentation

## Overview

This design system is built on Tailwind CSS v4 with CSS variables for theming and dark mode support. All components follow consistent patterns for maintainability and scalability.

## Design Tokens

### CSS Variables

All design tokens are defined in `src/app/globals.css` using HSL color format for easy manipulation.

#### Color System

**Primary Scale:**
- `--primary`: Main brand color
- `--primary-foreground`: Text color on primary background

**Secondary Scale:**
- `--secondary`: Secondary background color
- `--secondary-foreground`: Text color on secondary background

**Destructive Scale:**
- `--destructive`: Error/danger color
- `--destructive-foreground`: Text color on destructive background

**Muted Scale:**
- `--muted`: Muted background
- `--muted-foreground`: Muted text color

**Accent Scale:**
- `--accent`: Accent color for highlights
- `--accent-foreground`: Text color on accent

**Card Scale:**
- `--card`: Card background
- `--card-foreground`: Card text color

**Border & Input:**
- `--border`: Border color
- `--input`: Input border color
- `--ring`: Focus ring color

**MOW Brand Colors (Legacy):**
- `--mow-primary`: #00d2ff
- `--mow-dark`: #0b0b0f
- `--mow-surface`: #15151a
- `--mow-light`: #ffffff
- `--mow-gray`: #888888

#### Spacing & Layout

- `--radius`: Base border radius (0.5rem)

### Tailwind Class Mapping

| Tailwind Class | CSS Variable |
|---------------|--------------|
| `bg-primary` | `hsl(var(--primary))` |
| `text-primary-foreground` | `hsl(var(--primary-foreground))` |
| `bg-secondary` | `hsl(var(--secondary))` |
| `border-border` | `hsl(var(--border))` |
| `rounded-lg` | `var(--radius)` |

## Utility Functions

### `cn(...inputs: ClassValue[])`

Combines `clsx` and `tailwind-merge` for intelligent class merging.

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class", className)} />
```

### `cva(base, variants)`

Class Variance Authority for defining component variants.

```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        outline: "outline-classes",
      },
      size: {
        sm: "small-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);
```

## Component Patterns

### Polymorphism with `asChild`

The `asChild` prop allows components to render as different elements while maintaining their styling. This is powered by `@radix-ui/react-slot`.

**Example: Button as Link**

```tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

<Button asChild>
  <Link href="/about">About Us</Link>
</Button>
```

The Button styles are applied, but the element renders as a `<Link>` for proper navigation semantics.

### Component Props Pattern

All components follow this pattern:

1. **Extend base HTML props**: Use `React.ComponentPropsWithoutRef<"element">`
2. **Forward refs**: Use `React.forwardRef` for proper ref handling
3. **Merge className**: Always use `cn()` to merge custom classes
4. **Named exports**: All components use named exports

**Example:**

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Implementation
  }
);
Button.displayName = "Button";

export { Button };
```

## Components

### Button

**Variants:**
- `default`: Primary button
- `destructive`: Error/danger action
- `outline`: Outlined button
- `secondary`: Secondary action
- `ghost`: Minimal button
- `link`: Link-styled button

**Sizes:**
- `sm`: Small
- `default`: Default
- `lg`: Large
- `icon`: Square icon button

**Example:**

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">Click Me</Button>
<Button variant="outline" asChild>
  <Link href="/">Home</Link>
</Button>
```

### Badge

**Variants:**
- `default`: Primary badge
- `secondary`: Secondary badge
- `destructive`: Error badge
- `outline`: Outlined badge

**Example:**

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="secondary">New</Badge>
```

### Input

Standard text input with focus states and accessibility support.

**Example:**

```tsx
import { Input } from "@/components/ui/input";

<Input type="email" placeholder="Enter email" />
<Input type="file" />
<Input disabled />
```

### Separator

Horizontal or vertical divider using Radix UI primitives.

**Example:**

```tsx
import { Separator } from "@/components/ui/separator";

<Separator />
<Separator orientation="vertical" />
```

### Card

Composable card components with semantic parts.

**Parts:**
- `Card`: Container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content
- `CardFooter`: Footer section

**Example:**

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Typography

Semantic typography components for consistent text styling.

**Components:**
- `H1`, `H2`, `H3`, `H4`: Heading levels
- `P`: Paragraph text
- `Lead`: Larger introduction text
- `Large`: Large utility text
- `Small`: Small utility text
- `Muted`: Muted secondary text
- `Blockquote`: Quoted text

**Example:**

```tsx
import { H1, H2, P, Lead, Muted } from "@/components/ui/typography";

<H1>Main Heading</H1>
<Lead>Introduction text</Lead>
<P>Body paragraph</P>
<Muted>Secondary information</Muted>
```

## Visual Playground

A visual testing page is available at `/design` to view all component variants side-by-side. This helps with:

- Visual regression testing
- Component discovery
- Design QA

**Note:** This route should be excluded from production builds.

## Migration Guide

### Updating Existing Components

1. **Replace hardcoded colors** with design token classes:
   ```tsx
   // Before
   <div className="bg-black text-white" />
   
   // After
   <div className="bg-primary text-primary-foreground" />
   ```

2. **Use typography components** instead of raw HTML:
   ```tsx
   // Before
   <h1 className="text-4xl font-bold">Title</h1>
   
   // After
   <H1>Title</H1>
   ```

3. **Use utility components** for common patterns:
   ```tsx
   // Before
   <div className="h-[1px] w-full bg-gray-200" />
   
   // After
   <Separator />
   ```

4. **Merge classes with `cn()`**:
   ```tsx
   // Before
   <div className={`base ${condition ? "conditional" : ""} ${className}`} />
   
   // After
   <div className={cn("base", condition && "conditional", className)} />
   ```

## Best Practices

1. **Always use design tokens** - Never hardcode colors or spacing
2. **Forward refs** - All interactive components should forward refs
3. **Use semantic HTML** - Prefer semantic elements over divs
4. **Accessibility first** - Include ARIA labels and keyboard support
5. **Consistent naming** - Use kebab-case for files, PascalCase for components
6. **Type safety** - Leverage TypeScript for prop validation

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Class Variance Authority](https://cva.style)

