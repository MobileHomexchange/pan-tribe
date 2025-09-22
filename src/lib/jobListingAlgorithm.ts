import { JobListing, JobSearchFilters, VisibilityScoreBreakdown } from '@/types/jobs';

export class JobListingAlgorithm {
  // Scoring weights (must sum to 1.0)
  private static readonly WEIGHTS = {
    TRUST: 0.30,
    FRESHNESS: 0.20,
    RELEVANCE: 0.25,
    ENGAGEMENT: 0.15,
    QUALITY: 0.10
  };

  /**
   * Calculate visibility score for a job listing
   */
  static calculateVisibilityScore(job: JobListing): VisibilityScoreBreakdown {
    const trustScore = this.calculateTrustScore(job);
    const freshnessScore = this.calculateFreshnessScore(job);
    const relevanceScore = this.calculateRelevanceScore(job);
    const engagementScore = this.calculateEngagementScore(job);
    const qualityScore = this.calculateQualityScore(job);

    const totalScore = 
      (trustScore * this.WEIGHTS.TRUST) +
      (freshnessScore * this.WEIGHTS.FRESHNESS) +
      (relevanceScore * this.WEIGHTS.RELEVANCE) +
      (engagementScore * this.WEIGHTS.ENGAGEMENT) +
      (qualityScore * this.WEIGHTS.QUALITY);

    const boostFactors = this.getBoostFactors(job);
    const finalScore = this.applyBoosts(totalScore, boostFactors);

    return {
      trust_score: trustScore,
      freshness_score: freshnessScore,
      relevance_score: relevanceScore,
      engagement_score: engagementScore,
      quality_score: qualityScore,
      total_score: finalScore,
      boost_factors: boostFactors
    };
  }

  /**
   * Calculate trust score based on employer reputation and verification
   */
  private static calculateTrustScore(job: JobListing): number {
    let score = job.employer_profile?.reputation_score || 5.0;
    
    // Verified employer bonus
    if (job.employer_profile?.verified) {
      score += 2.0;
    }

    // Company profile completeness
    if (job.employer_profile?.company_description) score += 0.5;
    if (job.employer_profile?.website) score += 0.5;
    if (job.employer_profile?.industry) score += 0.5;

    return Math.min(score, 10);
  }

  /**
   * Calculate freshness score based on posting date
   */
  private static calculateFreshnessScore(job: JobListing): number {
    const now = new Date();
    const posted = new Date(job.created_at);
    const hoursOld = (now.getTime() - posted.getTime()) / (1000 * 60 * 60);

    // Fresh posts get higher scores, decay over 168 hours (1 week)
    const score = Math.max(10 - (hoursOld / 16.8), 1);
    return Math.min(score, 10);
  }

  /**
   * Calculate relevance score based on job posting completeness
   */
  private static calculateRelevanceScore(job: JobListing): number {
    let score = 5; // Base score

    // Job description quality
    if (job.job_description.length > 200) score += 1;
    if (job.job_description.length > 500) score += 0.5;

    // Salary information
    if (job.salary_min) score += 1;
    if (job.salary_max) score += 0.5;

    // Skills listed
    if (job.skills.length > 0) score += 1;
    if (job.skills.length > 3) score += 0.5;

    // Remote option
    if (job.remote_option) score += 0.5;

    // Location specificity
    if (job.location && job.location !== 'Remote') score += 0.5;

    return Math.min(score, 10);
  }

  /**
   * Calculate engagement score based on user interactions
   */
  private static calculateEngagementScore(job: JobListing): number {
    const totalEngagement = 
      job.clicks + 
      (job.saves * 2) + 
      (job.shares * 3) + 
      (job.applications * 5);

    // Normalize to 0-10 scale
    const score = Math.min(totalEngagement / 20, 10);
    return score;
  }

  /**
   * Calculate quality score based on flags and content analysis
   */
  private static calculateQualityScore(job: JobListing): number {
    let score = 8; // Base quality score

    // Penalty for flags
    score -= (job.flagged_count * 2);

    // Bonus for clear job titles
    if (job.job_title.length > 10 && job.job_title.length < 100) {
      score += 0.5;
    }

    // Content quality indicators
    if (this.hasSpamIndicators(job)) {
      score -= 3;
    }

    return Math.max(score, 1);
  }

