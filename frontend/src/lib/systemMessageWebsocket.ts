import React, { useEffect, useRef, useCallback } from "react";
import AuthService from "./authService";

interface SystemMessage {
  id: string;
  recipient_id: string;
  title?: string;
  message: string;
  messageType: "info" | "warning" | "error" | "success";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface UseSystemMessageWebSocketReturn {
  sendMessage: (message: string) => void;
  isConnected: boolean;
}

const useSystemMessageWebSocket = (
  onMessage?: (message: SystemMessage) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (event: Event) => void
): UseSystemMessageWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectingRef = useRef(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const connect = useCallback(() => {
    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isConnectingRef.current = true;

    // Get the current host and protocol
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname;

    // For development, try different ports and paths
    const possibleConfigs = [
      { port: 8000, path: "/ws/test/" }, // Use test endpoint that doesn't require auth
      { port: 8000, path: "/ws/system_messages/" },
      { port: 8001, path: "/ws/system_messages/" },
      { port: 3001, path: "/ws/system_messages/" },
      { port: 3000, path: "/ws/system_messages/" },
    ];

    const config = possibleConfigs[0]; // Prioritize port 8000 for WebSocket (where Daphne is running)
    if (!config) return; // Safety check

    const wsUrl = `${protocol}//${host}:${config.port}${config.path}`;

    // Check if user is authenticated using AuthService
    const isAuthenticated = AuthService.isAuthenticated();
    
    // Get the actual JWT token if user is authenticated
    const token = isAuthenticated ? AuthService.getToken() : null;
    const finalWsUrl = token ? `${wsUrl}?token=${token}` : wsUrl;

    try {
      const ws = new WebSocket(finalWsUrl);
      wsRef.current = ws;

      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          isConnectingRef.current = false;
        }
      }, 5000); // 5 second timeout

      ws.onopen = () => {
        // Only proceed if component is still mounted
        if (!isMountedRef.current) {
          ws.close();
          return;
        }

        clearTimeout(connectionTimeout);
        isConnectingRef.current = false;
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "system_message") {
            // Map backend snake_case to frontend camelCase
            const systemMessage: SystemMessage = {
              id: data.message.id,
              recipient_id: data.message.recipient_id,
              title: data.message.title,
              message: data.message.message,
              messageType: data.message.message_type,
              link: data.message.link,
              isRead: data.message.is_read,
              createdAt: data.message.created_at,
            };
            onMessage?.(systemMessage);
          }
        } catch (error) {
          console.warn("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        isConnectingRef.current = false;

        onClose?.();

        // Only attempt to reconnect if component is still mounted and not manually closed
        if (
          event.code !== 1000 &&
          !reconnectTimeoutRef.current &&
          isMountedRef.current
        ) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              connect();
            }
          }, 10000); // Wait 10 seconds before reconnecting
        }
      };

      ws.onerror = (event) => {
        clearTimeout(connectionTimeout);
        isConnectingRef.current = false;
        onError?.(event);
      };
    } catch (error) {
      isConnectingRef.current = false;

      // Attempt to reconnect after a delay
      if (!reconnectTimeoutRef.current && isMountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            connect();
          }
        }, 10000);
      }
    }
  }, [onMessage, onOpen, onClose, onError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message }));
    }
  }, []);

  useEffect(() => {
    // Temporarily disable WebSocket connection since Django development server doesn't support WebSockets
    // TODO: Enable when using Daphne (ASGI server) for WebSocket support
    const shouldConnect = false; // Disabled until ASGI server is configured

    if (shouldConnect && isMountedRef.current) {
      // Small delay to prevent rapid connection attempts during React dev mode
      const connectTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          connect();
        }
      }, 100);

      return () => clearTimeout(connectTimeout);
    }

    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
};

export default useSystemMessageWebSocket;
