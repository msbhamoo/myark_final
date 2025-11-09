"use client";

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface UserRow {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

const defaultForm = {
  email: '',
  role: 'student',
  firstName: '',
  lastName: '',
};

const roleOptions = ['student', 'parent', 'business', 'organizer', 'school_admin', 'site_admin'];

export function UsersManager() {
  const [items, setItems] = useState<UserRow[]>([]);
  const [formState, setFormState] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/users');
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
        })),
      );
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleReset = () => {
    setEditingId(null);
    setFormState(defaultForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(editingId ? `/api/admin/users/${editingId}` : '/api/admin/users', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Request failed');
      }
      await loadItems();
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
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user document?')) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to delete');
      }
      await loadItems();
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

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit user' : 'Create user'}</h2>
        <p className="mt-1 text-sm text-slate-300">
          These records live in Firestore. For Firebase Auth users, make sure roles match any custom claims.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="user-email">
              Email *
            </label>
            <Input
              id="user-email"
              type="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              required
              placeholder="student@example.com"
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="user-role">
              Role
            </label>
            <select
              id="user-role"
              value={formState.role}
              onChange={(event) => setFormState((prev) => ({ ...prev, role: event.target.value }))}
              className="h-10 rounded-md border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="user-first">
              First name
            </label>
            <Input
              id="user-first"
              value={formState.firstName}
              onChange={(event) => setFormState((prev) => ({ ...prev, firstName: event.target.value }))}
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="user-last">
              Last name
            </label>
            <Input
              id="user-last"
              value={formState.lastName}
              onChange={(event) => setFormState((prev) => ({ ...prev, lastName: event.target.value }))}
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={handleReset} disabled={isSubmitting}>
                Cancel edit
              </Button>
            )}
          </div>
          {error && (
            <p className="md:col-span-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <Button variant="outline" size="sm" onClick={loadItems} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        <p className="mt-1 text-sm text-slate-300">
          {isLoading ? 'Loading users...' : `Showing ${items.length} record(s).`}
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5 hover:bg-white/5">
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-400">
                    No user documents found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-white/5">
                  <TableCell className="font-medium text-slate-100">{item.email}</TableCell>
                  <TableCell className="text-slate-300">
                    {[item.firstName, item.lastName].filter(Boolean).join(' ') || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-slate-200">
                      {item.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      disabled={isSubmitting && editingId === item.id}
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
    </div>
  );
}