  /**
   * Detect spam indicators in job posting
   */
  private static hasSpamIndicators(job: JobListing): boolean {
    const spamKeywords = [
      'make money fast',
      'work from home guaranteed',
      'no experience needed',
      'urgent hiring',
      '$$$',
      'immediate start'
    ];

    const text = `${job.job_title} ${job.job_description}`.toLowerCase();
    return spamKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Get boost factors for additional scoring
   */
  private static getBoostFactors(job: JobListing): string[] {
    const factors: string[] = [];

    if (job.featured) factors.push('Featured Listing');
    if (job.employer_profile?.verified) factors.push('Verified Employer');
    if (job.remote_option) factors.push('Remote Option');
    if (job.salary_min && job.salary_min > 50000) factors.push('Competitive Salary');

    return factors;
  }

  /**
   * Apply boost factors to the base score
   */
  private static applyBoosts(baseScore: number, boostFactors: string[]): number {
    let boostedScore = baseScore;

    if (boostFactors.includes('Featured Listing')) {
      boostedScore *= 1.1; // 10% boost
    }

    if (boostFactors.includes('Verified Employer')) {
      boostedScore *= 1.05; // 5% boost
    }

    return Math.min(boostedScore, 10);
  }

  /**
   * Sort jobs by visibility score and filters
   */
  static sortJobsByVisibility(
    jobs: JobListing[], 
    filters?: JobSearchFilters
  ): JobListing[] {
    let filteredJobs = this.applyFilters(jobs, filters);
    
    return filteredJobs.sort((a, b) => {
      const scoreA = this.calculateVisibilityScore(a).total_score;
      const scoreB = this.calculateVisibilityScore(b).total_score;
      return scoreB - scoreA; // Descending order
    });
  }

  /**
   * Apply search filters to job listings
   */
  private static applyFilters(jobs: JobListing[], filters?: JobSearchFilters): JobListing[] {
    if (!filters) return jobs;

    return jobs.filter(job => {
      // Category filter
      if (filters.category && job.category !== filters.category) {
        return false;
      }

      // Location filter
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Remote only filter
      if (filters.remote_only && !job.remote_option) {
        return false;
      }

      // Salary filters
      if (filters.salary_min && job.salary_min && job.salary_min < filters.salary_min) {
        return false;
      }

      if (filters.salary_max && job.salary_max && job.salary_max > filters.salary_max) {
        return false;
      }

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) return false;
      }

      // Search query filter
      if (filters.search_query) {
        const query = filters.search_query.toLowerCase();
        const searchText = `${job.job_title} ${job.job_description} ${job.skills.join(' ')}`.toLowerCase();
        if (!searchText.includes(query)) return false;
      }

      return true;
    });
  }

  /**
   * Get personalized job recommendations for a user
   */
  static getPersonalizedRecommendations(
    jobs: JobListing[],
    userPreferences: {
      preferred_categories?: string[];
      preferred_locations?: string[];
      skills?: string[];
      salary_expectations?: { min: number; max: number };
    }
  ): JobListing[] {
    return jobs
      .map(job => ({
        ...job,
        personalization_score: this.calculatePersonalizationScore(job, userPreferences)
      }))
      .sort((a, b) => {
        const scoreA = this.calculateVisibilityScore(a).total_score + (a as any).personalization_score;
        const scoreB = this.calculateVisibilityScore(b).total_score + (b as any).personalization_score;
        return scoreB - scoreA;
      });
  }

  /**
   * Calculate personalization score based on user preferences
   */
  private static calculatePersonalizationScore(
    job: JobListing,
    preferences: any
  ): number {
    let score = 0;

    // Category preference match
    if (preferences.preferred_categories?.includes(job.category)) {
      score += 2;
    }

    // Location preference match
    if (preferences.preferred_locations?.some((loc: string) => 
      job.location.toLowerCase().includes(loc.toLowerCase())
    )) {
      score += 1.5;
    }

    // Skills match
    if (preferences.skills) {
      const matchingSkills = job.skills.filter(skill =>
        preferences.skills.some((userSkill: string) =>
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      score += matchingSkills.length * 0.5;
    }

    // Salary expectations
    if (preferences.salary_expectations && job.salary_min) {
      if (job.salary_min >= preferences.salary_expectations.min &&
          (!job.salary_max || job.salary_max <= preferences.salary_expectations.max)) {
        score += 1;
      }
    }

    return Math.min(score, 5); // Cap at 5 points
  }
}