import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  MoreHorizontal, 
  FileText, 
  Image, 
  Video,
  MessageSquare,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'post' | 'blog' | 'reel' | 'comment';
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  flagReason?: string;
  flagCount: number;
  tribe: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const ContentModeration = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate fetching content - replace with actual Firebase query
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'post',
        title: 'New AI Technology Discussion',
        content: 'Just saw an amazing presentation about the future of AI...',
        author: 'John Doe',
        authorAvatar: '',
        createdDate: '2024-01-20',
        status: 'pending',
        flagCount: 0,
        tribe: 'Tech Innovators',
        engagement: { likes: 15, comments: 3, shares: 2 }
      },
      {
        id: '2',
        type: 'blog',
        title: 'Startup Funding Guide',
        content: 'A comprehensive guide to raising funds for your startup...',
        author: 'Jane Smith',
        authorAvatar: '',
        createdDate: '2024-01-19',
        status: 'approved',
        flagCount: 0,
        tribe: 'Startup Founders',
        engagement: { likes: 45, comments: 12, shares: 8 }
      },
      {
        id: '3',
        type: 'comment',
        title: 'Comment on "AI Ethics"',
        content: 'This is inappropriate content that violates our guidelines...',
        author: 'Bob Wilson',
        authorAvatar: '',
        createdDate: '2024-01-18',
        status: 'flagged',
        flagReason: 'Inappropriate content',
        flagCount: 5,
        tribe: 'Tech Innovators',
        engagement: { likes: 0, comments: 0, shares: 0 }
      }
    ];
    
    setTimeout(() => {
      setContent(mockContent);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusCounts = () => {
    return {
      all: content.length,
      pending: content.filter(item => item.status === 'pending').length,
      flagged: content.filter(item => item.status === 'flagged').length,
      approved: content.filter(item => item.status === 'approved').length,
      rejected: content.filter(item => item.status === 'rejected').length
    };
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return FileText;
      case 'blog': return FileText;
      case 'reel': return Video;
      case 'comment': return MessageSquare;
      default: return FileText;
    }
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`Action ${action} for content ${contentId}`);
    // Implement content moderation actions here
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Moderation</h1>
        <p className="text-muted-foreground">Review and moderate platform content, handle reports and flags.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{counts.all}</div>
            <div className="text-sm text-muted-foreground">Total Content</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{counts.flagged}</div>
            <div className="text-sm text-muted-foreground">Flagged Content</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{counts.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{counts.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Content Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Content ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
              <TabsTrigger value="flagged">Flagged ({counts.flagged})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="post">Posts</SelectItem>
                    <SelectItem value="blog">Blogs</SelectItem>
                    <SelectItem value="reel">Reels</SelectItem>
                    <SelectItem value="comment">Comments</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Tribe</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((item) => {
                      const TypeIcon = getTypeIcon(item.type);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-muted rounded">
                                <TypeIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium line-clamp-1">{item.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {item.content}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                  {item.flagCount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      <Flag className="h-3 w-3 mr-1" />
                                      {item.flagCount} flags
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={item.authorAvatar} />
                                <AvatarFallback>{item.author[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{item.author}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.tribe}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                            {item.flagReason && (
                              <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {item.flagReason}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div>{item.engagement.likes} likes</div>
                              <div className="text-muted-foreground">
                                {item.engagement.comments} comments
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.createdDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleContentAction(item.id, 'view')}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Full Content
                                </DropdownMenuItem>
                                {item.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={() => handleContentAction(item.id, 'approve')}
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleContentAction(item.id, 'reject')}
                                      className="text-red-600"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {item.status === 'flagged' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleContentAction(item.id, 'resolve')}
                                    className="text-blue-600"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Resolve Flag
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => handleContentAction(item.id, 'delete')}
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Delete Content
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModeration;