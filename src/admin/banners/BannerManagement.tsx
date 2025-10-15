import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { HeaderBanner, BannerType } from "@/types/banner";
import { Plus, Edit, Trash2, Eye, MousePointer, XCircle } from "lucide-react";

export function BannerManagement() {
  const [banners, setBanners] = useState<HeaderBanner[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: 'announcement' as BannerType,
    title: '',
    message: '',
    bgColor: '',
    textColor: '',
    icon: '',
    link: '',
    linkText: '',
    imageUrl: '',
    isActive: true,
    priority: 5,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '',
    isDismissible: true,
    autoRotate: false,
    rotationInterval: 30
  });

  useEffect(() => {
    const bannersQuery = query(
      collection(db, "headerBanners"),
      orderBy("priority", "desc")
    );

    const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
      const bannersData: HeaderBanner[] = [];
      snapshot.forEach((doc) => {
        bannersData.push({ ...doc.data(), id: doc.id } as HeaderBanner);
      });
      setBanners(bannersData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bannerData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        createdBy: 'admin', // Replace with actual user
        createdAt: serverTimestamp(),
        clicks: 0,
        views: 0,
        dismissals: 0
      };

      if (editingId) {
        await updateDoc(doc(db, "headerBanners", editingId), bannerData);
        toast({ title: "Banner updated successfully" });
      } else {
        await addDoc(collection(db, "headerBanners"), bannerData);
        toast({ title: "Banner created successfully" });
      }

      resetForm();
    } catch (error) {
      toast({ title: "Error saving banner", variant: "destructive" });
      console.error(error);
    }
  };

  const handleEdit = (banner: HeaderBanner) => {
    setFormData({
      type: banner.type,
      title: banner.title,
      message: banner.message,
      bgColor: banner.bgColor || '',
      textColor: banner.textColor || '',
      icon: banner.icon || '',
      link: banner.link || '',
      linkText: banner.linkText || '',
      imageUrl: banner.imageUrl || '',
      isActive: banner.isActive,
      priority: banner.priority,
      startDate: new Date(banner.startDate).toISOString().slice(0, 16),
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
      isDismissible: banner.isDismissible,
      autoRotate: banner.autoRotate,
      rotationInterval: banner.rotationInterval || 30
    });
    setEditingId(banner.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteDoc(doc(db, "headerBanners", id));
        toast({ title: "Banner deleted successfully" });
      } catch (error) {
        toast({ title: "Error deleting banner", variant: "destructive" });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'announcement',
      title: '',
      message: '',
      bgColor: '',
      textColor: '',
      icon: '',
      link: '',
      linkText: '',
      imageUrl: '',
      isActive: true,
      priority: 5,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: '',
      isDismissible: true,
      autoRotate: false,
      rotationInterval: 30
    });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Header Banner Management</h1>
          <p className="text-muted-foreground">Manage announcements, ads, and promotional content</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Banner
          </Button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Banner' : 'Create New Banner'}</CardTitle>
            <CardDescription>Configure your header banner settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(value: BannerType) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="ad">Sponsor Ad</SelectItem>
                      <SelectItem value="mood">Mood of the Day</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Icon (emoji)</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🎉"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={formData.bgColor}
                    onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Link URL (optional)</Label>
                  <Input
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Link Text</Label>
                  <Input
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="Learn More"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isDismissible}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDismissible: checked })}
                  />
                  <Label>Dismissible</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.autoRotate}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoRotate: checked })}
                  />
                  <Label>Auto Rotate</Label>
                </div>
              </div>

              {formData.autoRotate && (
                <div className="space-y-2">
                  <Label>Rotation Interval (seconds)</Label>
                  <Input
                    type="number"
                    min="10"
                    value={formData.rotationInterval}
                    onChange={(e) => setFormData({ ...formData, rotationInterval: parseInt(e.target.value) })}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'} Banner</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{banner.type}</Badge>
                    <span className="text-sm text-muted-foreground">Priority: {banner.priority}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{banner.message}</p>
                  
                  <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {banner.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointer className="w-4 h-4" />
                      {banner.clicks || 0} clicks
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {banner.dismissals || 0} dismissals
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(banner.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
