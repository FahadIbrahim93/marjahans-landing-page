import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, ShoppingCart, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Fetch dashboard data
  const { data: conversations } = trpc.chat.getActiveConversations.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Manage your business operations here.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations?.filter((c: any) => c.status === 'active').length || 0}</div>
              <p className="text-xs text-gray-500">Conversations in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations?.filter((c: any) => c.status === 'waiting').length || 0}</div>
              <p className="text-xs text-gray-500">Waiting for response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations?.length || 0}</div>
              <p className="text-xs text-gray-500">Active chats</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed Chats</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Resolved today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Active Conversations</CardTitle>
                  <CardDescription>{conversations?.length || 0} chats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {conversations && conversations.length > 0 ? (
                    conversations.map((conv: any) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          selectedConversation === conv.id
                            ? 'border-amber-600 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <p className="font-semibold text-sm text-gray-900">{conv.visitorName || 'Guest'}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.visitorEmail}</p>
                        {conv.cartValue > 0 && (
                          <p className="text-xs text-amber-600 font-semibold">Cart: ₹{(conv.cartValue / 100).toFixed(2)}</p>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No active conversations</p>
                  )}
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Chat Messages</CardTitle>
                  <CardDescription>
                    {selectedConversation ? 'Selected conversation' : 'Select a conversation to view messages'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedConversation ? (
                    <div className="space-y-4 h-96 overflow-y-auto">
                      <p className="text-gray-500 text-sm">Chat interface would display messages here</p>
                      {/* Messages would be rendered here */}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <p>Select a conversation to view messages</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">Orders feature coming soon. Track orders from chat conversations.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Widget Settings</CardTitle>
                <CardDescription>Configure your chat widget appearance and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Widget Title</label>
                  <input
                    type="text"
                    placeholder="e.g., How can we help?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-600"
                    defaultValue="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Widget Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      defaultValue="#F59E0B"
                      className="w-12 h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#F59E0B"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-600"
                      defaultValue="#F59E0B"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm font-semibold text-gray-900">Enable cart abandonment detection</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Abandonment delay (seconds)</label>
                  <input
                    type="number"
                    defaultValue="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>

                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
