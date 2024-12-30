import * as React from 'react';
import { FaSpinner } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

const Spinner = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      >
        <FaSpinner />
      </div>
    );
  },
);
Spinner.displayName = 'Spinner';

export { Spinner };
