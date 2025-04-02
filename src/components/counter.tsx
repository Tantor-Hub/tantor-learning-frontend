'use client';

import useExample from '@/hooks/use-example';
import { Button } from '@/components/ui/button';

export default function Counter() {
  const { value, increment, decrement } = useExample();

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Counter: {value}</h2>
      <div className="flex gap-2">
        <Button onClick={decrement} variant="outline">
          -
        </Button>
        <Button onClick={increment} variant="default">
          +
        </Button>
      </div>
    </div>
  );
}
