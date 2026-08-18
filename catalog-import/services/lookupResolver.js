import supabase from "../../backend/config/supabase.js";

const LOOKUP_TABLES = {
  category: "design_categories",
  fabric_type: "fabric_types",
  brand: "brands",
};

function normalizeValue(value) {
  return String(value).trim().toLowerCase();
}

export async function resolveLookup({
  tenantId,
  fieldName,
  sourceValue,
  categoryId = null,
}) {
  if (!sourceValue) {
    return {
      status: "unmapped",
      sourceValue,
      code: "UNMAPPED_LOOKUP",
      reason: "Value is empty.",
    };
  }

  const normalizedValue = normalizeValue(sourceValue);

  // Department is stored as a value, not a lookup-table ID.
  if (fieldName === "department") {
    return {
      status: "resolved",
      sourceValue,
      resolvedValue: String(sourceValue).trim(),
      method: "direct_value",
    };
  }

  // Style needs a category because design_styles
  // is connected through category_id.
  if (fieldName === "style") {
    return resolveStyle({
      tenantId,
      sourceValue,
      normalizedValue,
      categoryId,
    });
  }

  const tableName = LOOKUP_TABLES[fieldName];

  if (!tableName) {
    return {
      status: "unmapped",
      sourceValue,
      code: "UNMAPPED_LOOKUP",
      reason: `Unsupported lookup field: ${fieldName}`,
    };
  }

  // 1. Direct exact match
  const { data: exactMatch, error: exactError } = await supabase
    .from(tableName)
    .select("id, name")
    .eq("tenant_id", tenantId)
    .ilike("name", normalizedValue)
    .maybeSingle();

  if (exactError) {
    throw exactError;
  }

  if (exactMatch) {
    return {
      status: "resolved",
      sourceValue,
      resolvedId: exactMatch.id,
      resolvedValue: exactMatch.name,
      method: "exact_match",
    };
  }

  // 2. Check tenant-specific alias dictionary
  const { data: alias, error: aliasError } = await supabase
    .from("lookup_aliases")
    .select("resolved_id, resolved_value")
    .eq("tenant_id", tenantId)
    .eq("field_name", fieldName)
    .eq("source_value", normalizedValue)
    .maybeSingle();

  if (aliasError) {
    throw aliasError;
  }

  if (alias) {
    return {
      status: "resolved",
      sourceValue,
      resolvedId: alias.resolved_id,
      resolvedValue: alias.resolved_value,
      method: "alias",
    };
  }

  // 3. Nothing matched
  return {
    status: "unmapped",
    sourceValue,
    code: "UNMAPPED_LOOKUP",
    reason: "No exact lookup or alias match was found.",
  };
}

async function resolveStyle({
  tenantId,
  sourceValue,
  normalizedValue,
  categoryId,
}) {
  if (!categoryId) {
    return {
      status: "unmapped",
      sourceValue,
      code: "UNMAPPED_LOOKUP",
      reason: "Style cannot be resolved because the category has not been resolved.",
    };
  }

  // Make sure the category actually belongs to this tenant.
  const { data: category, error: categoryError } = await supabase
    .from("design_categories")
    .select("id")
    .eq("id", categoryId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (categoryError) {
    throw categoryError;
  }

  if (!category) {
    return {
      status: "unmapped",
      sourceValue,
      code: "UNMAPPED_LOOKUP",
      reason: "The supplied category does not belong to this tenant.",
    };
  }

  // 1. Direct style match inside the resolved category
  const { data: exactStyle, error: styleError } = await supabase
    .from("design_styles")
    .select("id, name, category_id")
    .eq("category_id", categoryId)
    .ilike("name", normalizedValue)
    .maybeSingle();

  if (styleError) {
    throw styleError;
  }

  if (exactStyle) {
    return {
      status: "resolved",
      sourceValue,
      resolvedId: exactStyle.id,
      resolvedValue: exactStyle.name,
      method: "exact_match",
    };
  }

  // 2. Check alias dictionary
  const { data: alias, error: aliasError } = await supabase
    .from("lookup_aliases")
    .select("resolved_id, resolved_value")
    .eq("tenant_id", tenantId)
    .eq("field_name", "style")
    .eq("source_value", normalizedValue)
    .maybeSingle();

  if (aliasError) {
    throw aliasError;
  }

  if (alias) {
    return {
      status: "resolved",
      sourceValue,
      resolvedId: alias.resolved_id,
      resolvedValue: alias.resolved_value,
      method: "alias",
    };
  }

  // 3. Nothing matched
  return {
    status: "unmapped",
    sourceValue,
    code: "UNMAPPED_LOOKUP",
    reason: "No matching style was found for the resolved category.",
  };
}