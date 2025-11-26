"use client";

import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types/user';
import { UserProfileModal } from './UserProfileModal';
import { API_ENDPOINTS, buildUrl } from '@/constants/apiEndpoints';

interface UserRow {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  lastActiveAt?: string;
  profileCompletion?: number;
  opportunitiesViewed?: number;
  opportunitiesApplied?: number;
  opportunitiesCreated?: number;
  permissions?: string[];
}

const defaultForm = {
  email: '',
  role: 'student',
  firstName: '',
  lastName: '',
  password: '', // Only for admin creation
  permissions: [] as string[],
};

const TABS = [
  { value: 'student', label: 'Students' },
  { value: 'parent', label: 'Parents' },
  { value: 'organizer', label: 'Organizers' },
  { value: 'admin_manager', label: 'Admin Managers' },
];

const ALL_PERMISSIONS = [
  'view_users', 'create_users', 'edit_users', 'delete_users',
  'view_opportunities', 'create_opportunities', 'edit_opportunities', 'delete_opportunities',
  'view_analytics', 'manage_settings'
];

export function UsersManager() {
  const [activeTab, setActiveTab] = useState('student');
  const [items, setItems] = useState<UserRow[]>([]);
  const [formState, setFormState] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const loadItems = useCallback(async (role: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = buildUrl(API_ENDPOINTS.admin.users, { role });
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to load users');
      }
      const payload = await response.json();
      setItems(
        (payload.items ?? []).map((item: any) => ({
          id: item.id,
          email: item.email ?? '',
          role: item.role ?? 'student',
          firstName: item.firstName ?? item.first_name ?? '',
          lastName: item.lastName ?? item.last_name ?? '',
          createdAt: item.createdAt,
          lastActiveAt: item.lastActiveAt,
          profileCompletion: item.profileCompletion,
          opportunitiesViewed: item.opportunitiesViewed,
          opportunitiesApplied: item.opportunitiesApplied,
          opportunitiesCreated: item.opportunitiesCreated,
          permissions: item.permissions ?? [],
        })),
      );
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems(activeTab);
    setFormState(prev => ({ ...defaultForm, role: activeTab }));
    setShowCreateForm(false);
    setEditingId(null);
  }, [activeTab, loadItems]);

  const handleReset = () => {
    setEditingId(null);
    setFormState({ ...defaultForm, role: activeTab });
    setShowCreateForm(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const endpoint = editingId
        ? API_ENDPOINTS.admin.userById(editingId)
        : API_ENDPOINTS.admin.users;

      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Request failed');
      }
      await loadItems(activeTab);
      handleReset();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: UserRow) => {
    setEditingId(item.id);
    setFormState({
      email: item.email,
      role: item.role,
      firstName: item.firstName,
      lastName: item.lastName,
      password: '',
      permissions: item.permissions ?? [],
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user document?')) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.admin.userById(id), { method: 'DELETE' });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to delete');
      }
      await loadItems(activeTab);
      if (editingId === id) {
        handleReset();
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (permission: string) => {
    setFormState(prev => {
      const current = prev.permissions;
      if (current.includes(permission)) {
        return { ...prev, permissions: current.filter(p => p !== permission) };
      } else {
        return { ...prev, permissions: [...current, permission] };
      }
    });
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-950/50 p-1">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Button onClick={() => setShowCreateForm(!showCreateForm)} variant={showCreateForm ? "secondary" : "default"}>
            {showCreateForm ? 'Cancel' : `Create ${TABS.find(t => t.value === activeTab)?.label.slice(0, -1)}`}
          </Button>
        </div>

        {showCreateForm && (
          <section className="mb-8 rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-semibold text-foreground dark:text-white mb-4">
              {editingId ? 'Edit User' : `Create New ${TABS.find(t => t.value === activeTab)?.label.slice(0, -1)}`}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="user-email">
                  Email *
                </label>
                <Input
                  id="user-email"
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  placeholder="user@example.com"
                  className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="user-first">
                  First name
                </label>
                <Input
                  id="user-first"
                  value={formState.firstName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, firstName: event.target.value }))}
                  className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="user-last">
                  Last name
                </label>
                <Input
                  id="user-last"
                  value={formState.lastName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, lastName: event.target.value }))}
                  className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
                />
              </div>

              {(activeTab === 'admin_manager' || activeTab === 'superadmin') && !editingId && (
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="user-password">
                    Password *
                  </label>
                  <Input
                    id="user-password"
                    type="password"
                    value={formState.password}
                    onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                    required={!editingId}
                    placeholder="Set a strong password"
                    className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
                  />
                  <p className="text-xs text-muted-foreground">Required for admin access.</p>
                </div>
              )}

              {activeTab === 'admin_manager' && (
                <div className="md:col-span-2 space-y-3 border-t border-border/60 dark:border-white/10 pt-4 mt-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ALL_PERMISSIONS.map((perm) => (
                      <div key={perm} className="flex items-center space-x-2">
                        <Checkbox
                          id={`perm-${perm}`}
                          checked={formState.permissions.includes(perm)}
                          onCheckedChange={() => togglePermission(perm)}
                        />
                        <Label htmlFor={`perm-${perm}`} className="text-sm text-foreground dark:text-slate-300 cursor-pointer capitalize">
                          {perm.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex items-center gap-3 mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleReset} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
              {error && (
                <p className="md:col-span-2 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
            </form>
          </section>
        )}

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground dark:text-white">{tab.label} List</h2>
                <Button variant="outline" size="sm" onClick={() => loadItems(activeTab)} disabled={isLoading}>
                  Refresh
                </Button>
              </div>

              <div className="overflow-hidden rounded-xl border border-border/60 dark:border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-card/80 dark:bg-white/5 hover:bg-card/80 dark:bg-white/5">
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Active</TableHead>
                      {activeTab === 'student' && <TableHead>Profile %</TableHead>}
                      {activeTab === 'student' && <TableHead>Opp. Viewed</TableHead>}
                      {activeTab === 'student' && <TableHead>Opp. Applied</TableHead>}
                      {activeTab === 'organizer' && <TableHead>Opp. Created</TableHead>}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No {tab.label.toLowerCase()} found.
                        </TableCell>
                      </TableRow>
                    )}
                    {items.map((item) => (
                      <TableRow key={item.id} className="hover:bg-card/80 dark:bg-white/5">
                        <TableCell className="font-medium text-foreground dark:text-white">{item.email}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {[item.firstName, item.lastName].filter(Boolean).join(' ') || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/20 text-foreground dark:text-white capitalize">
                            {item.role === 'business' ? 'Organizer' : item.role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {item.lastActiveAt ? new Date(item.lastActiveAt).toLocaleDateString() : 'Never'}
                        </TableCell>
                        {activeTab === 'student' && (
                          <TableCell className="text-muted-foreground text-sm">
                            {item.profileCompletion}%
                          </TableCell>
                        )}
                        {activeTab === 'student' && (
                          <TableCell className="text-muted-foreground text-sm">
                            {item.opportunitiesViewed}
                          </TableCell>
                        )}
                        {activeTab === 'student' && (
                          <TableCell className="text-muted-foreground text-sm">
                            {item.opportunitiesApplied}
                          </TableCell>
                        )}
                        {activeTab === 'organizer' && (
                          <TableCell className="text-muted-foreground text-sm">
                            {item.opportunitiesCreated}
                          </TableCell>
                        )}
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(item)}
                            disabled={isSubmitting}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            disabled={isSubmitting}
                          >
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} disabled={isSubmitting}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          </TabsContent>
        ))}
      </Tabs>

      <UserProfileModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
