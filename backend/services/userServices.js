import supabase from "../config/supabase.js";

export async function registerUser(name, email, password) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function loginUser(email, password) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    throw new Error("Invalid email or password.");
  }

  return data;
}