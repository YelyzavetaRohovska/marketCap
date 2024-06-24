"use client"

import { InputHTMLAttributes, useState } from "react";

const inputLengthLimit = 40;

export const Input = ({
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {

  return (
    <div className="flex w-full py-2">
      <input 
        className="block w-full px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-700"
        maxLength={props.maxLength || inputLengthLimit}
        {...props}
      />
    </div>
  );
};