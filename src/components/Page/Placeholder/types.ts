import { ReactNode } from "react";

export type PlaceholderType = "home" | "user" | "client";

export interface PlaceholderConfig {
  icon: ReactNode;
  text: string;
  subText?: string;
}

export interface Props {
  type: PlaceholderType;
  textOverride?: string;
}
