"use client";
import { useTimer } from '@/hooks/useTimer';

export default function Timer({ initialSeconds }: { initialSeconds: number }) {
  const seconds = useTimer(initialSeconds);
  return <span>{seconds}</span>;
}