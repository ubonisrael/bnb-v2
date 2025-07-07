export function flattenToDateTimePairs({
  email,
  name,
  phone,
  date,
  duration,
  entries,
  service_ids,
  mode,
  unavailableSlots,
}: FlattenToDateTimePairsProps) {
  const result: WaitListValues[] = [];

  if (mode === "single" && entries.length) {
    result.push({ email, name, phone, date, start_time: entries[0], duration, service_ids });
  } else if (mode === "multiple" && entries.length) {
    for (const entry of entries) {
      result.push({ email, name, phone, date, start_time: entry, duration, service_ids });
    }
  } else if (mode === "range") {
    const [start, end] = entries.sort((a, b) => a - b);

    const inRange = unavailableSlots.filter(
      (time) => time >= start && time <= end
    );
    for (const time of inRange) {
      result.push({ email, name, phone, date, start_time: time, duration, service_ids });
    }
  } else {
    for (const time of unavailableSlots) {
      result.push({ email, name, phone, date, start_time: time, duration, service_ids });
    }
  }

  return result;
}
