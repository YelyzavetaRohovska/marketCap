import { VeytError, defaultError, defaultErrorCode } from "@/app/services/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse, ResponseType, ServerResponse } from "../../search/[query]/route";
import { env } from "@/app/env.example";

const apiUrl = `${env.apiBaseUrl}/historical-chart/4hour`;

const cache = new Map<string, Statistic[]>();

export interface Statistic {
  date: Date;
  low: number;
}

export interface StatisticResponse extends Statistic {
  type: ResponseType.Success;
}

export async function GET(
  request: NextRequest, 
  { params }: { params: { symbol: string } }
): Promise<NextResponse<ServerResponse<StatisticResponse | ErrorResponse>>> {
  try {
    if (!params.symbol) {
      throw new VeytError(400, "Incorect symbol provided");
    }

    let statisticData: Statistic[];
    let respCode = 200;
  
    if (cache.has(params.symbol)) {
      statisticData = cache.get(params.symbol) as Statistic[];
    } else {
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - 30);

      const statisticDataResp = await fetch(`${apiUrl}/${params.symbol}?from=${formatDate(fromDate)}&to=${formatDate(toDate)}&apikey=${env.apiKey}`);
      const parsedData = await statisticDataResp.json();
    
      if (!statisticDataResp.ok || !parsedData) {
        throw new VeytError(statisticDataResp.status, parsedData?.["Error Message"] || defaultError);
      }

      if (!parsedData.length) {
        throw new VeytError(404, "Data not found. Try another token :L");
      }

      statisticData = parsedData;
      respCode = statisticDataResp.status;

      cache.set(params.symbol, statisticData);
    }
  
    return NextResponse.json({ 
      type: ResponseType.Success,
      data: statisticData,
    }, { status: respCode });
  } catch (e) {
    const error = e instanceof VeytError ? e.message : defaultError;
    const status = e instanceof VeytError ? e.code : defaultErrorCode;
    
    return NextResponse.json({ type: ResponseType.Error, data: { error } }, { status });
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};