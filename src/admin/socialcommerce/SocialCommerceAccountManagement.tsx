import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, UserPlus, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialCommerceAccount {
  id: string;
  account_name: string;
  description: string | null;
  assigned_user_id: string;
  created_by_admin_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  settings: any;
}

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const SocialCommerceAccountManagement = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialCommerceAccount[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    account_name: '',
    description: '',
    assigned_user_id: '',
    is_active: true
  });

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_commerce_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load social commerce accounts',
        variant: 'destructive'
      });
    }
  };

  // Fetch users (in a real app, this would come from your user management system)
  const fetchUsers = async () => {
    // Since we're using Firebase Auth, we'll need to get users from your user_roles table
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id')
        .neq('role', 'admin');

      if (error) throw error;
      
      // Transform the data - in production you'd fetch more user details
      const mockUsers = (data || []).map(u => ({
        uid: u.user_id,
        email: `user-${u.user_id.substring(0, 8)}@example.com`,
        displayName: `User ${u.user_id.substring(0, 8)}`
      }));
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAccounts(), fetchUsers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCreateAccount = async () => {
    if (!formData.account_name || !formData.assigned_user_id) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('social_commerce_accounts')
        .insert({
          account_name: formData.account_name,
          description: formData.description,
          assigned_user_id: formData.assigned_user_id,
          created_by_admin_id: currentUser?.uid || '',
          is_active: formData.is_active
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Social Commerce account created successfully'
      });

      setDialogOpen(false);
      setFormData({
        account_name: '',
        description: '',
        assigned_user_id: '',
        is_active: true
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('social_commerce_accounts')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Account ${!isActive ? 'activated' : 'deactivated'}`
      });

      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to update account',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const { error } = await supabase
        .from('social_commerce_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Account deleted successfully'
      });

      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive'
      });
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Social Commerce Account Management
          </h1>
          <p className="text-muted-foreground">Create and assign Social Commerce accounts to users</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Social Commerce Account</DialogTitle>
              <DialogDescription>
                Assign a Social Commerce account to a user to grant them access to the feature.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="account_name">Account Name *</Label>
                <Input
                  id="account_name"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  placeholder="e.g., John's Store"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the account"
                />
              </div>
              <div>
                <Label htmlFor="assigned_user">Assign to User *</Label>
                <Select
                  value={formData.assigned_user_id}
                  onValueChange={(value) => setFormData({ ...formData, assigned_user_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.uid} value={user.uid}>
                        {user.displayName || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAccount}>
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{accounts.length}</div>
            <div className="text-sm text-muted-foreground">Total Accounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {accounts.filter(a => a.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Accounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {accounts.filter(a => !a.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground">Inactive Accounts</div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Social Commerce Accounts</CardTitle>
          <CardDescription>Manage all Social Commerce accounts and user assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No accounts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first Social Commerce account to get started.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Account
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.account_name}</TableCell>
                      <TableCell>{account.description || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-muted-foreground" />
                          {account.assigned_user_id.substring(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        {account.is_active ? (
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(account.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(account.id, account.is_active)}
                          >
                            <Switch checked={account.is_active} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialCommerceAccountManagement;
