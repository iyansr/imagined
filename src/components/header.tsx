import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-border border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <h2 className="font-semibold text-foreground text-xl">imagined</h2>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="#"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Trending
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Categories
            </Link>
            <Link
              href="#"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>
          {/* <Link href="/add-prompt">
							<Button variant="outline" size="sm">
								<PlusIcon className="mr-2 h-4 w-4" />
								Add Prompt
							</Button>
						</Link> */}
          <Link href="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
