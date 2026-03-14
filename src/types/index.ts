/**
 * Central type re-exports.
 * All types originate from '@/types/database' (single source of truth).
 */
export type {
  InvoiceStatus,
  InvoiceSentVia,
  InvoiceLineUnit,
  Profile,
  Client,
  Invoice,
  InvoiceLine,
  Receipt,
  ProfileInsert,
  ClientInsert,
  InvoiceInsert,
  InvoiceLineInsert,
  ReceiptInsert,
  ProfileUpdate,
  ClientUpdate,
  InvoiceUpdate,
  InvoiceLineUpdate,
  ReceiptUpdate,
  InvoiceData,
} from './database';
