// Dynamic import for Microsoft Teams SDK
let microsoftTeams: any = null;

// Function to load Teams SDK dynamically
const loadTeamsSDK = async () => {
  if (microsoftTeams) return microsoftTeams;

  try {
    console.log("TeamsService: Attempting to load Microsoft Teams SDK...");
    const teamsModule = await import("@microsoft/teams-js");
    microsoftTeams = teamsModule.default || teamsModule;
    console.log("TeamsService: Microsoft Teams SDK loaded successfully");
    return microsoftTeams;
  } catch (error) {
    console.log(
      "TeamsService: Microsoft Teams SDK not available - running in standalone mode",
    );
    return null;
  }
};

export interface TeamsMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  participants: string[];
  status: "scheduled" | "ongoing" | "completed";
  joinUrl?: string;
  meetingId?: string;
}

export interface TeamsChannel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastActivity: string;
  webUrl?: string;
}

export interface TeamsChat {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

class TeamsService {
  private isInitialized = false;
  private teamsContext: any = null;

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        console.log("TeamsService: Already initialized");
        return true;
      }

      console.log("TeamsService: Starting initialization...");

      // Try to load Teams SDK dynamically
      const teamsSDK = await loadTeamsSDK();

      if (!teamsSDK) {
        console.log(
          "TeamsService: Microsoft Teams SDK not available - running in standalone mode",
        );
        this.isInitialized = true;
        return true;
      }

