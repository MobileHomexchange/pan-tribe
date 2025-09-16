import { useState, useEffect } from 'react';
import { Post, TribalConnection, UserInterests, FeedPreferences } from '@/types';
import { FeedAlgorithm } from '@/lib/feedAlgorithm';
import { useAuth } from '@/contexts/AuthContext';

export function useFeedAlgorithm() {
  const { currentUser } = useAuth();
  const [tribalConnections, setTribalConnections] = useState<TribalConnection[]>([]);
  const [userInterests, setUserInterests] = useState<UserInterests>({
    userId: currentUser?.uid || '',
    categories: {},
    tags: {},
    updatedAt: new Date()
  });
  const [feedPreferences, setFeedPreferences] = useState<FeedPreferences>({
    userId: currentUser?.uid || '',
    mode: 'discovery'
  });

  // Initialize mock data for demonstration
  useEffect(() => {
    if (currentUser) {
      // Mock tribal connections
      setTribalConnections([
        {
          userId: currentUser.uid,
          connectedUserId: 'user1',
          strength: 0.8,
          sharedTribes: ['Ghana Culture'],
          lastInteraction: new Date()
        },
        {
          userId: currentUser.uid,
          connectedUserId: 'user2', 
          strength: 0.6,
          sharedTribes: ['Agriculture'],
          lastInteraction: new Date()
        }
      ]);

      // Mock user interests
      setUserInterests({
        userId: currentUser.uid,
        categories: {
          'culture': 0.8,
          'agriculture': 0.6,
          'technology': 0.4
        },
        tags: {
          'Ghana': 0.9,
          'Ashanti': 0.7,
          'farming': 0.6,
          'sustainability': 0.5
        },
        updatedAt: new Date()
      });
    }
  }, [currentUser]);

  const rankPosts = (posts: Post[]) => {
    if (!currentUser) return posts;

    const rankedPosts = FeedAlgorithm.sortPostsByScore(
      posts,
      currentUser.uid,
      tribalConnections,
      userInterests,
      feedPreferences
    );

    return rankedPosts.map(item => item.post);
  };

  const updateInterests = (post: Post, interactionType: 'like' | 'comment' | 'share' | 'view' | 'hide', duration?: number) => {
    const updatedInterests = FeedAlgorithm.updateUserInterests(
      userInterests,
      post,
      interactionType,
      duration
    );
    setUserInterests(updatedInterests);
  };

  const changeFeedMode = (mode: 'tribal' | 'discovery' | 'chronological') => {
    setFeedPreferences(prev => ({ ...prev, mode }));
  };

  return {
    rankPosts,
    updateInterests,
    changeFeedMode,
    feedMode: feedPreferences.mode,
    userInterests,
    tribalConnections
  };
}