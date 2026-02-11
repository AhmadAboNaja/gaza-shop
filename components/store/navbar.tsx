"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { CartSheet } from "@/components/store/cart-sheet";
import { ThemeToggle } from "@/components/store/theme-toggle";
import { LocaleSwitcher } from "@/components/store/locale-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({
  locale,
  labels,
}: {
  locale: "en" | "ar";
  labels: {
    cart: string;
    emptyCart: string;
    total: string;
    checkout: string;
    search: string;
    account: string;
    orders: string;
    admin: string;
    signIn: string;
    signOut: string;
    signedIn: string;
    signedOut: string;
  };
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useSearchParams();

  const onSearch = (value: string) => {
    const query = new URLSearchParams(params.toString());
    if (value) query.set("q", value);
    else query.delete("q");
    router.push(`/?${query.toString()}`);
  };

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Gaza Shop
        </Link>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={labels.search}
            defaultValue={params.get("q") ?? ""}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <CartSheet
          labels={{
            cart: labels.cart,
            emptyCart: labels.emptyCart,
            total: labels.total,
            checkout: labels.checkout,
          }}
        />
        <LocaleSwitcher current={locale} />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {session?.user?.name ?? labels.account}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {session?.user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/orders">{labels.orders}</Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">{labels.admin}</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    toast.success(labels.signedOut);
                  }}
                >
                  {labels.signOut}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                onClick={async () => {
                  await signIn();
                  toast.success(labels.signedIn);
                }}
              >
                {labels.signIn}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
