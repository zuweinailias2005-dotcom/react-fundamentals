import supabase from "../config/supabase.js";

const LOOKUP_TABLES = {
  category: "design_categories",
  style: "design_styles",
  fabric_type: "fabric_types",
  brand: "brands",
};

function normalizeValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

export async function resolveLookupController(req, res) {
  try {
    const { jobId } = req.params;

    const {
      tenant_id,
      field_name,
      source_value,
      action,
      target_id_or_value,
      created_by,
    } = req.body;

    // -----------------------------
    // 1. Basic validation
    // -----------------------------

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
      });
    }

    if (
      !tenant_id ||
      !field_name ||
      !source_value ||
      !action ||
      target_id_or_value === undefined ||
      target_id_or_value === null ||
      target_id_or_value === ""
    ) {
      return res.status(400).json({
        message:
          "tenant_id, field_name, source_value, action and target_id_or_value are required.",
      });
    }

    if (!["map_existing", "create_new"].includes(action)) {
      return res.status(400).json({
        message:
          "action must be either 'map_existing' or 'create_new'.",
      });
    }

    const normalizedSource = normalizeValue(source_value);

    // -----------------------------
    // 2. Department
    // -----------------------------

    if (field_name === "department") {
      const resolvedValue = String(target_id_or_value).trim();

      const { data, error } = await supabase
        .from("lookup_aliases")
        .insert({
          tenant_id,
          field_name,
          source_value: normalizedSource,
          resolved_id: null,
          resolved_value: resolvedValue,
          created_by: created_by || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.status(200).json({
        message: "Lookup resolved successfully.",
        jobId,
        data,
      });
    }

    // -----------------------------
    // 3. Check supported field
    // -----------------------------

    const tableName = LOOKUP_TABLES[field_name];

    if (!tableName) {
      return res.status(400).json({
        message: `Unsupported lookup field: ${field_name}`,
      });
    }

    let resolvedId;
    let resolvedValue;

    // -----------------------------
    // 4. MAP TO EXISTING
    // -----------------------------

    if (action === "map_existing") {
      resolvedId = String(target_id_or_value);

      // Style needs special handling because
      // styles belong to categories.
      const selectColumns =
        field_name === "style"
          ? "id, name, category_id"
          : "id, name";

      const { data: existing, error } = await supabase
        .from(tableName)
        .select(selectColumns)
        .eq("id", resolvedId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!existing) {
        return res.status(404).json({
          message:
            "The selected lookup value does not exist.",
        });
      }

      resolvedValue = existing.name;
    }

    // -----------------------------
    // 5. CREATE NEW
    // -----------------------------
if (action === "create_new") {
  resolvedValue = String(target_id_or_value).trim();

  if (!resolvedValue) {
    return res.status(400).json({
      message: "New lookup value cannot be empty.",
    });
  }

  const slug = resolvedValue
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let insertData = {
    name: resolvedValue,
    slug,
    tenant_id,
  };

  // Styles belong to a category
  if (field_name === "style") {
    const { category_id } = req.body;

    if (!category_id) {
      return res.status(400).json({
        message: "category_id is required when creating a new style.",
      });
    }

    insertData = {
      name: resolvedValue,
      category_id,
    };
  }

  const { data: created, error } = await supabase
    .from(tableName)
    .insert(insertData)
    .select("id, name")
    .single();

  if (error) {
    throw error;
  }

  resolvedId = created.id;
  resolvedValue = created.name;
}

    // -----------------------------
    // 6. Save alias
    // -----------------------------

    const { data, error } = await supabase
      .from("lookup_aliases")
      .insert({
        tenant_id,
        field_name,
        source_value: normalizedSource,
        resolved_id: resolvedId || null,
        resolved_value: resolvedValue,
        created_by: created_by || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // -----------------------------
    // 7. Return result
    // -----------------------------

    return res.status(200).json({
      message: "Lookup resolved successfully.",
      jobId,
      action,
      data,
    });
  } catch (error) {
    console.error("Lookup resolution error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}