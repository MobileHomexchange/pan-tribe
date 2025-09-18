import { 
  collection, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  addDoc, 
  getDoc, 
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Comment, UserInteraction } from '@/types';

export class FirebaseService {
  // Like/Unlike post
  static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean, newCount: number }> {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const currentLikes = postDoc.data().likes || [];
    const isLiked = currentLikes.includes(userId);
    
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
    }
    
    // Log interaction for analytics
    await this.logInteraction({
      postId,
      userId,
      type: isLiked ? 'unlike' : 'like',
      timestamp: serverTimestamp()
    });
    
    return {
      liked: !isLiked,
      newCount: isLiked ? currentLikes.length - 1 : currentLikes.length + 1
    };
  }

  // Add comment to post
  static async addComment(postId: string, userId: string, userName: string, content: string): Promise<Comment> {
    const newComment: Omit<Comment, 'id'> = {
      userId,
      userName,
      content,
      createdAt: serverTimestamp()
    };
    
    const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), newComment);
    
    // Update post comment count
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentCount: increment(1)
    });
    
    // Log interaction for analytics
    await this.logInteraction({
      postId,
      userId,
      type: 'comment',
      timestamp: serverTimestamp()
    });
    
    return {
      id: commentRef.id,
      ...newComment,
      createdAt: new Date() // For immediate UI update
    } as Comment;
  }

  // Track share action
  static async trackShare(postId: string, userId: string, platform?: string): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    
    // Update share count
    if (platform && ['facebook', 'twitter', 'whatsapp', 'telegram'].includes(platform)) {
      await updateDoc(postRef, {
        externalShares: increment(1),
        shares: increment(1)
      });
    } else {
      await updateDoc(postRef, {
        shares: increment(1)
      });
    }
    
    // Log detailed share interaction
    await this.logInteraction({
      postId,
      userId,
      type: 'share',
      timestamp: serverTimestamp(),
      metadata: { platform: platform || 'internal' }
    });
  }

  // Track post view for analytics
  static async trackView(postId: string, userId: string, duration?: number): Promise<void> {
    await this.logInteraction({
      postId,
      userId,
      type: 'view',
      timestamp: serverTimestamp(),
      duration
    });
  }

  // Log user interaction for analytics
  static async logInteraction(interaction: Omit<UserInteraction, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'userInteractions'), {
        ...interaction,
        timestamp: interaction.timestamp || serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  }

  // Get comments for a post with real-time updates
  static subscribeToComments(
    postId: string, 
    callback: (comments: Comment[]) => void
  ): () => void {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    
    return onSnapshot(commentsRef, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      // Sort by creation date
      comments.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return aTime.getTime() - bTime.getTime();
      });
      
      callback(comments);
    });
  }

  // Get real-time post updates (likes, shares, etc.)
  static subscribeToPost(
    postId: string,
    callback: (post: Partial<Post>) => void
  ): () => void {
    const postRef = doc(db, 'posts', postId);
    
    return onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Partial<Post>);
      }
    });
  }
}