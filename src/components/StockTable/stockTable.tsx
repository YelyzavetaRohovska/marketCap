import { Company } from "@/app/api/stock/search/[query]/route";

import { Suspense } from "react";
import { PriceCellsGroup } from "./priceCellsGroup";

import styles from "./stockTable.module.css";
import Link from "next/link";

interface StockTableProps {
  items: Company[];
}

export async function StockTable({
  items,
}: StockTableProps) {
  if (!items.length) return (<div className="text-center">No items found :(</div>);

  return (
    <table className={styles.table}>
      <thead className={styles.header}>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Price</th>
          <th>Change</th>
          <th>Change %</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ symbol, name }) => (
          <tr key={symbol}>
            <td>{symbol}</td>
            <td>{name}</td>
            <Suspense key={symbol} fallback={<PriceCellsGroup symbol={symbol} skeleton={true}/>}>
              <PriceCellsGroup symbol={symbol}/>
            </Suspense>
          </tr>
        ))}
      </tbody>
    </table>
  );
}