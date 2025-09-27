"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fr } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <div className="rounded-md flex-[2] border shadow-md flex flex-col gap-5 p-5">
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={fr}
        className={cn(className)}
        classNames={{
          months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-[#0466C8] text-base md:text-xl",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md flex-[1] font-normal text-[0.8rem]",
          row: "flex w-full gap-1.5 pb-1.5",
          cell: cn(
            "relative aspect-square flex-[1] rounded-[8px] border border-[#ACACAC] text-right shadow-sm text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#D4DFFF] [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "font-normal text-[8px] sm:text-sm md:text-base h-full w-full justify-end items-start bg-transparent] aria-selected:bg-transparent aria-selected:text-black p-1 md:p-2"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-[#D4DFFF] hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === "left") {
              return <ChevronLeft className={cn("h-5 w-5 text-[#0466C8]", className)} {...props} />;
            }
            if (orientation === "right") {
              return (
                <ChevronRight className={cn("h-5 w-5 text-[#0466C8]", className)} {...props} />
              );
            }
            return <ChevronLeft className={cn("h-5 w-5 text-[#0466C8]", className)} {...props} />;
          },
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
