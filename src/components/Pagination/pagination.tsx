"use client"

import { usePathname, useSearchParams, useRouter} from 'next/navigation';
import Button from '../UI/Button';
import { useEffect } from 'react';

import styles from "./pagination.module.css";

interface PaginationProps { 
  currentPage: number;
  totalPages: number;
  limit: number;
}

const limitOptions = [1, 5, 10, 15];
 
export const Pagination = ({ currentPage, totalPages, limit }: PaginationProps ) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const updateLimit = (val: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", val.toString());
    
    replace(`${pathname}?${params.toString()}`);
  };

  const updateCurrentPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", (newPage).toString());
    
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!limitOptions.includes(limit)) {
      updateLimit(5);
    }

    if (currentPage < 1) {
      updateCurrentPage(1);
    }
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectBlock}>
        <label htmlFor="itemsPerPage" className={styles.label}>Items per page:</label>
        <select 
          id="itemsPerPage"
          className={styles.select}
          value={limit ?? 5}
          onChange={e => updateLimit(Number(e.target.value))}
        >
          { limitOptions.map(value => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <div>
        <Button 
          disabled={currentPage == 1} 
          onClick={() => updateCurrentPage(currentPage - 1)}
        >Prev</Button>
        <span className={styles.pagesInfo}>{currentPage} of {totalPages}</span>
        <Button 
          disabled={currentPage == totalPages} 
          onClick={() => updateCurrentPage(currentPage + 1)}
        >Next</Button>
      </div>
    </div>
  )
}