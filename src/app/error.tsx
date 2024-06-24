"use client";

import Button from "@/components/UI/Button";
import Link from "next/link";

export default function Error({
  error,
}: {error?: any}) {
  return (
    <div className="flex w-full h-lvh justify-center items-center flex-col p-12">
      <h2 className="text-lg my-2">Something went wrong!</h2>
      { error?.message && (
        <p className="rounded border border-stone-400 p-2 bg-stone-800 my-4">
          Details: {error.message}
        </p>
      )}
      <Link href={"/"} className="my-4">
        <Button>Visit Home Page</Button>
      </Link>
    </div>
  );
}
