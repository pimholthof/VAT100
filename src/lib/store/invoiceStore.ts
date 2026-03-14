import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { Invoice, InvoiceInsert, InvoiceUpdate, InvoiceLine, InvoiceLineInsert } from '@/types';

interface InvoiceState {
  invoices: Invoice[];
  invoiceLines: InvoiceLine[];
  loading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  fetchInvoiceLines: (invoiceId: string) => Promise<void>;
  addInvoice: (invoice: InvoiceInsert) => Promise<string | null>;
  updateInvoice: (invoice: InvoiceUpdate) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  addInvoiceLine: (line: InvoiceLineInsert) => Promise<void>;
  deleteInvoiceLine: (id: string) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  invoiceLines: [],
  loading: false,
  error: null,

  fetchInvoices: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('issue_date', { ascending: false });
    set({
      invoices: (data as Invoice[]) ?? [],
      loading: false,
      error: error?.message ?? null,
    });
  },

  fetchInvoiceLines: async (invoiceId) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('invoice_lines')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('sort_order', { ascending: true });
    set({
      invoiceLines: (data as InvoiceLine[]) ?? [],
      loading: false,
      error: error?.message ?? null,
    });
  },

  addInvoice: async (invoice) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return null;
    }
    const newInvoice = data as Invoice;
    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
      loading: false,
    }));
    return newInvoice.id;
  },

  updateInvoice: async ({ id, ...updates }) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? (data as Invoice) : inv)),
      loading: false,
    }));
  },

  deleteInvoice: async (id) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
      loading: false,
    }));
  },

  addInvoiceLine: async (line) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('invoice_lines')
      .insert(line)
      .select()
      .single();
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      invoiceLines: [...state.invoiceLines, data as InvoiceLine],
      loading: false,
    }));
  },

  deleteInvoiceLine: async (id) => {
    set({ loading: true, error: null });
    const { error } = await supabase.from('invoice_lines').delete().eq('id', id);
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set((state) => ({
      invoiceLines: state.invoiceLines.filter((l) => l.id !== id),
      loading: false,
    }));
  },
}));
