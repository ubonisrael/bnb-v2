/**
 * Converts minutes from midnight to a time string in "HH:MM" format
 * @param minutesFromMidnight - Number of minutes from midnight (0-1439)
 * @returns Time string in "HH:MM" format
 */
export function minutesToTimeString(minutesFromMidnight: number): string {
    // Ensure the input is within valid range (0-1439)
    const validMinutes = Math.max(0, Math.min(1439, minutesFromMidnight));

    // Calculate hours and minutes
    const hours = Math.floor(validMinutes / 60);
    const minutes = validMinutes % 60;

    // Format the time string with leading zeros
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Converts a time string in "HH:MM" format to minutes from midnight
 * @param timeString - Time string in "HH:MM" format
 * @returns Number of minutes from midnight (0-1439)
 */
export function timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
} 