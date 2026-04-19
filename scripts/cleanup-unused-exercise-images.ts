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

async function getUsedImagePaths(): Promise<Set<string>> {
	console.log("📋 Fetching exercises from database...");

	const { data: exercises, error } = await supabase
		.from("exercises")
		.select("id, images");

	if (error) {
		console.error("Error fetching exercises:", error);
		process.exit(1);
	}

	const usedPaths = new Set<string>();

	exercises.forEach((exercise: unknown) => {
		if (
			exercise &&
			typeof exercise === "object" &&
			"images" in exercise &&
			Array.isArray((exercise as Record<string, unknown>).images)
		) {
			((exercise as Record<string, unknown>).images as unknown[]).forEach(
				(img: unknown) => {
					if (
						img &&
						typeof img === "object" &&
						"url" in img &&
						typeof (img as Record<string, unknown>).url === "string"
					) {
						const url = (img as Record<string, unknown>).url as string;
						const path = url.split("/").pop();
						if (path) {
							usedPaths.add(path);
						}
					}
				},
			);
		}
	});

	console.log(`✅ Found ${usedPaths.size} images in use`);
	return usedPaths;
}

async function getStorageFiles(): Promise<string[]> {
	console.log('📁 Listing files in "exercise-images" bucket...');

	const { data: files, error } = await supabase.storage
		.from("exercise-images")
		.list("", { limit: 10000 });

	if (error) {
		console.error("Error listing storage files:", error);
		process.exit(1);
	}

	const filePaths = files.map((f) => f.name);
	console.log(`✅ Found ${filePaths.length} files in storage`);
	return filePaths;
}

async function deleteUnusedImages(
	unusedPaths: string[],
): Promise<{ deleted: number; failed: number }> {
	let deleted = 0;
	let failed = 0;

	console.log(`\n🗑️  Deleting ${unusedPaths.length} unused images...`);

	for (const path of unusedPaths) {
		const { error } = await supabase.storage
			.from("exercise-images")
			.remove([path]);

		if (error) {
			console.error(`  ❌ Failed to delete ${path}:`, error.message);
			failed++;
		} else {
			console.log(`  ✓ Deleted: ${path}`);
			deleted++;
		}
	}

	return { deleted, failed };
}

async function main() {
	console.log("🧹 Exercise Images Cleanup Script\n");

	const usedPaths = await getUsedImagePaths();
	const storagePaths = await getStorageFiles();

	const unusedPaths = storagePaths.filter((path) => !usedPaths.has(path));

	if (unusedPaths.length === 0) {
		console.log("\n✨ No unused images found!");
		return;
	}

	console.log(`\n⚠️  Found ${unusedPaths.length} unused images:`);
	unusedPaths.forEach((path) => console.log(`  - ${path}`));

	const { deleted, failed } = await deleteUnusedImages(unusedPaths);

	console.log("\n📊 Summary:");
	console.log(`  Total unused images: ${unusedPaths.length}`);
	console.log(`  Successfully deleted: ${deleted}`);
	if (failed > 0) {
		console.log(`  Failed to delete: ${failed}`);
	}
}

main().catch(console.error);
