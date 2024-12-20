"use client";
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/clientApp';
import { Room } from '../firebase/types';

export function useRoomState(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
      if (snapshot.exists()) {
        setRoom(snapshot.data() as Room);
      }
    });
    return unsub;
  }, [roomId]);

  return room;
}