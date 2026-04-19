// ── Supabase Database Service ──
// Replace in-memory data with a real Postgres database
// Setup: npm install @supabase/supabase-js
// Create a free project at https://supabase.com

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── SQL to run in Supabase dashboard (Schema setup) ──
/*
create table reports (
  id          text primary key,
  lat         float not null,
  lng         float not null,
  type        text not null,
  description text,
  status      text default 'Submitted',
  priority    text default 'medium',
  zone        text,
  assignee    text,
  image_url   text,
  created_at  timestamptz default now()
);

create table schedules (
  id      serial primary key,
  date    date not null,
  title   text not null,
  types   text[] not null,
  route   text not null,
  time    text not null
);

create table notifications (
  id         serial primary key,
  user_id    text,
  title      text not null,
  type       text not null,
  read       boolean default false,
  created_at timestamptz default now()
);
*/

// ── Reports ──
export async function fetchReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createReport({ lat, lng, type, description, zone, imageFile }) {
  let image_url = null;

  // Upload image to Supabase Storage if provided
  if (imageFile) {
    const ext      = imageFile.name.split('.').pop();
    const filename = `${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('report-images')
      .upload(filename, imageFile);
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('report-images').getPublicUrl(filename);
      image_url = urlData.publicUrl;
    }
  }

  const id = 'WM-' + Math.floor(4800 + Math.random() * 1000);
  const { data, error } = await supabase.from('reports').insert([
    { id, lat, lng, type, description, zone, image_url, status: 'Submitted' }
  ]).select().single();
  if (error) throw error;
  return data;
}

export async function updateReportStatus(id, status) {
  const { data, error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function assignReport(id, assignee) {
  const { data, error } = await supabase
    .from('reports')
    .update({ assignee, status: 'Assigned' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Schedule ──
export async function fetchSchedule() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .gte('date', today)
    .order('date');
  if (error) throw error;
  return data;
}

// ── Notifications ──
export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}

export async function markNotificationRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  if (error) throw error;
}

// ── Real-time subscription for new reports ──
export function subscribeToReports(callback) {
  return supabase
    .channel('reports-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, callback)
    .subscribe();
}
