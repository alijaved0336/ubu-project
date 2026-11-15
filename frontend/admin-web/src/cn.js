import { extendTailwindMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const customTwMerge = extendTailwindMerge({
    prefix: 'tw-', 
});
  
const cn = (...input) => customTwMerge(clsx(input));
export default cn;
