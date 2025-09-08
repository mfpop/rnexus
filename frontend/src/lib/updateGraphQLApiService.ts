// src/lib/updateGraphQLApiService.ts

import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GET_ALL_UPDATES, GET_UPDATE } from "../graphql/updates_new";
import { UpdateExtended } from "../components/news";

// This is a placeholder for the actual client instance.
// We will need to import the configured Apollo Client from the application's entry point.
let client: ApolloClient<NormalizedCacheObject>;

export function initializeGraphQLClient(
  apolloClient: ApolloClient<NormalizedCacheObject>,
) {
  client = apolloClient;
}

export class UpdateGraphQLApiService {
  static async getUpdates() // Parameters like type, status, etc. will be handled by client-side filtering for now,
  // as per the existing GraphQL query structure.
  : Promise<{ updates: UpdateExtended[]; pagination: any }> {
    if (!client) {
      throw new Error("GraphQL client is not initialized.");
    }

    try {
      const { data, error } = await client.query({
        query: GET_ALL_UPDATES,
        fetchPolicy: "network-only",
      });

      if (error) {
        throw new Error(`GraphQL error: ${error.message}`);
      }

      // The backend schema and existing frontend components expect a certain structure.
      // We will need to transform the data from `data.allUpdates` to match the `UpdateExtended` type,
      // including computed properties. This logic will be similar to what's in NewsContextNew.tsx.
      const processedUpdates = (data.allUpdates || []).map(
        (rawUpdate: any): UpdateExtended => ({
          id: rawUpdate.id,
          type: rawUpdate.type || "news",
          title: rawUpdate.title || "",
          summary: rawUpdate.summary || "",
          body: rawUpdate.body || "",
          timestamp: rawUpdate.timestamp || rawUpdate.createdAt || "",
          status: rawUpdate.status || "active",
          tags: Array.isArray(rawUpdate.tags) ? rawUpdate.tags : [],
          author: rawUpdate.author || "",
          icon: rawUpdate.icon || "info",
          priority: rawUpdate.priority || "normal",
          isActive: rawUpdate.isActive ?? true,
          isExpired: rawUpdate.expiresAt
            ? new Date(rawUpdate.expiresAt) < new Date()
            : false,
          timeAgo: rawUpdate.createdAt
            ? `${Math.floor((Date.now() - new Date(rawUpdate.createdAt).getTime()) / 60000)} min ago`
            : "",
          readingTime: Math.max(
            1,
            Math.ceil((rawUpdate.body || "").split(" ").length / 200),
          ),
          fullName: rawUpdate.createdBy
            ? `${rawUpdate.createdBy.firstName} ${rawUpdate.createdBy.lastName}`.trim()
            : rawUpdate.author || "",
          createdAt: rawUpdate.createdAt || "",
          updatedAt: rawUpdate.updatedAt || "",
          expiresAt: rawUpdate.expiresAt,
          createdBy: rawUpdate.createdBy,
          can_delete: rawUpdate.can_delete ?? false,
          can_edit: rawUpdate.can_edit ?? false,
          user_like_status: rawUpdate.user_like_status ?? null,
          likes_count: rawUpdate.likes_count ?? 0,
          dislikes_count: rawUpdate.dislikes_count ?? 0,
          comments_count: rawUpdate.comments_count ?? 0,
          media: Array.isArray(rawUpdate.media) ? rawUpdate.media : [],
          attachments: Array.isArray(rawUpdate.attachments)
            ? rawUpdate.attachments
            : [],
          related: Array.isArray(rawUpdate.related) ? rawUpdate.related : [],
        }),
      );

      return {
        updates: processedUpdates,
        // Pagination data is not provided by the current GET_ALL_UPDATES query.
        // This would need to be added to the GraphQL schema and query if needed.
        pagination: { hasMore: false, total: processedUpdates.length },
      };
    } catch (error) {
      console.error("Error fetching updates via GraphQL:", error);
      throw error;
    }
  }

  static async getUpdate(updateId: string): Promise<UpdateExtended> {
    if (!client) {
      throw new Error("GraphQL client is not initialized.");
    }

    try {
      const { data, error } = await client.query({
        query: GET_UPDATE,
        variables: { id: updateId },
        fetchPolicy: "network-only",
      });

      if (error) {
        throw new Error(`GraphQL error: ${error.message}`);
      }

      const rawUpdate = data.update;
      if (!rawUpdate) {
        throw new Error(`Update with ID ${updateId} not found.`);
      }

      // Transform the single update data
      const processedUpdate: UpdateExtended = {
        id: rawUpdate.id,
        type: rawUpdate.type || "news",
        title: rawUpdate.title || "",
        summary: rawUpdate.summary || "",
        body: rawUpdate.body || "",
        timestamp: rawUpdate.timestamp || rawUpdate.createdAt || "",
        status: rawUpdate.status || "active",
        tags: Array.isArray(rawUpdate.tags) ? rawUpdate.tags : [],
        author: rawUpdate.author || "",
        icon: rawUpdate.icon || "info",
        priority: rawUpdate.priority || "normal",
        isActive: rawUpdate.isActive ?? true,
        isExpired: rawUpdate.expiresAt
          ? new Date(rawUpdate.expiresAt) < new Date()
          : false,
        timeAgo: rawUpdate.createdAt
          ? `${Math.floor((Date.now() - new Date(rawUpdate.createdAt).getTime()) / 60000)} min ago`
          : "",
        readingTime: Math.max(
          1,
          Math.ceil((rawUpdate.body || "").split(" ").length / 200),
        ),
        fullName: rawUpdate.createdBy
          ? `${rawUpdate.createdBy.firstName} ${rawUpdate.createdBy.lastName}`.trim()
          : rawUpdate.author || "",
        createdAt: rawUpdate.createdAt || "",
        updatedAt: rawUpdate.updatedAt || "",
        expiresAt: rawUpdate.expiresAt,
        createdBy: rawUpdate.createdBy,
        can_delete: rawUpdate.can_delete ?? false,
        can_edit: rawUpdate.can_edit ?? false,
        user_like_status: rawUpdate.user_like_status ?? null,
        likes_count: rawUpdate.likes_count ?? 0,
        dislikes_count: rawUpdate.dislikes_count ?? 0,
        comments_count: rawUpdate.comments_count ?? 0,
        media: Array.isArray(rawUpdate.media) ? rawUpdate.media : [],
        attachments: Array.isArray(rawUpdate.attachments)
          ? rawUpdate.attachments
          : [],
        related: Array.isArray(rawUpdate.related) ? rawUpdate.related : [],
      };

      return processedUpdate;
    } catch (error) {
      console.error(`Error fetching update ${updateId} via GraphQL:`, error);
      throw error;
    }
  }
}
