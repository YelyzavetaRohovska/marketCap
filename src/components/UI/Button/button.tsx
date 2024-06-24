"use client"

import clsx from "clsx";
import React, { ButtonHTMLAttributes, InputHTMLAttributes, useState } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, React.PropsWithChildren {}

export const Button = ({
  children,
  ...props
}: ButtonProps) => {
  const classes = clsx(
    props.className, 
    "bg-stone-900 border rounded-md border-stone-700 transition-transform p-2 hover:bg-stone-800 active:bg-stone-700 active:scale-95",
    props.disabled && "disabled:bg-stone-900 cursor-not-allowed opacity-75 active:scale-100"
  );

  return (
    <button
      {...props}
      className={classes}
    >
      {children}
    </button>
  );
};