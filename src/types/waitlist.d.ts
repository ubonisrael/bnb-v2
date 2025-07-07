type TimeSelectionMode = "single" | "multiple" | "range" | "all";

type SlotSelection = {
  date: string;
  mode: TimeSelectionMode;
  times?: number[];
  time?: number;
  range?: [number, number];
};

interface WaitListValues {
  email: string;
  name: string;
  phone: string;
  date: string;
  start_time: number;
  duration: number;
  service_ids: number[];
}

interface FlattenToDateTimePairsProps {
  email: string;
  name: string;
  phone: string;
  date: string;
  mode: string;
  duration: number;
  entries: number[];
  unavailableSlots: number[];
  service_ids: number[];
}
