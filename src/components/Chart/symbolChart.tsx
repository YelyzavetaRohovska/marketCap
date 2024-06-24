import { env } from "@/app/env.example";

import { VeytError } from "@/app/services/errorHandler";
import { ResponseType } from "@/app/api/stock/search/[query]/route";

import { Chart } from "./chart";

export const SymbolChart = async ({ symbol }: { symbol: string }) => {
  let data = [];

  const res = await fetch(`${env.baseUrl}/stock/chart/${symbol}`, { cache: "no-store" });
  let parsedData = await res.json();

  if (res.ok && parsedData?.data && parsedData?.type == ResponseType.Success) {
    data = parsedData.data;
  } else {
    throw new VeytError(res.status, parsedData?.data?.error);
  }

  return (
   <Chart data={data}/>
  );
};
