import { ActivityExtended } from "../components/activities/ActivitiesContext";

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  data?: any;
  [key: string]: any;
}

// WebSocket event handlers
export interface WebSocketHandlers {
  onActivityUpdated?: (activity: ActivityExtended) => void;
  onTaskUpdated?: (task: any, activityId: string) => void;
  onMilestoneUpdated?: (milestone: any, activityId: string) => void;
  onChecklistUpdated?: (checklist: any, activityId: string) => void;
  onCommentAdded?: (comment: any, activityId: string) => void;
  onTimeLogUpdated?: (timeLog: any, activityId: string) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: string) => void;
}

// WebSocket service class
export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: WebSocketHandlers;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private subscribedActivities = new Set<string>();

  constructor(url: string, handlers: WebSocketHandlers) {
    this.url = url;
    this.handlers = handlers;
  }

  // Connect to WebSocket
  async connect(): Promise<void> {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.debug("WebSocket connected");
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Resubscribe to previously subscribed activities
        this.subscribedActivities.forEach((activityId) => {
          this.subscribeToActivity(activityId);
        });

        this.handlers.onConnected?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.debug("WebSocket disconnected:", event.code, event.reason);
        this.isConnecting = false;
        this.handlers.onDisconnected?.();

        // Attempt to reconnect if not a clean close
        if (
          event.code !== 1000 &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.handlers.onError?.("WebSocket connection error");
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      this.isConnecting = false;
      this.handlers.onError?.("Failed to create WebSocket connection");
    }
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, "User initiated disconnect");
      this.ws = null;
    }
    this.subscribedActivities.clear();
  }

  // Subscribe to activity updates
  subscribeToActivity(activityId: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, cannot subscribe to activity");
      return;
    }

    const message: WebSocketMessage = {
      type: "subscribe_activity",
      data: { activity_id: activityId },
    };

    this.ws.send(JSON.stringify(message));
    this.subscribedActivities.add(activityId);
  }

  // Unsubscribe from activity updates
  unsubscribeFromActivity(activityId: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: WebSocketMessage = {
      type: "unsubscribe_activity",
      data: { activity_id: activityId },
    };

    this.ws.send(JSON.stringify(message));
    this.subscribedActivities.delete(activityId);
  }

  // Handle incoming WebSocket messages
  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "subscription_confirmed":
        console.debug("Subscribed to activity:", message["activity_id"]);
        break;

      case "activity_updated":
        if (this.handlers.onActivityUpdated) {
          this.handlers.onActivityUpdated(message["activity"]);
        }
        break;

      case "task_updated":
        if (this.handlers.onTaskUpdated) {
          this.handlers.onTaskUpdated(message["task"], message["activity_id"]);
        }
        break;

      case "milestone_updated":
        if (this.handlers.onMilestoneUpdated) {
          this.handlers.onMilestoneUpdated(
            message["milestone"],
            message["activity_id"],
          );
        }
        break;

      case "checklist_updated":
        if (this.handlers.onChecklistUpdated) {
          this.handlers.onChecklistUpdated(
            message["checklist"],
            message["activity_id"],
          );
        }
        break;

      case "comment_added":
        if (this.handlers.onCommentAdded) {
          this.handlers.onCommentAdded(
            message["comment"],
            message["activity_id"],
          );
        }
        break;

      case "time_log_updated":
        if (this.handlers.onTimeLogUpdated) {
          this.handlers.onTimeLogUpdated(
            message["time_log"],
            message["activity_id"],
          );
        }
        break;

      default:
        console.debug("Unknown WebSocket message type:", message.type);
    }
  }

  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.debug(
      `Scheduling WebSocket reconnection attempt ${this.reconnectAttempts} in ${delay}ms`,
    );

    setTimeout(() => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.connect();
      } else {
        console.error("Max WebSocket reconnection attempts reached");
        this.handlers.onError?.("Failed to reconnect after maximum attempts");
      }
    }, delay);
  }

  // Check connection status
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Get connection state
  getConnectionState(): string {
    if (!this.ws) return "disconnected";

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "unknown";
    }
  }

  // Send custom message
  sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }
}

// Create and export singleton instance
const WS_BASE_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/activities/";

export const websocketService = new WebSocketService(WS_BASE_URL, {});

// Export the class for custom instances
export default WebSocketService;
