/**
 * Re-exports from database.ts (single source of truth) plus
 * the InvoiceData composition type used by the invoice renderer.
 */
export type {
  Profile,
  Client,
  Invoice,
  InvoiceLine,
} from './database';

import type { Invoice, Profile, Client, InvoiceLine } from './database';

export interface InvoiceData {
  invoice: Invoice;
  profile: Profile;
  client: Client;
  lines: InvoiceLine[];
}
