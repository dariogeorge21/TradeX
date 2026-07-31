import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-xl bg-foreground/10 dark:bg-foreground/10",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer-slide_1.5s_infinite]",
        "before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
