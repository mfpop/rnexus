import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Call, CallType, CallUser, CallControlsState, WebRTCConnection } from '../types/CallTypes';

interface CallContextType {
  // Current call state
  currentCall: Call | null;
  callControls: CallControlsState;
  webrtcConnection: WebRTCConnection;

  // Call actions
  startCall: (receiver: CallUser, type: CallType) => Promise<void>;
  endCall: () => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => Promise<void>;

  // Demo functions for testing
  simulateIncomingCall: (caller: CallUser, type: CallType) => void;

  // Call controls
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;

  // Call status
  isCallActive: boolean;
  callDuration: number;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

// WebRTC Configuration
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callControls, setCallControls] = useState<CallControlsState>({
    muted: false,
    videoEnabled: false,
    screenSharing: false,
    recording: false,
  });
  const [webrtcConnection, setWebRTCConnection] = useState<WebRTCConnection>({
    isConnected: false,
  });
  const [callDuration, setCallDuration] = useState(0);

  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize WebRTC connection
  const initializeWebRTC = useCallback(async (isVideoCall: boolean = false) => {
    try {
      // Get user media
      const constraints = {
        audio: true,
        video: isVideoCall,
      };

      const localStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Create peer connection
      const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      // Add local stream to peer connection
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setWebRTCConnection(prev => ({ ...prev, remoteStream }));

        if (remoteVideoRef.current && remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to remote peer via signaling server
          console.log('ICE Candidate:', event.candidate);
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection State:', peerConnection.connectionState);
        setWebRTCConnection(prev => ({
          ...prev,
          isConnected: peerConnection.connectionState === 'connected'
        }));
      };

      setWebRTCConnection({
        localStream,
        peerConnection,
        isConnected: false,
      });

      // Set local video
      if (localVideoRef.current && isVideoCall) {
        localVideoRef.current.srcObject = localStream;
      }

      return { localStream, peerConnection };
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  }, []);

  // Start a call
  const startCall = useCallback(async (receiver: CallUser, type: CallType) => {
    try {
      const callId = `call-${Date.now()}`;
      const isVideoCall = type === 'video';

      // Initialize WebRTC
      await initializeWebRTC(isVideoCall);

      const newCall: Call = {
        id: callId,
        type,
        status: 'calling',
        caller: {
          id: 'current-user', // Should come from auth context
          name: 'You',
        },
        receiver,
        participants: [],
        isIncoming: false,
        startTime: new Date(),
      };

      setCurrentCall(newCall);
      setCallControls({
        muted: false,
        videoEnabled: isVideoCall,
        screenSharing: false,
        recording: false,
      });

      // Here you would send the call invitation via WebSocket/Socket.IO
      console.log(`Starting ${type} call to ${receiver.name}...`);

      // Simulate call being answered after 3 seconds for demo
      setTimeout(() => {
        setCurrentCall(prev => prev ? { ...prev, status: 'connected' } : null);
        startCallDurationTimer();
      }, 3000);

    } catch (error) {
      console.error('Error starting call:', error);
      alert('Failed to start call. Please check your camera/microphone permissions.');
    }
  }, [initializeWebRTC]);

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    if (!currentCall || currentCall.status !== 'ringing') return;

    try {
      await initializeWebRTC(currentCall.type === 'video');

      setCurrentCall(prev => prev ? {
        ...prev,
        status: 'connected',
        startTime: new Date()
      } : null);

      startCallDurationTimer();
    } catch (error) {
      console.error('Error accepting call:', error);
      await endCall();
    }
  }, [currentCall, initializeWebRTC]);

  // Decline call
  const declineCall = useCallback(async () => {
    if (!currentCall) return;

    setCurrentCall(prev => prev ? {
      ...prev,
      status: 'declined',
      endTime: new Date()
    } : null);

    // Clean up after a short delay
    setTimeout(() => {
      setCurrentCall(null);
    }, 1000);
  }, [currentCall]);

  // End call
  const endCall = useCallback(async () => {
    if (!currentCall) return;

    // Stop duration timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Clean up WebRTC connection
    if (webrtcConnection.localStream) {
      webrtcConnection.localStream.getTracks().forEach(track => track.stop());
    }

    if (webrtcConnection.peerConnection) {
      webrtcConnection.peerConnection.close();
    }

    setCurrentCall(prev => prev ? {
      ...prev,
      status: 'ended',
      endTime: new Date()
    } : null);

    setWebRTCConnection({ isConnected: false });
    setCallDuration(0);

    // Clean up after a short delay
    setTimeout(() => {
      setCurrentCall(null);
    }, 1500);
  }, [currentCall, webrtcConnection]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (webrtcConnection.localStream) {
      const audioTrack = webrtcConnection.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallControls(prev => ({ ...prev, muted: !audioTrack.enabled }));
      }
    }
  }, [webrtcConnection.localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (webrtcConnection.localStream) {
      const videoTrack = webrtcConnection.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallControls(prev => ({ ...prev, videoEnabled: videoTrack.enabled }));
      }
    }
  }, [webrtcConnection.localStream]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!callControls.screenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        // Replace video track with screen share
        if (webrtcConnection.peerConnection) {
          const videoSender = webrtcConnection.peerConnection.getSenders()
            .find(sender => sender.track?.kind === 'video');

          const screenVideoTrack = screenStream.getVideoTracks()[0];
          if (videoSender && screenVideoTrack) {
            await videoSender.replaceTrack(screenVideoTrack);
          }
        }

        setCallControls(prev => ({ ...prev, screenSharing: true }));

        // Handle screen share end
        const screenVideoTrack = screenStream.getVideoTracks()[0];
        if (screenVideoTrack) {
          screenVideoTrack.onended = () => {
            setCallControls(prev => ({ ...prev, screenSharing: false }));
            // Restore camera if video was enabled
            if (callControls.videoEnabled && webrtcConnection.localStream) {
              const videoTrack = webrtcConnection.localStream.getVideoTracks()[0];
              if (videoTrack && webrtcConnection.peerConnection) {
                const videoSender = webrtcConnection.peerConnection.getSenders()
                  .find(sender => sender.track?.kind === 'video');
                if (videoSender) {
                  videoSender.replaceTrack(videoTrack);
                }
              }
            }
          };
        }
      } else {
        // Stop screen sharing
        if (webrtcConnection.localStream && webrtcConnection.peerConnection) {
          const videoTrack = webrtcConnection.localStream.getVideoTracks()[0];
          const videoSender = webrtcConnection.peerConnection.getSenders()
            .find(sender => sender.track?.kind === 'video');

          if (videoSender && videoTrack) {
            await videoSender.replaceTrack(videoTrack);
          }
        }
        setCallControls(prev => ({ ...prev, screenSharing: false }));
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  }, [callControls.screenSharing, callControls.videoEnabled, webrtcConnection]);

  // Simulate incoming call for testing
  const simulateIncomingCall = useCallback((caller: CallUser, type: CallType) => {
    const callId = `incoming-call-${Date.now()}`;

    const incomingCall: Call = {
      id: callId,
      type,
      status: 'ringing',
      caller,
      receiver: {
        id: 'current-user',
        name: 'You',
      },
      participants: [],
      isIncoming: true,
    };

    setCurrentCall(incomingCall);
  }, []);

  // Start call duration timer
  const startCallDurationTimer = useCallback(() => {
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (webrtcConnection.localStream) {
        webrtcConnection.localStream.getTracks().forEach(track => track.stop());
      }
      if (webrtcConnection.peerConnection) {
        webrtcConnection.peerConnection.close();
      }
    };
  }, [webrtcConnection]);

  const isCallActive = currentCall?.status === 'connected';

  const value: CallContextType = {
    currentCall,
    callControls,
    webrtcConnection,
    startCall,
    endCall,
    acceptCall,
    declineCall,
    simulateIncomingCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    isCallActive,
    callDuration,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = (): CallContextType => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
