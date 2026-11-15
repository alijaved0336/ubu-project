import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: [
    "tw-rounded-lg tw-py-5 tw-px-6 tw-border active:tw-shadow-inner tw-shadow-btn tw-flex tw-justify-center tw-items-center tw-whitespace-normal tw-font-manrope tw-font-semibold tw-text-base",
  ],
  variants: {
    type: {
      primary: "",
      // secondary: "!tw-bg-white !tw-text-black !tw-border-black",
      none: "",
    },
    variant: {
      outlined:
        "tw-bg-white tw-text-gray-button-outlined tw-border-gray-button-outlined hover:!tw-border-black hover:tw-text-black",
      solid: "hover:!tw-bg-white hover:!tw-text-black hover:!tw-border-black",
    },
    // size: {
    //   default: "h-10 px-4 py-2",
    //   sm: "h-9 px-3",
    //   lg: "h-11 px-8",
    //   icon: "h-10 w-10",
    // },
  },
  defaultVariants: {
    variant: "solid",
    type: "primary",

    // size: "default",
  },
});
