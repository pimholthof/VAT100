import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Profile, ProfileUpdate } from '@/types';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: ProfileUpdate) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false, error: 'Not authenticated' });
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    set({
      profile: (data as Profile) ?? null,
      loading: false,
      error: error?.message ?? null,
    });
  },

  updateProfile: async ({ id, ...updates }) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set({ profile: data as Profile, loading: false });
  },
}));
