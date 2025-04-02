import { useAppDispatch, useAppSelector } from '@/store/store';
import { increment, decrement } from '@/features/example-slice';

export default function useExample() {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.example.value);

  return {
    value,
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
  };
}
