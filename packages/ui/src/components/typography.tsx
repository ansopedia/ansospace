import * as React from "react";

import { cn } from "@ansospace/ui/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const typographyVariants = cva("text-foreground leading-[130%]", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-bold lg:text-5xl",
      h2: "scroll-m-20 pb-2 text-3xl font-semibold first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold",
      h4: "scroll-m-20 text-xl font-semibold",
      h5: "scroll-m-20 text-lg font-semibold",
      h6: "scroll-m-20 text-base font-semibold",
      p: "leading-7",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      largeText: "text-lg font-semibold",
      smallText: "text-sm leading-none",
      mutedText: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type VariantPropType = VariantProps<typeof typographyVariants>;

const variantElementMap: Record<NonNullable<VariantPropType["variant"]>, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  blockquote: "blockquote",
  inlineCode: "code",
  largeText: "div",
  smallText: "small",
  lead: "p",
  mutedText: "span",
  ul: "ul",
};

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  variant?: keyof typeof variantElementMap;
}

const Typography = ({ className, variant = "p", as, ...props }: TypographyProps) => {
  const Comp = as ?? variantElementMap[variant];
  return <Comp className={cn(typographyVariants({ variant, className }))} {...props} />;
};

Typography.displayName = "Typography";

export { Typography, typographyVariants };
