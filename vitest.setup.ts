import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children?: React.ReactNode;
    href: string | { pathname?: string };
  }) =>
    React.createElement(
      "a",
      {
        href: typeof href === "string" ? href : (href.pathname ?? ""),
        ...props,
      },
      children,
    ),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    src: string | { src?: string };
  }) => {
    void fill;
    void priority;

    return React.createElement("img", {
      src: typeof src === "string" ? src : (src.src ?? ""),
      alt,
      ...props,
    });
  },
}));
