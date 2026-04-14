/**
 * Seed Demo Data
 */
import dotenv from "dotenv";
import path from "path";

import { createClient } from "@supabase/supabase-js";
import {
  clientsSeed,
  demoTrainerId,
  homeworkItemsSeed,
  homeworkTemplatesSeed,
  sessionMessagesSeed,
  sessionsSeed,
} from "../lib/demo/demo-seed-data";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
/**
 * Env
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

/**
 * Supabase Admin Client
 */
const supabase = createClient(supabaseUrl, serviceRoleKey);

/**
 * Require Demo Trainer
 */
const ensureDemoTrainerExists = async () => {
  const { data, error } = await supabase
    .from("trainers")
    .select("id, email, name")
    .eq("id", demoTrainerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      `No trainer row found for demoTrainerId: ${demoTrainerId}. Create the auth user + trainers row first.`
    );
  }

  console.log(`Found demo trainer: ${data.name} (${data.email})`);
};

/**
 * Delete Existing Demo Data
 */
const clearDemoData = async () => {
  console.log("Clearing existing demo data...");

  const { error: messagesError } = await supabase
    .from("session_messages")
    .delete()
    .in(
      "session_id",
      sessionsSeed.map((session) => session.id)
    );

  if (messagesError) {
    throw messagesError;
  }

  const { error: homeworkError } = await supabase
    .from("homework_items")
    .delete()
    .in(
      "session_id",
      sessionsSeed.map((session) => session.id)
    );

  if (homeworkError) {
    throw homeworkError;
  }

  const { error: sessionsError } = await supabase
    .from("sessions")
    .delete()
    .eq("trainer_id", demoTrainerId);

  if (sessionsError) {
    throw sessionsError;
  }

  const { error: templatesError } = await supabase
    .from("homework_templates")
    .delete()
    .eq("trainer_id", demoTrainerId);

  if (templatesError) {
    throw templatesError;
  }

  const { error: clientsError } = await supabase
    .from("clients")
    .delete()
    .eq("trainer_id", demoTrainerId);

  if (clientsError) {
    throw clientsError;
  }

  console.log("Existing demo data cleared.");
};

/**
 * Insert Fresh Demo Data
 */
const insertDemoData = async () => {
  console.log("Inserting clients...");

  const { error: clientsError } = await supabase.from("clients").insert(clientsSeed);

  if (clientsError) {
    throw clientsError;
  }

  console.log("Inserting homework templates...");

  const { error: templatesError } = await supabase
    .from("homework_templates")
    .insert(homeworkTemplatesSeed);

  if (templatesError) {
    throw templatesError;
  }

  console.log("Inserting sessions...");

  const { error: sessionsError } = await supabase.from("sessions").insert(sessionsSeed);

  if (sessionsError) {
    throw sessionsError;
  }

  console.log("Inserting homework items...");

  const { error: homeworkError } = await supabase.from("homework_items").insert(homeworkItemsSeed);

  if (homeworkError) {
    throw homeworkError;
  }

  console.log("Inserting session messages...");

  const { error: messagesError } = await supabase
    .from("session_messages")
    .insert(sessionMessagesSeed);

  if (messagesError) {
    throw messagesError;
  }

  console.log("Demo data inserted.");
};

/**
 * Run
 */
const seedDemo = async () => {
  try {
    console.log("Starting demo seed...");

    await ensureDemoTrainerExists();
    await clearDemoData();
    await insertDemoData();

    console.log("Demo seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("Demo seed failed:");
    console.error(error);
    process.exit(1);
  }
};

seedDemo();
