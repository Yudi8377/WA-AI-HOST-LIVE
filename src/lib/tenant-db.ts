import "server-only";
import type { TransactionSql } from "postgres";
import { getDatabase } from "@/src/lib/db";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Opens a transaction scoped to a tenant only after confirming that the
 * authenticated application's user ID has an active membership there.
 *
 * IMPORTANT: userId must come from a verified server-side session/token, never
 * from a request body, query string, or untrusted header. This function is a
 * database authorization guard, not an authentication provider.
 */
export async function withTenantDatabase<T>(
  userId: string,
  tenantId: string,
  callback: (sql: TransactionSql) => Promise<T>
): Promise<T> {
  if (!UUID.test(userId)) throw new Error("INVALID_USER_ID");
  if (!UUID.test(tenantId)) throw new Error("INVALID_TENANT_ID");

  const db = getDatabase();
  return db.begin(async (tx) => {
    await tx`select set_config('app.tenant_id', ${tenantId}, true)`;

    const memberships = await tx`
      select 1
      from memberships
      where tenant_id = ${tenantId}::uuid
        and user_id = ${userId}::uuid
        and status = 'active'
      limit 1
    `;
    if (memberships.length === 0) throw new Error("TENANT_ACCESS_DENIED");

    return callback(tx);
  }) as Promise<T>;
}
