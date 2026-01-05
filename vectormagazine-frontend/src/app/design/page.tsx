"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
} from "@/components/ui/typography";
import Link from "next/link";

export default function DesignPage() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="space-y-4">
        <H1>Design System Playground</H1>
        <Lead>
          This page showcases all component variants for visual testing and QA.
        </Lead>
      </div>

      <Separator />

      {/* Typography */}
      <section className="space-y-4">
        <H2>Typography</H2>
        <div className="space-y-4">
          <H1>Heading 1</H1>
          <H2>Heading 2</H2>
          <H3>Heading 3</H3>
          <H4>Heading 4</H4>
          <P>
            This is a paragraph with regular body text. It demonstrates the
            standard paragraph styling with proper line height and spacing.
          </P>
          <Lead>
            This is a lead paragraph - larger, muted text perfect for
            introductions or article openings.
          </Lead>
          <Large>Large text component</Large>
          <Small>Small text component</Small>
          <Muted>Muted text for secondary information</Muted>
          <Blockquote>
            "This is a blockquote with a left border and italic styling."
          </Blockquote>
        </div>
      </section>

      <Separator />

      {/* Buttons */}
      <section className="space-y-4">
        <H2>Buttons</H2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🚀</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/">Button as Link</Link>
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      {/* Badges */}
      <section className="space-y-4">
        <H2>Badges</H2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <Separator />

      {/* Inputs */}
      <section className="space-y-4">
        <H2>Inputs</H2>
        <div className="space-y-4 max-w-md">
          <Input type="text" placeholder="Text input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
          <Input type="file" />
          <Input type="text" placeholder="Disabled input" disabled />
        </div>
      </section>

      <Separator />

      {/* Separators */}
      <section className="space-y-4">
        <H2>Separators</H2>
        <div className="space-y-4">
          <div>
            <p>Horizontal separator above</p>
            <Separator />
            <p>Horizontal separator below</p>
          </div>
          <div className="flex gap-4">
            <p>Vertical</p>
            <Separator orientation="vertical" />
            <p>Separator</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Cards */}
      <section className="space-y-4">
        <H2>Cards</H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>
              <P>This is the card content area.</P>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <P>More card content here.</P>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

