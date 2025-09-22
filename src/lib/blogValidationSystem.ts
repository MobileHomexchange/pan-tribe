import { type BlogSubmission, type ValidationResult, type ValidationReasonCode } from "@/types/blogSubmission";

// Content validation patterns and rules
const SCAM_KEYWORDS = [
  'make money fast', 'work from home kit', 'investment required', 'processing fee',
  'starter kit', 'send money', 'wire transfer', 'gift cards', 'cryptocurrency investment',
  'guaranteed income', 'no experience needed', 'get rich quick', 'pyramid scheme',
  'multi level marketing', 'recruitment fee', 'training cost', 'activation fee'
];

const UNSAFE_PATTERNS = [
  /\$\d+[\s,]*per\s+(day|hour|week)\s*working\s+from\s+home/i,
  /send\s+\$\d+/i,
  /pay\s+\$\d+\s+(fee|cost|deposit)/i,
  /guaranteed\s+\$\d+/i,
  /make\s+\$\d+\s+(fast|quick|easy)/i
];

const CLICKBAIT_PATTERNS = [
  /!!!+$/,
  /^(YOU WON'T BELIEVE|SHOCKING|AMAZING|INCREDIBLE)/i,
  /DOCTORS HATE (HIM|HER|THIS)/i,
  /ONE WEIRD TRICK/i,
  /CLICK HERE/i
];

const ADULT_CONTENT_KEYWORDS = [
  'adult content', 'explicit', 'nsfw', '18+', 'xxx', 'porn', 'erotic'
];

const SENSITIVE_INFO_REQUESTS = [
  'social security number', 'ssn', 'bank account', 'credit card', 'passport number',
  'driver license', 'routing number', 'pin number', 'tax id'
];

export class BlogValidationSystem {
  
  /**
   * Main validation function that processes a blog submission
   */
  static async validateSubmission(submission: Partial<BlogSubmission>): Promise<ValidationResult> {
    const flags: ValidationReasonCode[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check content length
    if (!submission.content || submission.content.length < 200) {
      flags.push('short_content');
      score -= 25;
      suggestions.push('Content should be at least 200 characters long for better quality');
    }

    // Check for scam keywords
    if (this.containsScamKeywords(submission.title || '', submission.content || '')) {
      flags.push('spam_keywords');
      score -= 30;
      suggestions.push('Remove promotional language and focus on providing valuable information');
    }

    // Check for unsafe patterns
    if (this.containsUnsafePatterns(submission.content || '')) {
      flags.push('misleading_content');
      score -= 35;
      suggestions.push('Remove any requests for money or suspicious financial offers');
    }

    // Check for clickbait
    if (this.isClickbaitTitle(submission.title || '')) {
      flags.push('clickbait_headline');
      score -= 20;
      suggestions.push('Use a more descriptive and professional title');
    }

    // Check for adult content
    if (this.containsAdultContent(submission.content || '')) {
      flags.push('adult_content');
      score -= 40;
      suggestions.push('Content must be family-safe and appropriate for all audiences');
    }

    // Check backlinks safety
    if (submission.backlinks && submission.backlinks.length > 0) {
      const unsafeLinks = await this.validateBacklinks(submission.backlinks);
      if (unsafeLinks.length > 0) {
        flags.push('unsafe_links');
        score -= 25;
        suggestions.push('Some backlinks appear to be unsafe or broken. Please verify all links.');
      }
    }

    // Check for sensitive information requests
    if (this.requestsSensitiveInfo(submission.content || '')) {
      flags.push('spam_keywords');
      score -= 45;
      suggestions.push('Never request sensitive personal information from users');
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    // Determine platform safety
    const safe_for_platforms = this.getSafePlatforms(score, flags);

    return {
      score,
      passed: score >= 60,
      flags,
      suggestions,
      safe_for_platforms
    };
  }

  /**
   * Check if content contains scam keywords
   */
  private static containsScamKeywords(title: string, content: string): boolean {
    const text = (title + ' ' + content).toLowerCase();
    return SCAM_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
  }

  /**
   * Check if content matches unsafe patterns
   */
  private static containsUnsafePatterns(content: string): boolean {
    return UNSAFE_PATTERNS.some(pattern => pattern.test(content));
  }

  /**
   * Check if title is clickbait
   */
  private static isClickbaitTitle(title: string): boolean {
    return CLICKBAIT_PATTERNS.some(pattern => pattern.test(title));
  }

  /**
   * Check for adult content
   */
  private static containsAdultContent(content: string): boolean {
    const text = content.toLowerCase();
    return ADULT_CONTENT_KEYWORDS.some(keyword => text.includes(keyword));
  }

  /**
   * Check if content requests sensitive information
   */
  private static requestsSensitiveInfo(content: string): boolean {
    const text = content.toLowerCase();
    return SENSITIVE_INFO_REQUESTS.some(keyword => text.includes(keyword));
  }

  /**
   * Validate backlinks for safety
   */
  private static async validateBacklinks(links: string[]): Promise<string[]> {
    const unsafeLinks: string[] = [];
    
    for (const link of links) {
      try {
        // Basic URL validation
        new URL(link);
        
        // Check for suspicious domains
        const url = new URL(link);
        const suspiciousDomains = [
          'bit.ly', 'tinyurl.com', 'shorte.st', 'adf.ly',
          'suspicious-website.net', 'fake-testimonials.com',
          'scam-central.org', 'phishing-site.net'
        ];
        
        if (suspiciousDomains.some(domain => url.hostname.includes(domain))) {
          unsafeLinks.push(link);
        }
        
        // In a real implementation, you would integrate with Google Safe Browsing API
        // For now, we'll use basic heuristics
        if (url.hostname.includes('malware') || url.hostname.includes('phishing')) {
          unsafeLinks.push(link);
        }
        
      } catch (error) {
        // Invalid URL
        unsafeLinks.push(link);
      }
    }
    
    return unsafeLinks;
  }

  /**
   * Determine which platforms content is safe for
   */
  private static getSafePlatforms(score: number, flags: ValidationReasonCode[]): string[] {
    const platforms = ['Facebook', 'Instagram', 'TikTok', 'WeChat'];
    
    if (score < 60) return [];
    if (flags.includes('adult_content')) return [];
    if (flags.includes('spam_keywords')) return platforms.filter(p => p !== 'Facebook'); // Facebook has stricter spam rules
    if (flags.includes('clickbait_headline')) return platforms.filter(p => p !== 'TikTok'); // TikTok penalizes clickbait
    
    return platforms;
  }

  /**
   * Calculate user reputation based on submission history
   */
  static calculateUserReputation(
    totalSubmissions: number,
    approvedSubmissions: number,
    rejectedSubmissions: number,
    communityReports: number
  ): number {
    if (totalSubmissions === 0) return 50; // Default for new users
    
    const approvalRate = approvedSubmissions / totalSubmissions;
    const rejectionPenalty = (rejectedSubmissions / totalSubmissions) * 30;
    const reportPenalty = Math.min(communityReports * 5, 40);
    
    let reputation = (approvalRate * 100) - rejectionPenalty - reportPenalty;
    
    // Bonus for consistent good performance
    if (totalSubmissions >= 10 && approvalRate >= 0.9) {
      reputation += 10;
    }
    
    return Math.max(0, Math.min(100, reputation));
  }

  /**
   * Determine moderation status based on score and user reputation
   */
  static determineModerationStatus(
    validationScore: number, 
    userReputation: number,
    isFirstSubmission: boolean
  ): 'approved' | 'pending' | 'rejected' {
    if (validationScore < 50) return 'rejected';
    
    if (validationScore >= 80 && userReputation >= 75 && !isFirstSubmission) {
      return 'approved'; // Auto-approve for trusted users
    }
    
    if (validationScore >= 60) {
      return 'pending'; // Manual review needed
    }
    
    return 'rejected';
  }

  /**
   * Generate verification checklist items
   */
  static generateModerationChecklist(): { label: string; key: keyof BlogSubmission['checklist'] }[] {
    return [
      { label: "Content is original and not plagiarized", key: "original_content" },
      { label: "Content is family-safe and appropriate", key: "family_safe" },
      { label: "Information is accurate and truthful", key: "accurate" },
      { label: "All backlinks are safe and legitimate", key: "links_safe" },
      { label: "Headline is not misleading or clickbait", key: "headline_not_clickbait" },
      { label: "Content complies with social platform rules", key: "social_platform_compliant" },
      { label: "Content provides value to the community", key: "community_value" }
    ];
  }
}