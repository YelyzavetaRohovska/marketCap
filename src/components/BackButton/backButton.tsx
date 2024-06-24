"use client"

import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <Button onClick={goBack}>Go Back</Button>
  );
}

