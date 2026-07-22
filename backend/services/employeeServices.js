import supabase from "../config/supabase.js";

export async function bulkUploadEmployees(employees){
    const{data,error} = await supabase
    .from("employees")
    .upsert(employees, {
  onConflict: "email",
})
    .select();

    if (error){
        throw new Error(error.message);
    }

    return data;
}

export async function getEmployees(
  page,
  limit,
  search,
  sortBy,
  sortOrder
) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("employees")
    .select("*", { count: "exact" });

  // Search
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,department.ilike.%${search}%`
    );
  }

  // Sorting
  query = query.order(sortBy, {
    ascending: sortOrder === "asc",
  });

  // Pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    data,
    count,
  };
}

export async function deleteEmployees(ids) {
  const { data, error } = await supabase
    .from("employees")
    .delete()
    .in("id", ids)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}