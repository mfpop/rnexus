/**
 * Format call duration in seconds to MM:SS format
 */
export const formatCallDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format call duration for display (e.g., "2m 30s" or "1h 15m")
 */
export const formatCallDurationLong = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Get call status display text
 */
export const getCallStatusText = (status: string): string => {
  switch (status) {
    case 'calling':
      return 'Calling...';
    case 'ringing':
      return 'Incoming call';
    case 'connected':
      return 'Connected';
    case 'ended':
      return 'Call ended';
    case 'declined':
      return 'Call declined';
    case 'busy':
      return 'Busy';
    default:
      return status;
  }
};
