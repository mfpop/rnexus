import React, { useEffect, useState } from 'react';
import teamsService, { TeamsMeeting, TeamsChannel, TeamsChat } from '../lib/teamsService';

const TeamsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<TeamsMeeting[]>([]);
  const [channels, setChannels] = useState<TeamsChannel[]>([]);
  const [chats, setChats] = useState<TeamsChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamsStatus, setTeamsStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'meetings' | 'channels' | 'chat'>('meetings');

  // Load Teams data on component mount
  useEffect(() => {
    const loadTeamsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('TeamsPage: Starting to load Teams data...');

        // Initialize Teams service
        const isInitialized = await teamsService.initialize();
        console.log('TeamsPage: Service initialized:', isInitialized);

        if (isInitialized) {
          // Check if we're actually in a Teams environment
          const isTeamsEnv = teamsService.isTeamsEnvironment();
          console.log('TeamsPage: Is Teams environment:', isTeamsEnv);

          if (isTeamsEnv) {
            setTeamsStatus('connected');
          } else {
            setTeamsStatus('disconnected');
          }

          // Load data in parallel with better error handling
          try {
            const [meetingsData, channelsData, chatsData] = await Promise.all([
              teamsService.getMeetings().catch(err => {
                console.error('Failed to get meetings:', err);
                return [];
              }),
              teamsService.getChannels().catch(err => {
                console.error('Failed to get channels:', err);
                return [];
              }),
              teamsService.getChats().catch(err => {
                console.error('Failed to get chats:', err);
                return [];
              })
            ]);

            console.log('TeamsPage: Data loaded:', { meetingsData, channelsData, chatsData });

            setMeetings(meetingsData || []);
            setChannels(channelsData || []);
            setChats(chatsData || []);
          } catch (dataError) {
            console.error('Failed to load data in parallel:', dataError);
            // Try loading individually
            try {
              const meetingsData = await teamsService.getMeetings();
              setMeetings(meetingsData || []);
            } catch (e) {
              console.error('Failed to get meetings individually:', e);
            }

            try {
              const channelsData = await teamsService.getChannels();
              setChannels(channelsData || []);
            } catch (e) {
              console.error('Failed to get channels individually:', e);
            }

            try {
              const chatsData = await teamsService.getChats();
              setChats(chatsData || []);
            } catch (e) {
              console.error('Failed to get chats individually:', e);
            }
          }
        } else {
          setTeamsStatus('disconnected');
          setError('Failed to initialize Teams service');
        }
      } catch (error) {
        console.error('TeamsPage: Failed to load Teams data:', error);
        setTeamsStatus('disconnected');
        setError(error instanceof Error ? error.message : 'Unknown error occurred');

        // Still try to load mock data for demonstration
        try {
          console.log('TeamsPage: Attempting to load fallback data...');
          const [meetingsData, channelsData, chatsData] = await Promise.all([
            teamsService.getMeetings(),
            teamsService.getChannels(),
            teamsService.getChats()
          ]);

          setMeetings(meetingsData || []);
          setChannels(channelsData || []);
          setChats(chatsData || []);
        } catch (fallbackError) {
          console.error('TeamsPage: Failed to load fallback data:', fallbackError);
          setError('Failed to load any data. Please check your connection and try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamsData();
  }, []);

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const formatDate = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const joinMeeting = async (meeting: TeamsMeeting) => {
    try {
      console.log('TeamsPage: Attempting to join meeting:', meeting.title);

      if (meeting.joinUrl) {
        // First try to use the Teams service
        const success = await teamsService.joinMeeting(meeting.joinUrl);
        if (success) {
          console.log(`TeamsPage: Successfully joined meeting: ${meeting.title}`);
          // Show success message to user
          alert(`Joining meeting: ${meeting.title}`);
        } else {
          console.log(`TeamsPage: Teams service failed, using fallback for: ${meeting.title}`);
          // Fallback: open URL directly
          window.open(meeting.joinUrl, '_blank');
        }
      } else {
        console.log(`TeamsPage: No join URL available for meeting: ${meeting.title}`);
        // For meetings without URLs, show a message
        alert(`Meeting "${meeting.title}" doesn't have a join link. Please contact the meeting organizer.`);
      }
    } catch (error) {
      console.error('TeamsPage: Failed to join meeting:', error);
      // Fallback: try to open URL directly if available
      if (meeting.joinUrl) {
        console.log('TeamsPage: Using fallback URL opening for:', meeting.title);
        window.open(meeting.joinUrl, '_blank');
      } else {
        alert(`Unable to join meeting "${meeting.title}". Please try again or contact support.`);
      }
    }
  };

  const createMeeting = async () => {
    try {
      // For demo purposes, create a sample meeting
      const newMeeting = await teamsService.createMeeting(
        'New Team Meeting',
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour duration
        ['Team Member 1', 'Team Member 2']
      );

      if (newMeeting) {
        setMeetings(prev => [newMeeting, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create meeting:', error);
      // Create a local meeting for demo purposes
      const localMeeting: TeamsMeeting = {
        id: Date.now().toString(),
        title: 'New Team Meeting',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        participants: ['Team Member 1', 'Team Member 2'],
        status: 'scheduled'
      };
      setMeetings(prev => [localMeeting, ...prev]);
    }
  };

  const openChannel = async (channel: TeamsChannel) => {
    try {
      if (channel.webUrl) {
        await teamsService.openChannel(channel.webUrl);
      }
    } catch (error) {
      console.error('Failed to open channel:', error);
      // Fallback: open URL directly
      if (channel.webUrl) {
        window.open(channel.webUrl, '_blank');
      }
    }
  };

  const startNewChat = async () => {
    try {
      const newChat = await teamsService.startChat(['New Contact']);
      if (newChat) {
        setChats(prev => [newChat, ...prev]);
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      // Create a local chat for demo purposes
      const localChat: TeamsChat = {
        id: Date.now().toString(),
        name: 'New Contact',
        participants: ['You', 'New Contact'],
        lastMessage: 'Chat started',
        lastMessageTime: 'Just now',
        unreadCount: 0
      };
      setChats(prev => [localChat, ...prev]);
    }
  };

  // Show error message if there's an error
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Teams Data</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Microsoft Teams</h1>
                <p className="text-gray-600">Collaborate, communicate, and stay connected with your team</p>
              </div>
            </div>

            {/* Teams Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                teamsStatus === 'connected' ? 'bg-green-500' :
                teamsStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                teamsStatus === 'connected' ? 'text-green-700' :
                teamsStatus === 'connecting' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {teamsStatus === 'connected' ? 'Connected' :
                 teamsStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {teamsStatus === 'disconnected' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You're viewing Teams data in demonstration mode. In a real Microsoft Teams environment,
                    this would connect to your actual Teams account and show real meetings, channels, and chats.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={createMeeting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Meeting</span>
            </button>
            <button
              onClick={startNewChat}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'meetings', label: 'Meetings', count: meetings.length },
              { id: 'channels', label: 'Teams & Channels', count: channels.length },
              { id: 'chat', label: 'Chats', count: chats.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading meetings...</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
                <p className="text-gray-600 mb-6">Create your first team meeting to get started</p>
                <button
                  onClick={createMeeting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Schedule Meeting
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(meeting.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{meeting.participants.length} participants</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => joinMeeting(meeting)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        Join Meeting
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading channels...</p>
              </div>
            ) : channels.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No channels available</h3>
                <p className="text-gray-600 mb-6">Join or create channels to start collaborating</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {channels.map((channel) => (
                  <div key={channel.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">#{channel.name}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{channel.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{channel.memberCount} members</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Last activity: {channel.lastActivity}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openChannel(channel)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        Open Channel
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading chats...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
                <p className="text-gray-600 mb-6">Start a conversation with your team members</p>
                <button
                  onClick={startNewChat}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Start New Chat
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {chats.map((chat) => (
                  <div key={chat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{chat.name}</h3>
                        <p className="text-sm text-gray-600">{chat.participants.join(', ')}</p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          {chat.unreadCount} new
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 mb-2">{chat.lastMessage}</p>
                      <p className="text-sm text-gray-500">{chat.lastMessageTime}</p>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                        Open Chat
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                        Mark Read
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
