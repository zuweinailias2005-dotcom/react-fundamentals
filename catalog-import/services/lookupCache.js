import supabase from "../../backend/config/supabase.js";

export async function loadLookupCache(tenantId) {
  console.log("Loading lookup data...");

  const [
    categoriesResult,
    stylesResult,
    brandsResult,
    fabricsResult,
    aliasesResult,
  ] = await Promise.all([
    supabase
      .from("design_categories")
      .select("id, name")
      .eq("tenant_id", tenantId),

    supabase
      .from("design_styles")
      .select("id, name, category_id"),

    supabase
      .from("brands")
      .select("id, name")
      .eq("tenant_id", tenantId),

    supabase
      .from("fabric_types")
      .select("id, name")
      .eq("tenant_id", tenantId),

    supabase
      .from("lookup_aliases")
      .select(
        "tenant_id, field_name, source_value, resolved_id, resolved_value"
      )
      .eq("tenant_id", tenantId),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (stylesResult.error) throw stylesResult.error;
  if (brandsResult.error) throw brandsResult.error;
  if (fabricsResult.error) throw fabricsResult.error;
  if (aliasesResult.error) throw aliasesResult.error;

  const normalize = (value) =>
    String(value ?? "").trim().toLowerCase();

  const cache = {
    categories: new Map(),
    styles: new Map(),
    brands: new Map(),
    fabrics: new Map(),
    aliases: new Map(),
  };

  for (const row of categoriesResult.data || []) {
    cache.categories.set(normalize(row.name), row);
  }

  for (const row of stylesResult.data || []) {
    const key = `${row.category_id}:${normalize(row.name)}`;
    cache.styles.set(key, row);
  }

  for (const row of brandsResult.data || []) {
    cache.brands.set(normalize(row.name), row);
  }

  for (const row of fabricsResult.data || []) {
    cache.fabrics.set(normalize(row.name), row);
  }

  for (const row of aliasesResult.data || []) {
    const key = `${row.field_name}:${normalize(row.source_value)}`;

    cache.aliases.set(key, row);
  }

  console.log("Lookup data loaded successfully.");

  return cache;
}