      // Try to initialize Microsoft Teams
      try {
        console.log(
          "TeamsService: Attempting to initialize Microsoft Teams...",
        );
        await teamsSDK.initialize();

        // Get the current context
        try {
          this.teamsContext = await teamsSDK.getContext();
          console.log(
            "TeamsService: Microsoft Teams initialized successfully with context",
          );
        } catch (contextError) {
          console.log(
            "TeamsService: Could not get Teams context, but SDK initialized:",
            contextError instanceof Error
              ? contextError.message
              : String(contextError),
          );
          this.teamsContext = null;
        }

        this.isInitialized = true;
        return true;
      } catch (teamsError) {
        console.log(
          "TeamsService: Not in Teams environment - running in standalone mode:",
          teamsError instanceof Error ? teamsError.message : String(teamsError),
        );
        this.isInitialized = true;
        return true;
      }
    } catch (error) {
      console.error("TeamsService: Failed to initialize Teams service:", error);
      // Still mark as initialized to prevent repeated attempts
      this.isInitialized = true;
      return true;
    }
  }

  async getMeetings(): Promise<TeamsMeeting[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("TeamsService: Getting meetings...");

      // In a real implementation, this would call the Microsoft Graph API
      // For now, we'll return mock data that simulates Teams meetings
      const mockMeetings: TeamsMeeting[] = [
        {
          id: "1",
          title: "Weekly Team Standup",
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
          participants: ["John Doe", "Jane Smith", "Mike Johnson"],
          status: "scheduled",
          joinUrl:
            'https://teams.microsoft.com/l/meetup-join/19:meeting_123456789@thread.v2/0?context={"Tid":"12345678-1234-1234-1234-123456789012","Oid":"87654321-4321-4321-4321-210987654321"}',
          meetingId: "123456789",
        },
        {
          id: "2",
          title: "Project Review Meeting",
          startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
          endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          participants: [
            "John Doe",
            "Jane Smith",
            "Mike Johnson",
            "Sarah Wilson",
          ],
          status: "scheduled",
          joinUrl:
            'https://teams.microsoft.com/l/meetup-join/19:meeting_987654321@thread.v2/0?context={"Tid":"12345678-1234-1234-1234-123456789012","Oid":"87654321-4321-4321-4321-210987654321"}',
          meetingId: "987654321",
        },
        {
          id: "3",
          title: "Client Presentation",
          startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          endTime: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
          participants: ["John Doe", "Client A", "Client B"],
          status: "completed",
          joinUrl:
            'https://teams.microsoft.com/l/meetup-join/19:meeting_456789123@thread.v2/0?context={"Tid":"12345678-1234-1234-1234-123456789012","Oid":"87654321-4321-4321-4321-210987654321"}',
          meetingId: "456789123",
        },
      ];

      console.log(
        "TeamsService: Returning mock meetings:",
        mockMeetings.length,
      );
      return mockMeetings;
    } catch (error) {
      console.error("TeamsService: Failed to get meetings:", error);
      return [];
    }
  }

  async getChannels(): Promise<TeamsChannel[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("TeamsService: Getting channels...");

      // In a real implementation, this would call the Microsoft Graph API
      const mockChannels: TeamsChannel[] = [
        {
          id: "1",
          name: "General",
          description: "Company-wide announcements and updates",
          memberCount: 45,
          lastActivity: "2 hours ago",
          webUrl: "https://teams.microsoft.com/l/channel/general",
        },
        {
          id: "2",
          name: "Development",
          description: "Development team discussions and updates",
          memberCount: 12,
          lastActivity: "1 hour ago",
          webUrl: "https://teams.microsoft.com/l/channel/development",
        },
        {
          id: "3",
          name: "Marketing",
          description: "Marketing team collaboration",
          memberCount: 8,
          lastActivity: "30 minutes ago",
          webUrl: "https://teams.microsoft.com/l/channel/marketing",
        },
        {
          id: "4",
          name: "Sales",
          description: "Sales team updates and leads",
          memberCount: 15,
          lastActivity: "15 minutes ago",
          webUrl: "https://teams.microsoft.com/l/channel/sales",
        },
      ];

      console.log(
        "TeamsService: Returning mock channels:",
        mockChannels.length,
      );
      return mockChannels;
    } catch (error) {
      console.error("TeamsService: Failed to get channels:", error);
      return [];
    }
  }

  async getChats(): Promise<TeamsChat[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("TeamsService: Getting chats...");

      // In a real implementation, this would call the Microsoft Graph API
      const mockChats: TeamsChat[] = [
        {
          id: "1",
          name: "John Doe",
          participants: ["You", "John Doe"],
          lastMessage: "Can you review the latest PR?",
          lastMessageTime: "5 minutes ago",
          unreadCount: 1,
        },
        {
          id: "2",
          name: "Development Team",
          participants: ["You", "John Doe", "Jane Smith", "Mike Johnson"],
          lastMessage: "Great work on the new feature!",
          lastMessageTime: "1 hour ago",
          unreadCount: 0,
        },
        {
          id: "3",
          name: "Sarah Wilson",
          participants: ["You", "Sarah Wilson"],
          lastMessage: "Meeting scheduled for tomorrow",
          lastMessageTime: "2 hours ago",
          unreadCount: 0,
        },
      ];

      console.log("TeamsService: Returning mock chats:", mockChats.length);
      return mockChats;
    } catch (error) {
      console.error("TeamsService: Failed to get chats:", error);
      return [];
    }
  }

  async joinMeeting(meetingUrl: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("TeamsService: Joining meeting:", meetingUrl);

      // In a real Teams environment, this would open the meeting
      if (meetingUrl) {
        // Check if we're in Teams environment
        if (this.isTeamsEnvironment()) {
          // Use Teams API to join meeting
          console.log("TeamsService: Joining meeting via Teams API");
          // In a real implementation, you would call the Teams API here
          // For now, we'll simulate success
          return true;
        } else {
          // Fallback to opening URL in new tab
          console.log("TeamsService: Opening meeting URL in new tab");
          try {
            // Check if the URL is valid
            const url = new URL(meetingUrl);
            if (url.protocol === "http:" || url.protocol === "https:") {
              window.open(meetingUrl, "_blank");
              return true;
            } else {
              console.warn("TeamsService: Invalid URL protocol:", meetingUrl);
              return false;
            }
          } catch (urlError) {
            console.error(
              "TeamsService: Invalid URL format:",
              meetingUrl,
              urlError,
            );
            return false;
          }
        }
      }

      return false;
    } catch (error) {
      console.error("TeamsService: Failed to join meeting:", error);
      return false;
    }
  }

  async createMeeting(
    title: string,
    startTime: string,
    endTime: string,
    participants: string[],
  ): Promise<TeamsMeeting | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("TeamsService: Creating meeting:", title);

      // In a real implementation, this would call the Microsoft Graph API to create a meeting
      const newMeeting: TeamsMeeting = {
        id: Date.now().toString(),
        title,
        startTime,
        endTime,
        participants,
        status: "scheduled",
        joinUrl: `https://teams.microsoft.com/l/meetup-join/${Date.now()}`,
        meetingId: Date.now().toString(),
      };

      console.log("TeamsService: Meeting created:", newMeeting);
      return newMeeting;
    } catch (error) {
      console.error("TeamsService: Failed to create meeting:", error);
      return null;
    }
  }

  async openChannel(channelUrl: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("TeamsService: Opening channel:", channelUrl);

      if (channelUrl) {
        window.open(channelUrl, "_blank");
        return true;
      }

      return false;
    } catch (error) {
      console.error("TeamsService: Failed to open channel:", error);
      return false;
    }
  }

  async startChat(participants: string[]): Promise<TeamsChat | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("TeamsService: Starting chat with:", participants);

      // In a real implementation, this would call the Microsoft Graph API
      const newChat: TeamsChat = {
        id: Date.now().toString(),
        name: participants.join(", "),
        participants: ["You", ...participants],
        lastMessage: "Chat started",
        lastMessageTime: "Just now",
        unreadCount: 0,
      };

      console.log("TeamsService: Chat started:", newChat);
      return newChat;
    } catch (error) {
      console.error("TeamsService: Failed to start chat:", error);
      return null;
    }
  }

  async getTeamsContext(): Promise<any> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return this.teamsContext;
    } catch (error) {
      console.error("TeamsService: Failed to get Teams context:", error);
      return null;
    }
  }

  isTeamsEnvironment(): boolean {
    const result =
      this.isInitialized &&
      this.teamsContext !== null &&
      microsoftTeams !== null;
    console.log("TeamsService: Is Teams environment:", result, {
      isInitialized: this.isInitialized,
      hasContext: this.teamsContext !== null,
      hasSDK: microsoftTeams !== null,
    });
    return result;
  }
}

export const teamsService = new TeamsService();
export default teamsService;
