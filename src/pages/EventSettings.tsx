import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CalendarPlus, 
  Calendar, 
  History, 
  Settings, 
  Bell, 
  Mail, 
  Shield, 
  Clock,
  Users,
  Globe,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventSettings() {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    attendeeUpdates: true,
    
    // Default Event Settings
    defaultDuration: '60',
    defaultVisibility: 'private',
    defaultCapacity: '',
    autoApprove: false,
    
    // Privacy Settings
    showEventHistory: true,
    allowPublicProfile: false,
    showAttendeeList: true,
    
    // Time Zone & Language
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Your event settings have been updated successfully.",
    });
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        emailNotifications: true,
        pushNotifications: true,
        eventReminders: true,
        attendeeUpdates: true,
        defaultDuration: '60',
        defaultVisibility: 'private',
        defaultCapacity: '',
        autoApprove: false,
        showEventHistory: true,
        allowPublicProfile: false,
        showAttendeeList: true,
        timezone: 'UTC',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      });
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Event Settings</h1>
          </div>
          <Button onClick={() => navigate('/create-event')}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button 
                  onClick={() => navigate('/create-event')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <CalendarPlus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
                <button 
                  onClick={() => navigate('/my-events')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>My Events</span>
                </button>
                <button 
                  onClick={() => navigate('/event-history')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <History className="h-4 w-4" />
                  <span>Event History</span>
                </button>
                <div className="flex items-center gap-3 p-3 bg-primary/10 text-primary rounded-lg">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Settings</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <Tabs defaultValue="notifications" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="defaults">Defaults</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  {/* Notification Settings */}
                  <TabsContent value="notifications" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Notification Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email updates about your events
                          </p>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Get real-time notifications on your device
                          </p>
                        </div>
                        <Switch
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Event Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatic reminders before events start
                          </p>
                        </div>
                        <Switch
                          checked={settings.eventReminders}
                          onCheckedChange={(checked) => handleSettingChange('eventReminders', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Attendee Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications when people join or leave your events
                          </p>
                        </div>
                        <Switch
                          checked={settings.attendeeUpdates}
                          onCheckedChange={(checked) => handleSettingChange('attendeeUpdates', checked)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Default Settings */}
                  <TabsContent value="defaults" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarPlus className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Default Event Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="defaultDuration">Default Duration</Label>
                        <Select value={settings.defaultDuration} onValueChange={(value) => handleSettingChange('defaultDuration', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="180">3 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="defaultVisibility">Default Visibility</Label>
                        <Select value={settings.defaultVisibility} onValueChange={(value) => handleSettingChange('defaultVisibility', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="members">Tribe Members Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="defaultCapacity">Default Capacity</Label>
                        <Input
                          id="defaultCapacity"
                          type="number"
                          placeholder="Leave blank for unlimited"
                          value={settings.defaultCapacity}
                          onChange={(e) => handleSettingChange('defaultCapacity', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-approve Attendees</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically approve new attendee requests
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoApprove}
                        onCheckedChange={(checked) => handleSettingChange('autoApprove', checked)}
                      />
                    </div>
                  </TabsContent>

                  {/* Privacy Settings */}
                  <TabsContent value="privacy" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Privacy Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Event History</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow others to see your past events
                          </p>
                        </div>
                        <Switch
                          checked={settings.showEventHistory}
                          onCheckedChange={(checked) => handleSettingChange('showEventHistory', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Public Profile</Label>
                          <p className="text-sm text-muted-foreground">
                            Make your event organizer profile public
                          </p>
                        </div>
                        <Switch
                          checked={settings.allowPublicProfile}
                          onCheckedChange={(checked) => handleSettingChange('allowPublicProfile', checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Attendee Lists</Label>
                          <p className="text-sm text-muted-foreground">
                            Display attendee lists to other participants
                          </p>
                        </div>
                        <Switch
                          checked={settings.showAttendeeList}
                          onCheckedChange={(checked) => handleSettingChange('showAttendeeList', checked)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Preferences */}
                  <TabsContent value="preferences" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Language & Regional Preferences</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="GMT+1">GMT+1 (Lagos)</SelectItem>
                            <SelectItem value="GMT+2">GMT+2 (Cairo)</SelectItem>
                            <SelectItem value="GMT+3">GMT+3 (Nairobi)</SelectItem>
                            <SelectItem value="EST">EST (New York)</SelectItem>
                            <SelectItem value="PST">PST (Los Angeles)</SelectItem>
                            <SelectItem value="GMT">GMT (London)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                            <SelectItem value="sw">Swahili</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timeFormat">Time Format</Label>
                        <Select value={settings.timeFormat} onValueChange={(value) => handleSettingChange('timeFormat', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12 Hour</SelectItem>
                            <SelectItem value="24h">24 Hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Save/Reset Actions */}
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={handleResetSettings}>
                    Reset to Default
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}