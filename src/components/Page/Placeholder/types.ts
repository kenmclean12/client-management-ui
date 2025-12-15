import { ReactNode } from "react";

export type PlaceholderType = "user" | "client";

export interface PlaceholderConfig {
  icon: ReactNode;
  text: string;
}

export interface Props {
  type: PlaceholderType;
  textOverride?: string;
}