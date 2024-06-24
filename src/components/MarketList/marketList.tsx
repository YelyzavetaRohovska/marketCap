import React from "react";

import { env } from "@/app/env.example";

import { CompanyResponse, ResponseType } from "@/app/api/stock/search/[query]/route";

import Search from "../Search";
import StockTable from "../StockTable";
import Pagination from "../Pagination";
import Toast from "../Toast";

interface MarketListProps {
  query?: string;
  page?: string;
  limit?: string;
}

export async function MarketList({
  query = "",
  page, 
  limit,
}: MarketListProps) {
  let error = "";
  let result: CompanyResponse = {
    type: ResponseType.Success,
    docs: [],
    limit: 5,
    totalPages: 1,
    currentPage: 1,
  };

  if (query) {
    const res = await fetch(
      `${env.baseUrl}/stock/search/${query}?page=${page}&limit=${limit}`, 
      { cache: "no-store" }
    );
    
    let parsedData = await res.json();
    if (res.ok && parsedData && parsedData.type == ResponseType.Success && parsedData.data) {
      result = parsedData.data;
    } else {
      error = parsedData?.data?.error;
    }
  }

  return (
    <div className="w-full">
      <Search />
      <StockTable items={result.docs}/>
      <Pagination currentPage={result.currentPage} limit={result.limit} totalPages={result.totalPages}/>
      { error && <Toast message={error} />}
    </div>
  );
}