'use client';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/use-example';
import { increment, decrement } from '@/features/example-slice';

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Count: {count}</h2>
      <div className="flex gap-2">
        <Button onClick={() => dispatch(increment())}>Increment</Button>
        <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      </div>
    </div>
  );
}