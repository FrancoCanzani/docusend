'use client';

import * as React from 'react';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    setDate(newDate);
  };

  return (
    <input
      type='date'
      value={date ? date.toISOString().split('T')[0] : ''}
      onChange={handleChange}
      className={className}
    />
  );
}
