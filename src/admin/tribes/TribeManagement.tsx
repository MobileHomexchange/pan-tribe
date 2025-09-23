import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Crown, 
  Users, 
  Star,
  Edit,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

interface Tribe {
  id: string;
  name: string;
  description: string;
  category: string;
  avatar: string;
  coverImage: string;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  createdDate: string;
  createdBy: string;
  status: 'active' | 'suspended' | 'pending';
}

const TribeManagement = () => {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate fetching tribes - replace with actual Firebase query
    const mockTribes: Tribe[] = [
      {
        id: '1',
        name: 'Tech Innovators',
        description: 'A community for technology enthusiasts and innovators',
        category: 'Technology',
        avatar: '',
        coverImage: '',
        memberCount: 1250,
        postCount: 450,
        isPrivate: false,
        isFeatured: true,
        isVerified: true,
        createdDate: '2024-01-15',
        createdBy: 'John Doe',
        status: 'active'
      },
      {
        id: '2',
        name: 'Startup Founders',
        description: 'Network for startup founders and entrepreneurs',
        category: 'Business',
        avatar: '',
        coverImage: '',
        memberCount: 890,
        postCount: 320,
        isPrivate: true,
        isFeatured: false,
        isVerified: true,
        createdDate: '2024-01-10',
        createdBy: 'Jane Smith',
        status: 'active'
      },
      {
        id: '3',
        name: 'Creative Artists',
        description: 'A space for artists to share and collaborate',
        category: 'Arts',
        avatar: '',
        coverImage: '',
        memberCount: 567,
        postCount: 890,
        isPrivate: false,
        isFeatured: false,
        isVerified: false,
        createdDate: '2023-12-20',
        createdBy: 'Bob Wilson',
        status: 'pending'
      }
    ];
    
    setTimeout(() => {
      setTribes(mockTribes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTribes = tribes.filter(tribe => {
    const matchesSearch = tribe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tribe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tribe.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || tribe.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTribeAction = (tribeId: string, action: string) => {
    console.log(`Action ${action} for tribe ${tribeId}`);
    // Implement tribe actions here
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tribe Management</h1>
          <p className="text-muted-foreground">Manage communities, categories, and moderation.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Tribe
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">234</div>
            <div className="text-sm text-muted-foreground">Total Tribes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">198</div>
            <div className="text-sm text-muted-foreground">Active Tribes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">21</div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Tribes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tribes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tribes Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tribe</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTribes.map((tribe) => (
                  <TableRow key={tribe.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={tribe.avatar} />
                          <AvatarFallback>{tribe.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tribe.name}</span>
                            {tribe.isVerified && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                            {tribe.isFeatured && (
                              <Star className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {tribe.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={tribe.isPrivate ? "secondary" : "outline"} className="text-xs">
                              {tribe.isPrivate ? 'Private' : 'Public'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tribe.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {tribe.memberCount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{tribe.postCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tribe.status)}>
                        {tribe.status.charAt(0).toUpperCase() + tribe.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{tribe.createdDate}</div>
                        <div className="text-muted-foreground">by {tribe.createdBy}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTribeAction(tribe.id, 'view')}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Tribe
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTribeAction(tribe.id, 'edit')}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTribeAction(tribe.id, 'feature')}>
                            <Star className="mr-2 h-4 w-4" />
                            {tribe.isFeatured ? 'Unfeature' : 'Feature'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTribeAction(tribe.id, 'verify')}>
                            <Crown className="mr-2 h-4 w-4" />
                            {tribe.isVerified ? 'Unverify' : 'Verify'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleTribeAction(tribe.id, 'delete')}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TribeManagement;