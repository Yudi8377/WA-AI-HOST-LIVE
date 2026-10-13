import "server-only";
import type { TransactionSql } from "postgres";
import { getDatabase } from "@/src/lib/db";

/**
 * Runs a database callback with a transaction-local tenant context.
 * RLS policies in migration 0002 fail closed when this context is absent.
 * Call only after the request's authenticated user has been authorized as an
 * active member of the requested tenant.
 */
export async function withTenantDatabase<T>(
  tenantId: string,
  callback: (sql: TransactionSql) => Promise<T>
): Promise<T> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)) {
    throw new Error("INVALID_TENANT_ID");
  }

  const db = getDatabase();
  return db.begin(async (tx) => {
    await tx`select set_config('app.tenant_id', ${tenantId}, true)`;
    return callback(tx);
  }) as Promise<T>;
}
