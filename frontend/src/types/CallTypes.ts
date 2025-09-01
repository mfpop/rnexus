export interface CallUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface CallParticipant extends CallUser {
  stream?: MediaStream;
  muted: boolean;
  videoEnabled: boolean;
  isLocal?: boolean;
}

export type CallType = 'voice' | 'video';
export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'declined' | 'busy';

export interface Call {
  id: string;
  type: CallType;
  status: CallStatus;
  caller: CallUser;
  receiver: CallUser;
  participants: CallParticipant[];
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  isIncoming: boolean;
}

export interface CallControlsState {
  muted: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  recording: boolean;
}

export interface WebRTCConnection {
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  peerConnection?: RTCPeerConnection;
  isConnected: boolean;
}
