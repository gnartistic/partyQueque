import { atom } from "jotai";

export interface ProcessedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

export const queueAtom = atom<ProcessedTrack[]>([]);