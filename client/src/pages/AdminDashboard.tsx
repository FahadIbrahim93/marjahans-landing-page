import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  RefreshCw,
  Package,
  BarChart3,
  Settings,
  AlertCircle,
  CheckCheckIcon,
  Download,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

interface SyncStatus {
  isRunning: boolean;
  lastSyncTime?: string;
  productCount: number;
  syncedCount: number;
  error?: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    productCount: 0,
    syncedCount: 0,
  });

  // Check if user is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Fetch dashboard data
  const { data: conversations } = trpc.chat.getActiveConversations.useQuery();
  const { data: products } = trpc.products.getProducts.useQuery({ limit: 100 });

  // Facebook extraction mutation
  const extractionMutation =
    trpc.facebookExtraction.extractAndPopulate.useMutation({
      onSuccess: data => {
        setSyncStatus({
          isRunning: false,
          lastSyncTime: new Date().toLocaleString(),
          productCount: data.extracted,
          syncedCount: data.synced,
        });
        alert(
          `Success! Extracted ${data.extracted} products and synced ${data.synced} to your catalog.`
        );
      },
      onError: error => {
        setSyncStatus(prev => ({
          ...prev,
          isRunning: false,
          error: error.message,
        }));
        alert(`Extraction failed: ${error.message}`);
      },
    });

  // Facebook sync mutation
  const syncMutation = trpc.facebookSync.syncProducts.useMutation({
    onSuccess: data => {
      setSyncStatus({
        isRunning: false,
        lastSyncTime: new Date().toLocaleString(),
        productCount: data.totalProducts,
        syncedCount: data.syncedCount,
      });
      alert(`✓ Synced ${data.syncedCount} products from Facebook Shop`);
    },
    onError: error => {
      setSyncStatus(prev => ({
        ...prev,
        isRunning: false,
        error: error.message,
      }));
      alert(`✗ Sync Failed: ${error.message}`);
    },
  });

  const handleSync = async () => {
    setSyncStatus(prev => ({ ...prev, isRunning: true }));
    await syncMutation.mutateAsync();
  };

  const handleExtraction = async () => {
    setSyncStatus(prev => ({ ...prev, isRunning: true }));
    await extractionMutation.mutateAsync();
  };

  const activeChats =
    conversations?.filter((c: any) => c.status === "active").length || 0;
  const waitingChats =
    conversations?.filter((c: any) => c.status === "waiting").length || 0;
  const totalChats = conversations?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.name}! Manage your business operations
                here.
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              {syncStatus.lastSyncTime && (
                <p>Last sync: {syncStatus.lastSyncTime}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Chats
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeChats}</div>
              <p className="text-xs text-gray-500">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitingChats}</div>
              <p className="text-xs text-gray-500">Need response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChats}</div>
              <p className="text-xs text-gray-500">All conversations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-gray-500">In catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Synced</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{syncStatus.syncedCount}</div>
              <p className="text-xs text-gray-500">From Facebook</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="facebook" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="facebook">Facebook Shop</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Facebook Shop Tab */}
          <TabsContent value="facebook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  Facebook Shop Integration
                </CardTitle>
                <CardDescription>
                  Sync products from your Facebook Shop to your e-commerce
                  catalog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sync Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Sync Status
                      </h4>
                      {syncStatus.isRunning ? (
                        <p className="text-sm text-blue-700 mt-1 flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Syncing products from Facebook...
                        </p>
                      ) : syncStatus.lastSyncTime ? (
                        <div className="text-sm text-blue-700 mt-1 space-y-1">
                          <p>✓ Last sync: {syncStatus.lastSyncTime}</p>
                          <p>✓ Synced: {syncStatus.syncedCount} products</p>
                        </div>
                      ) : (
                        <p className="text-sm text-blue-700 mt-1">
                          No sync performed yet. Click "Start Sync" to begin.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {syncStatus.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900">
                          Sync Error
                        </h4>
                        <p className="text-sm text-red-700 mt-1">
                          {syncStatus.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sync Controls */}
                <Button
                  onClick={handleExtraction}
                  disabled={syncStatus.isRunning}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  {syncStatus.isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4" />
                      Extract from Posts
                    </>
                  )}
                </Button>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSync}
                    disabled={syncStatus.isRunning}
                    className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
                  >
                    {syncStatus.isRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Sync from Facebook Shop
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Products
                  </Button>
                </div>

                {/* Sync Statistics */}
                {syncStatus.syncedCount > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {syncStatus.syncedCount}
                      </div>
                      <p className="text-sm text-gray-600">
                        Successfully Synced
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {syncStatus.productCount}
                      </div>
                      <p className="text-sm text-gray-600">Total on Facebook</p>
                    </div>
                  </div>
                )}

                {/* Synced Products List */}
                {syncStatus.syncedCount > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">
                      Recently Synced Products
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {products?.slice(0, 5).map((product: any) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{(product.price / 100).toFixed(2)}
                            </p>
                          </div>
                          <CheckCheckIcon className="h-4 w-4 text-green-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Facebook Connection Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Connection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Facebook Page:</span>
                  <span className="font-medium">Marjahans Jewellery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Connected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Verified:</span>
                  <span className="font-medium">Today</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Active Conversations</CardTitle>
                  <CardDescription>
                    {conversations?.length || 0} chats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {conversations && conversations.length > 0 ? (
                    conversations.map((conv: any) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          selectedConversation === conv.id
                            ? "border-amber-600 bg-amber-50"
                            : "border-gray-200 hover:border-amber-300"
                        }`}
                      >
                        <p className="font-semibold text-sm text-gray-900">
                          {conv.visitorName || "Guest"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.visitorEmail}
                        </p>
                        {conv.cartValue > 0 && (
                          <p className="text-xs text-amber-600 font-semibold">
                            Cart: ₹{(conv.cartValue / 100).toFixed(2)}
                          </p>
                        )}
                        {conv.status === "waiting" && (
                          <p className="text-xs text-red-600 font-semibold mt-1">
                            ⚠ Waiting for response
                          </p>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No active conversations
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Chat Messages</CardTitle>
                  <CardDescription>
                    {selectedConversation
                      ? "Selected conversation"
                      : "Select a conversation to view messages"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedConversation ? (
                    <div className="space-y-4 h-96 overflow-y-auto">
                      <p className="text-gray-500 text-sm">
                        Chat interface would display messages here
                      </p>
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
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-amber-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  Latest orders from your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">
                    Orders feature coming soon. Track orders from chat
                    conversations.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Order Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">₹0</div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Widget Settings</CardTitle>
                <CardDescription>
                  Configure your chat widget appearance and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Widget Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., How can we help?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-600"
                    defaultValue="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Widget Color
                  </label>
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
                    <span className="text-sm font-semibold text-gray-900">
                      Enable cart abandonment detection
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Abandonment delay (seconds)
                  </label>
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

            {/* Facebook Connection Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Facebook Shop Settings</CardTitle>
                <CardDescription>
                  Manage your Facebook Shop integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Facebook Shop Connected</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Auto-sync Interval
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-600">
                    <option>Every 6 hours</option>
                    <option>Every 12 hours</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Manual only</option>
                  </select>
                </div>
                <Button variant="outline" className="w-full">
                  Disconnect Facebook Shop
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
