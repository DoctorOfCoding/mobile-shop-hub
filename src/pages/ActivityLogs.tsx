import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, RefreshCw, Activity, LogIn, LogOut, ShoppingCart, Wrench, Smartphone, Package } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  user_id: string | null;
  username: string;
  role: string;
  action_type: string;
  description: string;
  item_id: string | null;
  item_type: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const actionIcons: Record<string, React.ReactNode> = {
  LOGIN: <LogIn className="w-4 h-4" />,
  LOGOUT: <LogOut className="w-4 h-4" />,
  SALE: <ShoppingCart className="w-4 h-4" />,
  REPAIR: <Wrench className="w-4 h-4" />,
  USED_PHONE: <Smartphone className="w-4 h-4" />,
  INVENTORY: <Package className="w-4 h-4" />,
  DEFAULT: <Activity className="w-4 h-4" />,
};

const actionColors: Record<string, string> = {
  LOGIN: 'bg-success/10 text-success',
  LOGOUT: 'bg-muted text-muted-foreground',
  SALE: 'bg-primary/10 text-primary',
  REPAIR: 'bg-warning/10 text-warning',
  USED_PHONE: 'bg-info/10 text-info',
  INVENTORY: 'bg-accent/10 text-accent',
  RESTRICTED: 'bg-destructive/10 text-destructive',
  DEFAULT: 'bg-secondary text-secondary-foreground',
};

export default function ActivityLogs() {
  const { isAdmin, user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    // If not admin, only show own logs
    if (!isAdmin && user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setLogs(data as ActivityLog[]);
      
      // Extract unique users for filter
      const uniqueUsers = [...new Map(data?.map(log => [log.user_id, { id: log.user_id || '', username: log.username }])).values()];
      setUsers(uniqueUsers.filter(u => u.id));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [isAdmin, user]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action_type === filterAction;
    const matchesUser = filterUser === 'all' || log.user_id === filterUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const getActionIcon = (actionType: string) => {
    return actionIcons[actionType] || actionIcons.DEFAULT;
  };

  const getActionColor = (actionType: string) => {
    return actionColors[actionType] || actionColors.DEFAULT;
  };

  const uniqueActions = [...new Set(logs.map(log => log.action_type))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            {isAdmin ? 'All Activity Logs' : 'My Activity'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Monitor all user activities and actions' : 'View your activity history'}
          </p>
        </div>
        <Button onClick={fetchLogs} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAdmin && (
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Activity History
            <Badge variant="secondary" className="ml-2">
              {filteredLogs.length} records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  {isAdmin && <TableHead>User</TableHead>}
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8 text-muted-foreground">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {format(new Date(log.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'HH:mm:ss')}
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {log.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{log.username}</div>
                              <Badge variant="outline" className="text-xs">
                                {log.role === 'admin' ? 'Manager' : 'Employee'}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge className={getActionColor(log.action_type)}>
                          <span className="mr-1">{getActionIcon(log.action_type)}</span>
                          {log.action_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.description}
                      </TableCell>
                      <TableCell>
                        {log.item_type && log.item_id ? (
                          <span className="text-xs text-muted-foreground">
                            {log.item_type}: {log.item_id.substring(0, 8)}...
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
