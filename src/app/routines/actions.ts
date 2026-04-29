"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import type { CreateRoutineInput, UpdateRoutineInput } from "@/types";
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "@/lib/constants";

export async function createRoutine(formData: FormData) {
	const user = await requireAuth();
	const supabase = await createClient();

	const input: CreateRoutineInput = {
		name: (formData.get("name") as string).toLowerCase().slice(0, MAX_TITLE_LENGTH),
		description: (formData.get("description") as string)?.toLowerCase().slice(0, MAX_DESCRIPTION_LENGTH) || null,
		rest_secs: Number(formData.get("rest_secs")) || 60,
	};

	const setEntries: { id: string; rounds: number }[] = JSON.parse(
		(formData.get("set_entries") as string) || "[]",
	);

	const { data: routine, error } = await supabase
		.from("routines")
		.insert({ ...input, user_id: user.id, is_approved: false })
		.select("id")
		.single();

	if (error) throw new Error(error.message);

	if (setEntries.length > 0) {
		const rows = setEntries.map((entry, i) => ({
			routine_id: routine.id,
			set_id: entry.id,
			position: i,
			rounds: entry.rounds,
		}));
		const { error: linkError } = await supabase
			.from("routine_sets")
			.insert(rows);
		if (linkError) throw new Error(linkError.message);
	}

	revalidatePath("/routines");
	redirect("/routines");
}

export async function updateRoutine(id: string, formData: FormData) {
	const user = await requireAuth();
	const supabase = await createClient();

	const input: UpdateRoutineInput = {
		name: (formData.get("name") as string).toLowerCase().slice(0, MAX_TITLE_LENGTH),
		description: (formData.get("description") as string)?.toLowerCase().slice(0, MAX_DESCRIPTION_LENGTH) || null,
		rest_secs: Number(formData.get("rest_secs")) || 60,
	};

	const setEntries: { id: string; rounds: number }[] = JSON.parse(
		(formData.get("set_entries") as string) || "[]",
	);

	const { error } = await supabase
		.from("routines")
		.update(input)
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) throw new Error(error.message);

	const { error: delError } = await supabase
		.from("routine_sets")
		.delete()
		.eq("routine_id", id);

	if (delError) throw new Error(delError.message);

	if (setEntries.length > 0) {
		const rows = setEntries.map((entry, i) => ({
			routine_id: id,
			set_id: entry.id,
			position: i,
			rounds: entry.rounds,
		}));
		const { error: linkError } = await supabase
			.from("routine_sets")
			.insert(rows);
		if (linkError) throw new Error(linkError.message);
	}

	revalidatePath("/routines");
	redirect(`/routines/${id}`);
}

export async function cloneRoutine(id: string) {
	const user = await requireAuth();
	const supabase = await createClient();

	const { data: source, error: fetchError } = await supabase
		.from("routines")
		.select(
			"name, description, rest_secs, routine_sets(set_id, position, rounds, set:sets(name, description, preparation_secs, set_exercises(exercise_id, position, exercise:exercises(title, description, images, tags, preparation_secs, duration_secs, repetitions))))",
		)
		.eq("id", id)
		.single();

	if (fetchError || !source)
		throw new Error(fetchError?.message ?? "Routine not found");

	const { routine_sets, ...routineData } = source as unknown as {
		name: string;
		description: string | null;
		rest_secs: number;
		routine_sets: {
			set_id: string;
			position: number;
			rounds: number;
			set: {
				name: string;
				description: string | null;
				preparation_secs: number;
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
		}[];
	};

	// Create new routine
	const { data: clone, error } = await supabase
		.from("routines")
		.insert({
			...routineData,
			name: `${routineData.name} [clon]`,
			user_id: user.id,
			is_approved: false,
		})
		.select("id")
		.single();

	if (error) throw new Error(error.message);

	// Clone sets with their exercises and link them to new routine
	if (routine_sets.length > 0) {
		const clonedSetMappings: {
			originalSetId: string;
			clonedSetId: string;
			position: number;
			rounds: number;
		}[] = [];

		for (const rs of routine_sets) {
			if (!rs.set) {
				console.warn(
					`Set ${rs.set_id} missing or invalid for routine clone, skipping`,
				);
				continue;
			}
			const setData = rs.set;

			// Create new set
			const { data: clonedSet, error: setError } = await supabase
				.from("sets")
				.insert({
					name: `${setData.name} [clon]`,
					description: setData.description,
					preparation_secs: setData.preparation_secs ?? 0,
					user_id: user.id,
					is_approved: false,
				})
				.select("id")
				.single();

			if (setError) throw new Error(setError.message);

			// Clone exercises for this set
			if (setData.set_exercises.length > 0) {
				const rows = [] as {
					set_id: string;
					exercise_id: string;
					position: number;
				}[];

				for (const se of setData.set_exercises) {
					if (!se.exercise) {
						console.warn(
							`Exercise ${se.exercise_id} missing or invalid for routine clone, skipping`,
						);
						continue;
					}
					const exerciseData = se.exercise;
					const { data: clonedExercise, error: exError } = await supabase
						.from("exercises")
						.insert({
							...exerciseData,
							title: `${exerciseData.title} [clon]`,
							user_id: user.id,
							is_approved: false,
						})
						.select("id")
						.single();

					if (exError) throw new Error(exError.message);
					rows.push({
						set_id: clonedSet.id,
						exercise_id: clonedExercise.id,
						position: se.position,
					});
				}

				const { error: linkError } = await supabase
					.from("set_exercises")
					.insert(rows);
				if (linkError) throw new Error(linkError.message);
			}

			clonedSetMappings.push({
				originalSetId: rs.set_id,
				clonedSetId: clonedSet.id,
				position: rs.position,
				rounds: rs.rounds,
			});
		}

		// Link cloned sets to routine
		const rows = clonedSetMappings.map((mapping) => ({
			routine_id: clone.id,
			set_id: mapping.clonedSetId,
			position: mapping.position,
			rounds: mapping.rounds,
		}));
		const { error: linkError } = await supabase
			.from("routine_sets")
			.insert(rows);
		if (linkError) throw new Error(linkError.message);
	}

	await supabase.rpc("increment_clone_count", {
		table_name: "routines",
		row_id: id,
	});

	revalidatePath("/routines");
	redirect(`/routines/${clone.id}/edit`);
}

export async function deleteRoutine(id: string) {
	const user = await requireAuth();
	const supabase = await createClient();

	const { error } = await supabase
		.from("routines")
		.delete()
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) throw new Error(error.message);

	revalidatePath("/routines");
	redirect("/routines");
}
