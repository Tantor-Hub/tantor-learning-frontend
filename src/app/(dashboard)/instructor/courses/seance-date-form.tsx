"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SeanceDateFormProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  duration: string;
  onDurationChange: (duration: string) => void;
}

export function SeanceDateForm({
  date,
  onDateChange,
  duration,
  onDurationChange,
}: SeanceDateFormProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal">
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                onDateChange(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Durée
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
