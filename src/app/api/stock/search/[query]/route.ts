import { env } from "@/app/env.example";
import { VeytError, defaultError, defaultErrorCode } from "@/app/services/errorHandler";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = `${env.apiBaseUrl}/search`;

const cache = new Map<string, Company[]>();

export interface Company {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

export enum ResponseType {
  Success = "success",
  Error   = "error",
}

export interface CompanyResponse {
  type: ResponseType.Success,
  totalPages: number;
  currentPage: number;
  limit: number;
  docs: Company[];
}

export interface ErrorResponse {
  type: ResponseType.Error,
  error: string;
}

export interface ServerResponse<Body> {
  type: ResponseType,
  data: Omit<Body, "type">,
}

export async function GET(
  request: NextRequest, 
  { params }: { params: { query: string } }
): Promise<NextResponse<ServerResponse<CompanyResponse | ErrorResponse>>> {
  try {
    let searchParams = request.nextUrl.searchParams ?? {};
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));

    if (limit < 1 || page < 1 || !params.query || params.query.length > 50) {
      throw new VeytError(400, "Incorect parameters");
    }

    let companies: Company[];
    let status = 200;

    if (cache.has(params.query)) {
      companies = cache.get(params.query) || [];
    } else {
      const companyRes = await fetch(`${apiUrl}?query=${params.query}&apikey=${env.apiKey}`);
      const parsedData = await companyRes.json();

      if (!companyRes.ok || !parsedData) {
        throw new VeytError(companyRes.status, parsedData?.["Error Message"] || defaultError)
      }

      status = companyRes.status;
      companies = parsedData;
      cache.set(params.query, parsedData);
    }

    return NextResponse.json({ 
      type: ResponseType.Success,
      data: {
        totalPages: Math.ceil(companies.length / limit),
        currentPage: page,
        limit: limit,
        docs: paginateResult(companies, page, limit),
      }
    }, { status });
  } catch (e: unknown) {
    const error = e instanceof VeytError ? e.message : defaultError;
    const status = e instanceof VeytError ? e.code : defaultErrorCode
    
    return NextResponse.json({ type: ResponseType.Error, data: { error } }, { status });
  }
}

function paginateResult<T>(array: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return array.slice(startIndex, endIndex);
}