import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Briefcase, Plus, Search, ChevronDown, ChevronUp, Shield, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmployerVerificationForm } from "@/components/jobs/EmployerVerificationForm";
import { EnhancedJobPostForm } from "@/components/jobs/EnhancedJobPostForm";
import { JobModerationDashboard } from "@/components/jobs/JobModerationDashboard";
import { ApplicantSafetyFeatures } from "@/components/jobs/ApplicantSafetyFeatures";
import { EmployerProfile, JobPost } from "@/lib/jobVettingSystem";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  postedDays: number;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechSolutions Inc.",
    location: "Lagos, Nigeria",
    type: "Remote",
    salary: "₦250,000 - ₦400,000 per month",
    description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing visual elements that users see and interact with in web applications.",
    tags: ["React", "JavaScript", "CSS"],
    postedDays: 2
  },
  {
    id: "2",
    title: "Financial Analyst",
    company: "Pan-African Finance Group",
    location: "Nairobi, Kenya",
    type: "Full-time",
    salary: "KES 180,000 - KES 250,000 per month",
    description: "Join our finance team to analyze financial data, create financial models, and provide insights to help drive business decisions. CFA certification is a plus.",
    tags: ["Excel", "Financial Modeling", "Data Analysis"],
    postedDays: 5
  },
  {
    id: "3",
    title: "Healthcare Administrator",
    company: "MediGroup Africa",
    location: "Accra, Ghana",
    type: "Full-time",
    salary: "GHS 5,000 - GHS 7,000 per month",
    description: "We are seeking an experienced Healthcare Administrator to manage operations at our healthcare facility. You will oversee staff, budgets, and patient services.",
    tags: ["Healthcare", "Management", "Administration"],
    postedDays: 7
  },
  {
    id: "4",
    title: "Marketing Manager",
    company: "Diaspora Brands",
    location: "Johannesburg, SA",
    type: "Full-time",
    salary: "R35,000 - R50,000 per month",
    description: "We're looking for a creative Marketing Manager to develop and implement marketing strategies that promote our brands across the African continent.",
    tags: ["Digital Marketing", "Strategy", "Brand Management"],
    postedDays: 3
  }
];

export default function Careers() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    keywords: "",
    location: "",
    jobType: "",
    industry: "",
    experience: "",
    salary: ""
  });
  const [currentEmployer, setCurrentEmployer] = useState<EmployerProfile | null>(null);
  const [verificationStep, setVerificationStep] = useState<'verify' | 'post'>('verify');
  const [isAdmin, setIsAdmin] = useState(false); // For demo purposes
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "Search initiated",
      description: "Searching for jobs with your criteria..."
    });
  };

  const handleVerificationComplete = (employer: EmployerProfile) => {
    setCurrentEmployer(employer);
    setVerificationStep('post');
    toast({
      title: "Verification Complete!",
      description: "You can now post jobs on our platform."
    });
  };

  const handleJobSubmit = (jobPost: JobPost) => {
    // In a real app, this would save to database
    console.log('Job submitted:', jobPost);
    setIsPostJobOpen(false);
    setVerificationStep('verify');
    setCurrentEmployer(null);
  };

  const handleJobReport = (report: any) => {
    console.log('Job reported:', report);
  };

  const handleJobRating = (rating: any) => {
    console.log('Job rated:', rating);
  };

  const handleApply = (jobTitle: string, company: string) => {
    toast({
      title: "Application initiated",
      description: `Starting application process for ${jobTitle} at ${company}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Toggle (Demo) */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdmin(!isAdmin)}
        >
          <Settings className="w-4 h-4 mr-2" />
          {isAdmin ? 'User View' : 'Admin View'}
        </Button>
      </div>

      {isAdmin ? (
        <JobModerationDashboard />
      ) : (
        <>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-8 rounded-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Find Your Dream Career</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
          Discover opportunities that match your skills and aspirations across the African diaspora
        </p>
        
        {/* Search Container */}
        <Card className="bg-white text-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Job Title or Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="e.g. Software Engineer"
                  value={searchFilters.keywords}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, keywords: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Country or City"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-type">Job Type</Label>
                <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, jobType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* Advanced Filters Toggle */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-sm"
              >
                Advanced Filters
                {showAdvancedFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intern">Intern</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, salary: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Salary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50000">Up to $50,000</SelectItem>
                      <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100000-150000">$100,000 - $150,000</SelectItem>
                      <SelectItem value="150000+">$150,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Latest Job Postings
            </CardTitle>
            <CardDescription>125 jobs found</CardDescription>
          </div>
          <Dialog open={isPostJobOpen} onOpenChange={setIsPostJobOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post a Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Secure Job Posting System
                </DialogTitle>
              </DialogHeader>
              
              <Tabs value={verificationStep} onValueChange={setVerificationStep as any}>
                <TabsList>
                  <TabsTrigger value="verify" disabled={!!currentEmployer}>
                    <Shield className="w-4 h-4 mr-2" />
                    Employer Verification
                  </TabsTrigger>
                  <TabsTrigger value="post" disabled={!currentEmployer}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Post Job
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="verify">
                  <EmployerVerificationForm onVerificationComplete={handleVerificationComplete} />
                </TabsContent>
                
                <TabsContent value="post">
                  {currentEmployer && (
                    <EnhancedJobPostForm
                      employer={currentEmployer}
                      onJobSubmit={handleJobSubmit}
                      onCancel={() => setIsPostJobOpen(false)}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {mockJobs.map((job) => (
            <Card key={job.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-muted-foreground mb-2">{job.company}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      {job.location} • <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <p className="text-pan-green font-semibold">{job.salary}</p>
                  </div>
                  <Button onClick={() => handleApply(job.title, job.company)}>
                    Apply
                  </Button>
                </div>
                
                <p className="text-sm mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Posted {job.postedDays} {job.postedDays === 1 ? 'day' : 'days'} ago
                  </p>
                  
                  {/* Safety Features for each job */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Safety Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Job Safety Information</DialogTitle>
                      </DialogHeader>
                      <ApplicantSafetyFeatures
                        job={{
                          id: job.id,
                          title: job.title,
                          company: job.company,
                          contactEmail: "contact@company.com", // Mock data
                          trustScore: 85, // Mock trust score
                          reports: [],
                          flagReasons: []
                        } as JobPost}
                        onReport={handleJobReport}
                        onRating={handleJobRating}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}