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

type TimezoneType = {
    value: string;
    abbr: string;
    offset: number;
    isdst: boolean;
    text: string;
    utc: string[];
};

export const timezones = [
    "Dateline Standard Time",
    "UTC-11",
    "Hawaiian Standard Time",
    "Alaskan Standard Time",
    "Pacific Standard Time (Mexico)",
    "Pacific Daylight Time",
    "Pacific Standard Time",
    "US Mountain Standard Time",
    "Mountain Standard Time (Mexico)",
    "Mountain Standard Time",
    "Central America Standard Time",
    "Central Standard Time",
    "Central Standard Time (Mexico)",
    "Canada Central Standard Time",
    "SA Pacific Standard Time",
    "Eastern Standard Time",
    "Eastern Daylight Time",
    "US Eastern Standard Time",
    "Venezuela Standard Time",
    "Paraguay Standard Time",
    "Atlantic Standard Time",
    "Central Brazilian Standard Time",
    "SA Western Standard Time",
    "Pacific SA Standard Time",
    "Newfoundland Standard Time",
    "E. South America Standard Time",
    "Argentina Standard Time",
    "SA Eastern Standard Time",
    "Greenland Standard Time",
    "Montevideo Standard Time",
    "Bahia Standard Time",
    "UTC-02",
    "Mid-Atlantic Standard Time",
    "Azores Standard Time",
    "Cape Verde Standard Time",
    "Morocco Standard Time",
    "UTC",
    "GMT Standard Time",
    "British Summer Time",
    "Greenwich Standard Time",
    "W. Europe Standard Time",
    "Central Europe Standard Time",
    "Romance Standard Time",
    "Central European Standard Time",
    "W. Central Africa Standard Time",
    "Namibia Standard Time",
    "GTB Standard Time",
    "Middle East Standard Time",
    "Egypt Standard Time",
    "Syria Standard Time",
    "E. Europe Standard Time",
    "South Africa Standard Time",
    "FLE Standard Time",
    "Turkey Standard Time",
    "Israel Standard Time",
    "Libya Standard Time",
    "Jordan Standard Time",
    "Arabic Standard Time",
    "Kaliningrad Standard Time",
    "Arab Standard Time",
    "E. Africa Standard Time",
    "Moscow Standard Time",
    "Samara Time",
    "Iran Standard Time",
    "Arabian Standard Time",
    "Azerbaijan Standard Time",
    "Mauritius Standard Time",
    "Georgian Standard Time",
    "Caucasus Standard Time",
    "Afghanistan Standard Time",
    "West Asia Standard Time",
    "Yekaterinburg Time",
    "Pakistan Standard Time",
    "India Standard Time",
    "Sri Lanka Standard Time",
    "Nepal Standard Time",
    "Central Asia Standard Time",
    "Bangladesh Standard Time",
    "Myanmar Standard Time",
    "SE Asia Standard Time",
    "N. Central Asia Standard Time",
    "China Standard Time",
    "North Asia Standard Time",
    "Singapore Standard Time",
    "W. Australia Standard Time",
    "Taipei Standard Time",
    "Ulaanbaatar Standard Time",
    "North Asia East Standard Time",
    "Japan Standard Time",
    "Korea Standard Time",
    "Cen. Australia Standard Time",
    "AUS Central Standard Time",
    "E. Australia Standard Time",
    "AUS Eastern Standard Time",
    "West Pacific Standard Time",
    "Tasmania Standard Time",
    "Yakutsk Standard Time",
    "Central Pacific Standard Time",
    "Vladivostok Standard Time",
    "New Zealand Standard Time",
    "UTC+12",
    "Fiji Standard Time",
    "Magadan Standard Time",
    "Kamchatka Standard Time",
    "Tonga Standard Time",
    "Samoa Standard Time"
]