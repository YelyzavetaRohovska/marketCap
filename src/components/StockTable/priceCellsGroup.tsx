import { Price } from "@/app/api/stock/price/[symbol]/route";
import { ResponseType } from "@/app/api/stock/search/[query]/route";

import ColorIndicator, { EIndicatorColor } from "../UI/ColorIndicator";
import Toast from "../Toast";
import Link from "next/link";
import { env } from "@/app/env.example";

export async function PriceCellsGroup({
  symbol,
  skeleton,
}: { symbol: string, skeleton?: boolean }) {
  if (skeleton) {
    return (
      <>
        <td>Loading...</td>
        <td>Loading...</td>
        <td>Loading...</td>
        <td>Loading...</td>
      </>
    );
  }

  let result: Price;
  let error = "";

  const res = await fetch(`${env.baseUrl}/stock/price/${symbol}`, { cache: "no-store" });
  let parsedData = await res.json();
  
  if (res.ok && parsedData && parsedData.type == ResponseType.Success && parsedData.data) {
    result = parsedData.data;
  } else {
    error = parsedData?.data?.error;
    result = { price: "N/A", change: "N/A", changesPercentage: "N/A" } as any as Price;
  }

  return (
    <>
      <td>{result.price}</td>
      <td>
        <ColorIndicator state={getState(result.change)}>{result.change}</ColorIndicator>
      </td>
      <td>
        <ColorIndicator state={getState(result.changesPercentage)}>{result.changesPercentage}%</ColorIndicator>
      </td>
      <td>
        {error ? <span>No data</span> : <Link href={`/chart/${symbol}`}>Show Chart</Link>}
      </td>
    </>
  );
}

function getState(value: number | string): EIndicatorColor {
  if (typeof value == "string") return EIndicatorColor.Default;

  if (value > 0) return EIndicatorColor.Success;
  else if (value === 0) return EIndicatorColor.Default;
  else return EIndicatorColor.Danger;
}
