// TribalPulse Job Posting Safety System
// Comprehensive fraud detection and trust scoring

export interface EmployerProfile {
  id: string;
  businessName: string;
  website: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  isVerified: boolean;
  trustLevel: number; // 0-100
  verificationHistory: VerificationCheck[];
  postingHistory: JobPost[];
  reportCount: number;
  positiveRatings: number;
  totalRatings: number;
}

export interface VerificationCheck {
  type: 'email' | 'website' | 'phone' | 'business' | 'social';
  status: 'verified' | 'failed' | 'pending';
  timestamp: Date;
  details?: string;
}

export interface JobPost {
  id: string;
  employerId: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  tags: string[];
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  trustScore: number;
  flagReasons: string[];
  reports: ApplicantReport[];
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface ApplicantReport {
  id: string;
  jobId: string;
  reporterId: string;
  category: 'scam' | 'spam' | 'misleading' | 'offensive' | 'fake_company';
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface TrustScoreFactors {
  employerVerification: number; // 0-40 points
  jobPostQuality: number; // 0-30 points
  historyReputation: number; // 0-30 points
}

// Fraud detection patterns
export const SCAM_KEYWORDS = [
  'processing fee', 'startup fee', 'training fee', 'wire money', 'western union',
  'money gram', 'cashiers check', 'work from home kit', 'investment required',
  'pay upfront', 'send money', 'gift card', 'bitcoin', 'cryptocurrency',
  'easy money', 'no experience necessary', 'guaranteed income', 'make money fast'
];

export const SENSITIVE_INFO_REQUESTS = [
  'social security', 'ssn', 'bank account', 'credit card', 'passport number',
  'driver license', 'routing number', 'pin number', 'full ssn'
];

export const SUSPICIOUS_SALARY_PATTERNS = [
  /\$\d{3,4}\/hour/i, // Very high hourly rates like $500/hour
  /\$\d{5,}\s*\/\s*day/i, // Very high daily rates
  /guaranteed.*\$\d{4,}/i // Guaranteed high amounts
];

export class JobVettingSystem {
  /**
   * Calculate comprehensive trust score for a job posting
   */
  static calculateTrustScore(jobPost: Partial<JobPost>, employer: EmployerProfile): { score: number; factors: TrustScoreFactors; flags: string[] } {
    const factors: TrustScoreFactors = {
      employerVerification: 0,
      jobPostQuality: 0,
      historyReputation: 0
    };
    const flags: string[] = [];

    // Employer Verification (40 points max)
    factors.employerVerification = this.calculateEmployerVerificationScore(employer, flags);

    // Job Post Quality (30 points max)
    factors.jobPostQuality = this.calculateJobQualityScore(jobPost, flags);

    // History & Reputation (30 points max)
    factors.historyReputation = this.calculateHistoryScore(employer, flags);

    const totalScore = factors.employerVerification + factors.jobPostQuality + factors.historyReputation;

    return {
      score: Math.min(100, Math.max(0, totalScore)),
      factors,
      flags
    };
  }

  /**
   * Calculate employer verification score (0-40 points)
   */
  private static calculateEmployerVerificationScore(employer: EmployerProfile, flags: string[]): number {
    let score = 0;

    // Business email domain verification (20 points)
    if (this.isBusinessEmailDomain(employer.email, employer.website)) {
      score += 20;
    } else if (this.isFreeEmailDomain(employer.email)) {
      flags.push('Free email domain detected');
      score += 5; // Partial credit for having an email
    }

    // Phone verification (10 points)
    if (employer.phone && this.isValidPhoneNumber(employer.phone)) {
      score += 10;
    }

    // Social media presence (10 points)
    if (employer.linkedinUrl && this.isValidLinkedInUrl(employer.linkedinUrl)) {
      score += 10;
    }

    return score;
  }

  /**
   * Calculate job post quality score (0-30 points)
   */
  private static calculateJobQualityScore(jobPost: Partial<JobPost>, flags: string[]): number {
    let score = 0;

    // Description length and quality (15 points)
    if (jobPost.description) {
      const wordCount = jobPost.description.split(' ').length;
      if (wordCount >= 100) {
        score += 15;
      } else if (wordCount >= 50) {
        score += 10;
      } else if (wordCount >= 20) {
        score += 5;
      } else {
        flags.push('Job description too short');
      }
    }

    // Realistic salary (10 points)
    if (jobPost.salary && this.isRealisticSalary(jobPost.salary)) {
      score += 10;
    } else if (jobPost.salary) {
      flags.push('Suspicious salary range');
    }

    // Clear requirements (5 points)
    if (jobPost.requirements && jobPost.requirements.length > 0) {
      score += 5;
    }

    // Check for scam content
    if (jobPost.description && this.containsScamKeywords(jobPost.description)) {
      flags.push('Contains scam keywords');
      score -= 20; // Heavy penalty
    }

    if (jobPost.description && this.requestsSensitiveInfo(jobPost.description)) {
      flags.push('Requests sensitive personal information');
      score -= 25; // Very heavy penalty
    }

    return Math.max(0, score);
  }

  /**
   * Calculate history and reputation score (0-30 points)
   */
  private static calculateHistoryScore(employer: EmployerProfile, flags: string[]): number {
    let score = 0;

    // Account age and posting history (10 points)
    if (employer.postingHistory.length > 5) {
      score += 10;
    } else if (employer.postingHistory.length > 0) {
      score += 5;
    } else {
      flags.push('New employer account');
    }

    // Clean record (10 points)
    if (employer.reportCount === 0) {
      score += 10;
    } else if (employer.reportCount < 3) {
      score += 5;
      flags.push('Some reports against employer');
    } else {
      flags.push('Multiple reports against employer');
    }

    // Positive ratings (10 points)
    if (employer.totalRatings > 0) {
      const positiveRatio = employer.positiveRatings / employer.totalRatings;
      score += Math.floor(positiveRatio * 10);
    }

    return score;
  }

  /**
   * Verify if email domain matches business website
   */
  private static isBusinessEmailDomain(email: string, website?: string): boolean {
    if (!website) return false;
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    const websiteDomain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
    
    return emailDomain === websiteDomain;
  }

  /**
   * Check if email is from a free provider
   */
  private static isFreeEmailDomain(email: string): boolean {
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return freeProviders.includes(domain);
  }

  /**
   * Basic phone number validation
   */
  private static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate LinkedIn URL format
   */
  private static isValidLinkedInUrl(url: string): boolean {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/(company|in)\//;
    return linkedinRegex.test(url);
  }

  /**
   * Check for realistic salary ranges
   */
  private static isRealisticSalary(salary: string): boolean {
    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_SALARY_PATTERNS) {
      if (pattern.test(salary)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Detect scam keywords in content
   */
  private static containsScamKeywords(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return SCAM_KEYWORDS.some(keyword => lowerContent.includes(keyword));
  }

  /**
   * Detect requests for sensitive information
   */
  private static requestsSensitiveInfo(content: string): boolean {
    const lowerContent = content.toLowerCase();
    return SENSITIVE_INFO_REQUESTS.some(term => lowerContent.includes(term));
  }

  /**
   * Determine job status based on trust score
   */
  static determineJobStatus(trustScore: number): 'approved' | 'pending' | 'rejected' {
    if (trustScore >= 80) return 'approved';
    if (trustScore >= 50) return 'pending';
    return 'rejected';
  }

  /**
   * Generate verification checklist for new employers
   */
  static generateVerificationChecklist(employer: Partial<EmployerProfile>): VerificationCheck[] {
    const checks: VerificationCheck[] = [];

    // Email verification
    checks.push({
      type: 'email',
      status: 'pending',
      timestamp: new Date()
    });

    // Website verification
    if (employer.website) {
      checks.push({
        type: 'website',
        status: 'pending',
        timestamp: new Date()
      });
    }

    // Phone verification
    if (employer.phone) {
      checks.push({
        type: 'phone',
        status: 'pending',
        timestamp: new Date()
      });
    }

    // Business entity check
    checks.push({
      type: 'business',
      status: 'pending',
      timestamp: new Date()
    });

    // Social media verification
    if (employer.linkedinUrl) {
      checks.push({
        type: 'social',
        status: 'pending',
        timestamp: new Date()
      });
    }

    return checks;
  }
}