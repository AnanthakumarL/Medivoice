  import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, AlertTriangle, Info, CheckCircle, X, Eye, Trash2, Settings } from 'lucide-react';
import { adminNotifications } from '@/lib/adminMockData';

interface AdminNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onDeleteNotification: (notificationId: string) => void;
}

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({
  isOpen,
  onClose,
  onMarkAsRead,
  onDeleteNotification
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'success': return 'bg-green-100 text-green-700 border-green-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredNotifications = adminNotifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'urgent') return notification.type === 'urgent';
    return true;
  });

  const unreadCount = adminNotifications.filter(n => !n.read).length;
  const urgentCount = adminNotifications.filter(n => n.type === 'urgent').length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-50 relative">
        <DialogHeader className="flex items-center">
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-600" />
            Admin Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-700 border-red-200">
                {unreadCount} unread
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b pb-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({adminNotifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'urgent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('urgent')}
          >
            Urgent ({urgentCount})
          </Button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`transition-all duration-200 ${
                  getNotificationColor(notification.type)
                } ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-slate-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge className={getBadgeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {unreadCount > 0 && (
              <Button 
                onClick={() => {
                  adminNotifications.forEach(n => {
                    if (!n.read) onMarkAsRead(n.id);
                  });
                }}
              >
                Mark All as Read
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};