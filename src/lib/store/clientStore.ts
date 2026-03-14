import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Client, ClientInsert, ClientUpdate } from '@/types';

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: ClientInsert) => Promise<void>;
  updateClient: (client: ClientUpdate) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    set({
      clients: (data as Client[]) ?? [],
      loading: false,
      error: error?.message ?? null,
    });
  },

  addClient: async (client) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      clients: [data as Client, ...state.clients],
      loading: false,
    }));
  },

  updateClient: async ({ id, ...updates }) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? (data as Client) : c)),
      loading: false,
    }));
  },

  deleteClient: async (id) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
      loading: false,
    }));
  },
}));
