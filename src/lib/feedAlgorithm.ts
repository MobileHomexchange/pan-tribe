import { Post, TribalConnection, UserInterests, FeedPreferences } from '@/types';

export interface FeedScore {
  postId: string;
  totalScore: number;
  breakdown: {
    tribalTies: number;
    engagement: number;
    interest: number;
    recency: number;
    externalShares: number;
    randomBoost: number;
  };
}

export class FeedAlgorithm {
  private static readonly DEFAULT_WEIGHTS = {
    tribalTies: 0.35,
    engagement: 0.25,
    interest: 0.20,
    recency: 0.10,
    externalShares: 0.05,
    randomBoost: 0.05
  };

  private static readonly TRIBAL_MODE_WEIGHTS = {
    tribalTies: 0.70,
    engagement: 0.15,
    interest: 0.10,
    recency: 0.05,
    externalShares: 0.0,
    randomBoost: 0.0
  };

  private static readonly CHRONOLOGICAL_WEIGHTS = {
    tribalTies: 0.0,
    engagement: 0.0,
    interest: 0.0,
    recency: 1.0,
    externalShares: 0.0,
    randomBoost: 0.0
  };

  /**
   * Calculate feed score for a post for a specific user
   */
  static calculateFeedScore(
    post: Post,
    currentUserId: string,
    tribalConnections: TribalConnection[],
    userInterests: UserInterests,
    feedPreferences: FeedPreferences,
    allPosts: Post[]
  ): FeedScore {
    const weights = this.getWeights(feedPreferences);
    
    const tribalScore = this.computeTribalTieScore(post, currentUserId, tribalConnections);
    const engagementScore = this.computeEngagementScore(post, allPosts);
    const interestScore = this.computeInterestMatch(post, userInterests);
    const recencyScore = this.computeRecencyScore(post);
    const externalScore = this.computeExternalSharesScore(post, allPosts);
    const randomBoost = Math.random() * 0.05;

    const totalScore = (
      tribalScore * weights.tribalTies +
      engagementScore * weights.engagement +
      interestScore * weights.interest +
      recencyScore * weights.recency +
      externalScore * weights.externalShares +
      randomBoost * weights.randomBoost
    );

    return {
      postId: post.id,
      totalScore,
      breakdown: {
        tribalTies: tribalScore * weights.tribalTies,
        engagement: engagementScore * weights.engagement,
        interest: interestScore * weights.interest,
        recency: recencyScore * weights.recency,
        externalShares: externalScore * weights.externalShares,
        randomBoost: randomBoost * weights.randomBoost
      }
    };
  }

  /**
   * Get weights based on feed mode and preferences
   */
  private static getWeights(preferences: FeedPreferences) {
    switch (preferences.mode) {
      case 'tribal':
        return this.TRIBAL_MODE_WEIGHTS;
      case 'chronological':
        return this.CHRONOLOGICAL_WEIGHTS;
      case 'discovery':
      default:
        return preferences.customWeights || this.DEFAULT_WEIGHTS;
    }
  }

  /**
   * Calculate tribal tie strength (0.0 - 1.0)
   */
  static computeTribalTieScore(
    post: Post,
    currentUserId: string,
    tribalConnections: TribalConnection[]
  ): number {
    // User's own posts get max tribal score
    if (post.userId === currentUserId) {
      return 1.0;
    }

    // Find connection to post author
    const connection = tribalConnections.find(
      conn => conn.connectedUserId === post.userId
    );

    if (!connection) {
      return 0.1; // Small base score for non-connected users
    }

    return connection.strength;
  }

  /**
   * Calculate engagement score (0.0 - 1.0)
   */
  static computeEngagementScore(post: Post, allPosts: Post[]): number {
    const maxLikes = Math.max(...allPosts.map(p => p.likes.length), 1);
    const maxComments = Math.max(...allPosts.map(p => p.comments.length), 1);
    const maxShares = Math.max(...allPosts.map(p => p.shares), 1);

    const likesScore = post.likes.length / maxLikes;
    const commentsScore = post.comments.length / maxComments;
    const sharesScore = post.shares / maxShares;

    // Weighted engagement: comments > shares > likes
    return (likesScore * 0.2 + commentsScore * 0.5 + sharesScore * 0.3);
  }

  /**
   * Calculate interest match score (0.0 - 1.0)
   */
  static computeInterestMatch(post: Post, userInterests: UserInterests): number {
    let totalScore = 0;
    let matchCount = 0;

    // Category matching
    if (post.category && userInterests.categories[post.category]) {
      totalScore += userInterests.categories[post.category];
      matchCount++;
    }

    // Tag matching
    if (post.tags) {
      for (const tag of post.tags) {
        if (userInterests.tags[tag]) {
          totalScore += userInterests.tags[tag];
          matchCount++;
        }
      }
    }

    // Return average interest score, or base score if no matches
    return matchCount > 0 ? totalScore / matchCount : 0.3;
  }

  /**
   * Calculate recency score (0.0 - 1.0)
   */
  static computeRecencyScore(post: Post): number {
    const now = new Date();
    const postTime = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
    const ageInHours = (now.getTime() - postTime.getTime()) / (1000 * 60 * 60);
    
    const MAX_AGE_HOURS = 168; // 1 week
    
    return Math.max(0, 1 - (ageInHours / MAX_AGE_HOURS));
  }

  /**
   * Calculate external shares score (0.0 - 1.0)
   */
  static computeExternalSharesScore(post: Post, allPosts: Post[]): number {
    const maxExternalShares = Math.max(...allPosts.map(p => p.externalShares || 0), 1);
    return (post.externalShares || 0) / maxExternalShares;
  }

  /**
   * Sort posts by feed score
   */
  static sortPostsByScore(
    posts: Post[],
    currentUserId: string,
    tribalConnections: TribalConnection[],
    userInterests: UserInterests,
    feedPreferences: FeedPreferences
  ): { post: Post; score: FeedScore }[] {
    const scoredPosts = posts.map(post => ({
      post,
      score: this.calculateFeedScore(
        post,
        currentUserId,
        tribalConnections,
        userInterests,
        feedPreferences,
        posts
      )
    }));

    return scoredPosts.sort((a, b) => b.score.totalScore - a.score.totalScore);
  }

  /**
   * Update user interests based on interaction
   */
  static updateUserInterests(
    userInterests: UserInterests,
    post: Post,
    interactionType: 'like' | 'comment' | 'share' | 'view' | 'hide',
    duration?: number
  ): UserInterests {
    const updated = { ...userInterests };
    const interactionWeight = this.getInteractionWeight(interactionType, duration);

    // Update category interest
    if (post.category) {
      const currentScore = updated.categories[post.category] || 0;
      updated.categories[post.category] = Math.min(1, currentScore + interactionWeight);
    }

    // Update tag interests
    if (post.tags) {
      for (const tag of post.tags) {
        const currentScore = updated.tags[tag] || 0;
        updated.tags[tag] = Math.min(1, currentScore + interactionWeight);
      }
    }

    updated.updatedAt = new Date();
    return updated;
  }

  /**
   * Get interaction weight for interest calculation
   */
  private static getInteractionWeight(
    type: string,
    duration?: number
  ): number {
    switch (type) {
      case 'like':
        return 0.1;
      case 'comment':
        return 0.3;
      case 'share':
        return 0.4;
      case 'view':
        // View weight based on duration (assuming 30s is "good" engagement)
        return duration ? Math.min(0.2, (duration / 30) * 0.2) : 0.05;
      case 'hide':
        return -0.2; // Negative feedback
      default:
        return 0.05;
    }
  }
}