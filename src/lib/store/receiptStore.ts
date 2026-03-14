import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Receipt, ReceiptInsert, ReceiptUpdate } from '@/types';

interface ReceiptState {
  receipts: Receipt[];
  loading: boolean;
  error: string | null;
  fetchReceipts: () => Promise<void>;
  addReceipt: (receipt: ReceiptInsert) => Promise<void>;
  updateReceipt: (receipt: ReceiptUpdate) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
}

export const useReceiptStore = create<ReceiptState>((set) => ({
  receipts: [],
  loading: false,
  error: null,

  fetchReceipts: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .order('receipt_date', { ascending: false });
    set({
      receipts: (data as Receipt[]) ?? [],
      loading: false,
      error: error?.message ?? null,
    });
  },

  addReceipt: async (receipt) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('receipts')
      .insert(receipt)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      receipts: [data as Receipt, ...state.receipts],
      loading: false,
    }));
  },

  updateReceipt: async ({ id, ...updates }) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('receipts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      receipts: state.receipts.map((r) => (r.id === id ? (data as Receipt) : r)),
      loading: false,
    }));
  },

  deleteReceipt: async (id) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from('receipts').delete().eq('id', id);
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      receipts: state.receipts.filter((r) => r.id !== id),
      loading: false,
    }));
  },
}));
