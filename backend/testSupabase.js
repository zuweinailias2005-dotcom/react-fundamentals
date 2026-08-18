import supabase from "./config/supabase.js";

try {
  const { data, error } = await supabase
    .from("lookup_aliases")
    .select("id")
    .limit(1);

  if (error) {
    console.error("SUPABASE ERROR:");
    console.error(error);
    process.exit(1);
  }

  console.log("SUPABASE CONNECTION SUCCESSFUL");
  console.log(data);
} catch (error) {
  console.error("SUPABASE CONNECTION FAILED:");
  console.error(error);
}