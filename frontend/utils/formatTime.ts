export const formatSecondsToHourMinute = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}`;

    return formattedTime;
};
