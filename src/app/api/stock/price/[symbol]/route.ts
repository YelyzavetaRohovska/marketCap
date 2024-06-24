import { VeytError, defaultError, defaultErrorCode } from "@/app/services/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse, ResponseType, ServerResponse } from "../../search/[query]/route";
import { env } from "@/app/env.example";

const apiUrl = `${env.apiBaseUrl}/quote`;

const cache = new Map<string, Price>();

export interface Price {
  price: number;
	changesPercentage: number;
	change: number;
}

export interface PriceResponse extends Price {
  type: ResponseType.Success;
}

export async function GET(
  request: NextRequest, 
  { params }: { params: { symbol: string } }
): Promise<NextResponse<ServerResponse<PriceResponse | ErrorResponse>>> {
  try {
    if (!params.symbol) {
      throw new VeytError(400, "Incorect symbol provided");
    }

    let priceData: Price;
    let respCode = 200;
  
    if (cache.has(params.symbol)) {
      priceData = cache.get(params.symbol) as Price;
    } else {
      const priceDataResp = await fetch(`${apiUrl}/${params.symbol}?apikey=${env.apiKey}`);
      const parsedData = await priceDataResp.json();
    
      if (!priceDataResp.ok || !parsedData?.[0]) {
        throw new VeytError(priceDataResp.status, parsedData?.["Error Message"] || defaultError);
      }

      priceData = parsedData[0];
      respCode = priceDataResp.status;
      cache.set(params.symbol, priceData);
    }
  
    return NextResponse.json({ 
      type: ResponseType.Success,
      data: {
        price: priceData.price,
        change: priceData.change,
        changesPercentage: priceData.changesPercentage,
      },
    }, { status: respCode });
  } catch (e) {
    const error = e instanceof VeytError ? e.message : defaultError;
    const status = e instanceof VeytError ? e.code : defaultErrorCode;
    
    return NextResponse.json({ type: ResponseType.Error, data: { error } }, { status });
  }
}