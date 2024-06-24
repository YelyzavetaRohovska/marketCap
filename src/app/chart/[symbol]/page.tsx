import { Suspense } from "react";
import { SymbolChart } from "@/components/Chart/symbolChart";
import BackButton from "@/components/BackButton";

interface PageProps {
  params: {
    symbol: string;
  }
}

export default async function Page({ params }: PageProps) {
  return (
    <div className="flex w-full flex-col justify-center items-start p-12">
      <BackButton />
      <Suspense fallback={<p>Loading...</p>}>
        <SymbolChart symbol={params.symbol}/>
      </Suspense>
    </div>
  );
}

