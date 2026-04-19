import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error(
		"Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
	);
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SEED_USER_ID = "00000000-0000-0000-0000-000000000000";

async function deleteSeedData() {
	console.log("🗑️  Deleting seed data for user:", SEED_USER_ID);

	// First, get all exercises to collect image paths
	const { data: exercises, error: exercisesError } = await supabase
		.from("exercises")
		.select("id, images")
		.eq("user_id", SEED_USER_ID);

	if (exercisesError) {
		console.error("Error fetching exercises:", exercisesError);
		return;
	}

	// Collect all image paths
	const imagePaths: string[] = [];
	exercises?.forEach((exercise) => {
		if (exercise.images && Array.isArray(exercise.images)) {
			exercise.images.forEach((img: unknown) => {
				if (typeof img === "string" && img.startsWith("exercise-images/")) {
					imagePaths.push(img);
				}
			});
		}
	});

	console.log(`Found ${imagePaths.length} images to delete`);

	// Delete images from storage
	if (imagePaths.length > 0) {
		const { error: storageError } = await supabase.storage
			.from("exercise-images")
			.remove(imagePaths);

		if (storageError) {
			console.error("Error deleting images:", storageError);
		} else {
			console.log("✅ Deleted images from storage");
		}
	}

	// Delete plans (this will cascade to plan_routines)
	const { error: plansError } = await supabase
		.from("plans")
		.delete()
		.eq("user_id", SEED_USER_ID);

	if (plansError) {
		console.error("Error deleting plans:", plansError);
	} else {
		console.log("✅ Deleted plans");
	}

	// Delete routines (this will cascade to routine_sets)
	const { error: routinesError } = await supabase
		.from("routines")
		.delete()
		.eq("user_id", SEED_USER_ID);

	if (routinesError) {
		console.error("Error deleting routines:", routinesError);
	} else {
		console.log("✅ Deleted routines");
	}

	// Delete sets (this will cascade to set_exercises)
	const { error: setsError } = await supabase
		.from("sets")
		.delete()
		.eq("user_id", SEED_USER_ID);

	if (setsError) {
		console.error("Error deleting sets:", setsError);
	} else {
		console.log("✅ Deleted sets");
	}

	// Delete exercises
	const { error: exercisesDeleteError } = await supabase
		.from("exercises")
		.delete()
		.eq("user_id", SEED_USER_ID);

	if (exercisesDeleteError) {
		console.error("Error deleting exercises:", exercisesDeleteError);
	} else {
		console.log("✅ Deleted exercises");
	}

	console.log("🎉 Seed data deletion complete!");
}

// Run the script
deleteSeedData().catch(console.error);
