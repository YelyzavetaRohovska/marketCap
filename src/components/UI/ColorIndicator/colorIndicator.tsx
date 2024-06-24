import clsx from "clsx";
import { PropsWithChildren } from "react";

export enum EIndicatorColor {
  Default = "default",
  Success = "success",
  Warning = "warning",
  Danger  = "danger",
}

interface IndicatorProps extends PropsWithChildren {
  state: EIndicatorColor;
}

export const ColorIndicator = ({
  state,
  children,
}: IndicatorProps) => {
  const classes = clsx(
    "inline-block align-sub mx-1 rounded rounded-xl px-2 py-1",
    state == EIndicatorColor.Default && "bg-stone-600",
    state == EIndicatorColor.Danger && "bg-red-600",
    state == EIndicatorColor.Warning && "bg-yellow-600",
    state == EIndicatorColor.Success && "bg-green-600",
  );

  return (
    <span className={classes}>{children}</span>
  );
};