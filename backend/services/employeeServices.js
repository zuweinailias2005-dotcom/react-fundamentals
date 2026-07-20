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