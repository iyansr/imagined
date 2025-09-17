'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { data: session, isPending } = authClient.useSession();

  const renderSession = () => {
    if (isPending) {
      return null;
    }
    if (session) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="size-7">
              <AvatarImage src={session.user.image || ''} />
              <AvatarFallback>
                {(session.user.name || '').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem asChild>
              <Link href="/create">Create</Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => authClient.signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Link href="/auth">
        <Button size="sm">Sign In</Button>
      </Link>
    );
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-border border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <h2 className="font-semibold text-foreground text-xl">imagined</h2>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/create"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Create
            </Link>
            {/* <Link
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
            </Link> */}
          </nav>
          {/* <Link href="/add-prompt">
							<Button variant="outline" size="sm">
								<PlusIcon className="mr-2 h-4 w-4" />
								Add Prompt
							</Button>
						</Link> */}
          {renderSession()}
        </div>
      </div>
    </header>
  );
}
