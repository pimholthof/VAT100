/**
 * TypeScript types matching the Supabase schema in supabase/migrations/001_initial_schema.sql
 *
 * SINGLE SOURCE OF TRUTH for all database-related types.
 * All stores, components, and API calls should import from this file.
 */

// ---------------------------------------------------------------------------
// Enums / union types matching SQL CHECK constraints
// ---------------------------------------------------------------------------

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type InvoiceSentVia = 'email' | 'peppol' | 'both';

export type InvoiceLineUnit = 'uren' | 'dagen' | 'stuks';

// ---------------------------------------------------------------------------
// Row types — exact 1:1 mapping with SQL columns
// ---------------------------------------------------------------------------

/** public.profiles — extends Supabase Auth with business details */
export interface Profile {
  id: string;                  // uuid, PK, references auth.users(id)
  full_name: string | null;
  studio_name: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  iban: string | null;
  bic: string | null;
  created_at: string;          // timestamptz, not null
}

/** public.clients — customer/company records per user */
export interface Client {
  id: string;                  // uuid, PK
  user_id: string;             // uuid, not null, FK → profiles.id
  name: string;                // text, not null
  contact_name: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  kvk_number: string | null;
  created_at: string;          // timestamptz, not null
}

/** public.invoices — invoice headers */
export interface Invoice {
  id: string;                  // uuid, PK
  user_id: string;             // uuid, not null, FK → profiles.id
  client_id: string;           // uuid, not null, FK → clients.id
  invoice_number: string;      // text, not null
  status: InvoiceStatus;       // text, not null, default 'draft'
  issue_date: string;          // date, not null, default current_date
  due_date: string | null;     // date
  sent_via: InvoiceSentVia | null;
  subtotal_ex_vat: number;     // numeric(10,2), not null, default 0
  vat_amount: number;          // numeric(10,2), not null, default 0
  total_inc_vat: number;       // numeric(10,2), not null, default 0
  notes: string | null;
  created_at: string;          // timestamptz, not null
}

/** public.invoice_lines — line items per invoice */
export interface InvoiceLine {
  id: string;                  // uuid, PK
  invoice_id: string;          // uuid, not null, FK → invoices.id
  description: string;         // text, not null
  quantity: number;            // numeric(10,2), not null, default 1
  unit: InvoiceLineUnit | null;
  rate: number;                // numeric(10,2), not null, default 0
  amount: number;              // numeric(10,2), not null, default 0
  sort_order: number;          // integer, not null, default 0
}

/** public.receipts — expense receipts (bonnen) */
export interface Receipt {
  id: string;                  // uuid, PK
  user_id: string;             // uuid, not null, FK → profiles.id
  vendor_name: string | null;
  amount_ex_vat: number | null;   // numeric(10,2)
  vat_amount: number | null;      // numeric(10,2)
  amount_inc_vat: number | null;  // numeric(10,2)
  vat_rate: number | null;        // numeric(5,2)
  category: string | null;
  receipt_date: string | null;    // date
  storage_path: string | null;
  ai_processed: boolean;          // boolean, not null, default false
  created_at: string;             // timestamptz, not null
}

// ---------------------------------------------------------------------------
// Insert types — omit server-generated fields
// ---------------------------------------------------------------------------

export type ProfileInsert = Omit<Profile, 'created_at'> & {
  created_at?: string;
};

export type ClientInsert = Omit<Client, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type InvoiceInsert = Omit<Invoice, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type InvoiceLineInsert = Omit<InvoiceLine, 'id'> & {
  id?: string;
};

export type ReceiptInsert = Omit<Receipt, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

// ---------------------------------------------------------------------------
// Update types — all fields optional except id
// ---------------------------------------------------------------------------

export type ProfileUpdate = Partial<Omit<Profile, 'id'>> & { id: string };
export type ClientUpdate = Partial<Omit<Client, 'id'>> & { id: string };
export type InvoiceUpdate = Partial<Omit<Invoice, 'id'>> & { id: string };
export type InvoiceLineUpdate = Partial<Omit<InvoiceLine, 'id'>> & { id: string };
export type ReceiptUpdate = Partial<Omit<Receipt, 'id'>> & { id: string };
