import MarketList from "@/components/MarketList";
import { Suspense } from "react";

interface HomeProps {
  searchParams?: {
    query?: string;
    page?: string;
    limit?: string;
  }
}

export default async function Home({
  searchParams
}: HomeProps) {
  let { query, page, limit } = searchParams ?? {};

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-24 gap-4">
      <h1 className="text-3xl">Markets overview</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <MarketList 
          query={query} 
          page={page} 
          limit={limit}
        />
      </Suspense>
    </main>
  );
}
