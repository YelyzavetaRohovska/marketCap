"use client"

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import Input from "@/components/UI/Input";
import Button from '@/components/UI/Button';

import styles from "./search.module.css";

const maxLength = 50;
 
export const Search = () => {
  const [query, setQuery] = useState("");

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    let initQuery = (params.get("query") ?? "");

    if (initQuery.length > maxLength) {
      params.set('query', initQuery.slice(0, maxLength));
    }

    if (initQuery.length) {
      replace(`${pathname}?${params.toString()}`);
      setQuery(initQuery);
    }
  }, []);
 
  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  
    query ? params.set('query', query) : params.delete('query');  
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  return (
    <form className={styles.form}>
      <Input
        placeholder="Search by company name or symbol..."
        onChange={updateText}
        value={query}
        maxLength={maxLength}
      />
      <Button className={styles.button} onClick={handleSearch}>Search</Button>
    </form>
  )
}
