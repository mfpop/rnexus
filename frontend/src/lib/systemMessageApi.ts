import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SYSTEM_MESSAGES,
  MARK_SYSTEM_MESSAGE_AS_READ,
} from "../graphql/systemMessages";

export const useSystemMessages = (isRead?: boolean) => {
  const { loading, error, data, refetch } = useQuery(GET_SYSTEM_MESSAGES, {
    variables: { isRead },
    fetchPolicy: "cache-and-network", // Use cache first, then network for updates
    errorPolicy: "all", // Handle errors gracefully
  });

  return {
    systemMessages: data?.systemMessages || [],
    loadingSystemMessages: loading,
    errorSystemMessages: error,
    refetchSystemMessages: refetch,
  };
};

export const useMarkSystemMessageAsRead = () => {
  const [markAsReadMutation, { loading, error }] = useMutation(
    MARK_SYSTEM_MESSAGE_AS_READ,
    {
      // Optionally update the cache after mutation
      update(cache, { data }) {
        const markedMessage = data?.markSystemMessageAsRead?.systemMessage;
        if (markedMessage) {
          cache.modify({
            id: cache.identify(markedMessage),
            fields: {
              isRead() {
                return true;
              },
            },
          });
        }
      },
    },
  );

  const markSystemMessageAsRead = async (messageId: string) => {
    try {
      const response = await markAsReadMutation({ variables: { messageId } });
      return response.data?.markSystemMessageAsRead?.ok;
    } catch (e) {
      console.error("Error marking message as read:", e);
      return false;
    }
  };

  return {
    markSystemMessageAsRead,
    loadingMarkAsRead: loading,
    errorMarkAsRead: error,
  };
};
