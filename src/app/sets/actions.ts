"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import type { CreateSetInput, UpdateSetInput } from "@/types";

export async function createSet(formData: FormData) {
	const user = await requireAuth();
	const supabase = await createClient();

	const input: CreateSetInput = {
		name: (formData.get("name") as string).toLowerCase(),
		description: (formData.get("description") as string)?.toLowerCase() || null,
	};

	const exerciseIds: string[] = JSON.parse(
		(formData.get("exercise_ids") as string) || "[]",
	);

	const { data: set, error } = await supabase
		.from("sets")
		.insert({ ...input, user_id: user.id })
		.select("id")
		.single();

	if (error) throw new Error(error.message);

	if (exerciseIds.length > 0) {
		const rows = exerciseIds.map((exercise_id, i) => ({
			set_id: set.id,
			exercise_id,
			position: i,
		}));
		const { error: linkError } = await supabase
			.from("set_exercises")
			.insert(rows);
		if (linkError) throw new Error(linkError.message);
	}

	revalidatePath("/sets");
	redirect("/sets");
}

export async function updateSet(id: string, formData: FormData) {
	const user = await requireAuth();
	const supabase = await createClient();

	const input: UpdateSetInput = {
		name: (formData.get("name") as string).toLowerCase(),
		description: (formData.get("description") as string)?.toLowerCase() || null,
	};

	const exerciseIds: string[] = JSON.parse(
		(formData.get("exercise_ids") as string) || "[]",
	);

	const { error } = await supabase
		.from("sets")
		.update(input)
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) throw new Error(error.message);

	const { error: delError } = await supabase
		.from("set_exercises")
		.delete()
		.eq("set_id", id);

	if (delError) throw new Error(delError.message);

	if (exerciseIds.length > 0) {
		const rows = exerciseIds.map((exercise_id, i) => ({
			set_id: id,
			exercise_id,
			position: i,
		}));
		const { error: linkError } = await supabase
			.from("set_exercises")
			.insert(rows);
		if (linkError) throw new Error(linkError.message);
	}

	revalidatePath("/sets");
	redirect(`/sets/${id}`);
}

export async function cloneSet(id: string) {
	const user = await requireAuth();
	const supabase = await createClient();

	const { data: source, error: fetchError } = await supabase
		.from("sets")
		.select(
			"name, description, set_exercises(exercise_id, position, exercise:exercises(title, description, images, tags, preparation_secs, duration_secs, repetitions))",
		)
		.eq("id", id)
		.single();

	if (fetchError || !source)
		throw new Error(fetchError?.message ?? "Set not found");

	const { set_exercises, ...setData } = source as unknown as {
		name: string;
		description: string | null;
		set_exercises: {
			exercise_id: string;
			position: number;
			exercise: {
				title: string;
				description: string | null;
				images: unknown;
				tags: string[];
				preparation_secs: number;
				duration_secs: number;
				repetitions: number;
			};
		}[];
	};

	// Create new set
	const { data: clone, error } = await supabase
		.from("sets")
		.insert({ ...setData, name: `${setData.name} [clon]`, user_id: user.id })
		.select("id")
		.single();

	if (error) throw new Error(error.message);

	// Clone exercises and link them to new set
	if (set_exercises.length > 0) {
		const rows = [] as {
			set_id: string;
			exercise_id: string;
			position: number;
		}[];

		for (const se of set_exercises) {
			const exerciseData = se.exercise;
			if (!exerciseData)
				throw new Error("Exercise relation missing for set clone");

			const { data: clonedExercise, error: cloneError } = await supabase
				.from("exercises")
				.insert({
					...exerciseData,
					title: `${exerciseData.title} [clon]`,
					user_id: user.id,
				})
				.select("id")
				.single();

			if (cloneError) throw new Error(cloneError.message);
			if (!clonedExercise) throw new Error("Failed to clone exercise");

			if (!clone) throw new Error("Failed to clone set");

			rows.push({
				set_id: clone.id,
				exercise_id: clonedExercise.id,
				position: se.position,
			});
		}

		const { error: linkError } = await supabase
			.from("set_exercises")
			.insert(rows);
		if (linkError) throw new Error(linkError.message);
	}

	await supabase.rpc("increment_clone_count", {
		table_name: "sets",
		row_id: id,
	});

	revalidatePath("/sets");
	redirect(`/sets/${clone.id}/edit`);
}

export async function deleteSet(id: string) {
	const user = await requireAuth();
	const supabase = await createClient();

	const { error } = await supabase
		.from("sets")
		.delete()
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) throw new Error(error.message);

	revalidatePath("/sets");
	redirect("/sets");
}

export async function deleteSets(ids: string[]) {
	const user = await requireAuth();
	const supabase = await createClient();

	const { error } = await supabase
		.from("sets")
		.delete()
		.in("id", ids)
		.eq("user_id", user.id);

	if (error) throw new Error(error.message);

	revalidatePath("/sets");
}
