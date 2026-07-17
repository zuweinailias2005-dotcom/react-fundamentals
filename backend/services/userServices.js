import bcrypt from "bcrypt";
import supabase from "../config/supabase.js";

export async function registerUser(name, email, password) {
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        email,
        password: hashedPassword,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function loginUser(email, password) {
  // Find user by email
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    throw new Error("Invalid email or password.");
  }

  // Compare entered password with hashed password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    data.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  return data;
}

