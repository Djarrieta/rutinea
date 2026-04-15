'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Breadcrumb from '@/app/components/Breadcrumb'
import { DAY_LABELS } from '@/types'
import type { PlanBundle, RoutineBundle, BundleExercise } from '@/types'

function validateRoutineBundle(rb: unknown, path: string): string | null {
  if (!rb || typeof rb !== 'object') return `${path} debe ser un objeto`
  const r = rb as Record<string, unknown>

  if (!r.routine || typeof r.routine !== 'object') return `${path}.routine es requerido`
  const routine = r.routine as Record<string, unknown>
  if (typeof routine.name !== 'string' || !routine.name) return `${path}.routine.name es requerido`
  if (typeof routine.rest_secs !== 'number') return `${path}.routine.rest_secs debe ser un número`

  if (!Array.isArray(r.sets) || r.sets.length === 0) return `${path} debe tener al menos un set`

  for (let si = 0; si < r.sets.length; si++) {
    const set = r.sets[si] as Record<string, unknown>
    if (typeof set.name !== 'string' || !set.name) return `${path}.sets[${si}].name es requerido`
    if (typeof set.rounds !== 'number' || set.rounds < 1) return `${path}.sets[${si}].rounds debe ser >= 1`
    if (!Array.isArray(set.exercises) || set.exercises.length === 0) {
      return `${path}.sets[${si}] debe tener al menos un ejercicio`
    }

    for (let ei = 0; ei < set.exercises.length; ei++) {
      const ex = set.exercises[ei] as Record<string, unknown>
      if (typeof ex.title !== 'string' || !ex.title) return `${path}.sets[${si}].exercises[${ei}].title es requerido`
      if (typeof ex.preparation_secs !== 'number') return `${path}.sets[${si}].exercises[${ei}].preparation_secs debe ser un número`
      if (typeof ex.duration_secs !== 'number') return `${path}.sets[${si}].exercises[${ei}].duration_secs debe ser un número`
      if (typeof ex.repetitions !== 'number') return `${path}.sets[${si}].exercises[${ei}].repetitions debe ser un número`
    }
  }

  return null
}

function validateBundle(data: unknown): { ok: true; bundle: PlanBundle } | { ok: false; error: string } {
  if (!data || typeof data !== 'object') return { ok: false, error: 'El JSON debe ser un objeto' }
  const obj = data as Record<string, unknown>

  if (!obj.plan || typeof obj.plan !== 'object') return { ok: false, error: 'Falta el campo "plan"' }
  const plan = obj.plan as Record<string, unknown>
  if (typeof plan.name !== 'string' || !plan.name) return { ok: false, error: 'plan.name es requerido' }

  if (!Array.isArray(obj.days) || obj.days.length === 0) return { ok: false, error: 'Debe tener al menos un día' }

  const seenDays = new Set<number>()
  for (let di = 0; di < obj.days.length; di++) {
    const day = obj.days[di] as Record<string, unknown>
    if (typeof day.day_of_week !== 'number' || day.day_of_week < 0 || day.day_of_week > 6) {
      return { ok: false, error: `days[${di}].day_of_week debe ser 0-6` }
    }
    if (seenDays.has(day.day_of_week as number)) {
      return { ok: false, error: `days[${di}].day_of_week ${day.day_of_week} está duplicado` }
    }
    seenDays.add(day.day_of_week as number)

    const routineErr = validateRoutineBundle(day.routine, `days[${di}].routine`)
    if (routineErr) return { ok: false, error: routineErr }
  }

  return { ok: true, bundle: data as PlanBundle }
}

async function importRoutineBundle(
  supabase: ReturnType<typeof createClient>,
  rb: RoutineBundle,
): Promise<{ id: string } | { error: string }> {
  // 1. Resolve exercises
  const exerciseIdMap = new Map<string, string>()

  const idsToVerify = [
    ...new Set(
      rb.sets.flatMap((s) => s.exercises.filter((e) => e.id).map((e) => e.id!)),
    ),
  ]

  if (idsToVerify.length > 0) {
    const { data: existing, error: fetchError } = await supabase
      .from('exercises')
      .select('id')
      .in('id', idsToVerify)

    if (fetchError) return { error: 'Error verificando ejercicios: ' + fetchError.message }

    const existingIds = new Set(existing?.map((e) => e.id))
    const missing = idsToVerify.filter((id) => !existingIds.has(id))
    if (missing.length > 0) return { error: `Ejercicios no encontrados: ${missing.join(', ')}` }
  }

  for (let si = 0; si < rb.sets.length; si++) {
    for (let ei = 0; ei < rb.sets[si].exercises.length; ei++) {
      const ex = rb.sets[si].exercises[ei]
      const key = `${si}-${ei}`

      if (ex.id) {
        exerciseIdMap.set(key, ex.id)
      } else {
        const { data: created, error: createError } = await supabase
          .from('exercises')
          .insert({
            title: ex.title.toLowerCase(),
            description: ex.description?.toLowerCase() ?? null,
            images: ex.images ?? [],
            tags: ex.tags ?? [],
            preparation_secs: ex.preparation_secs,
            duration_secs: ex.duration_secs,
            repetitions: ex.repetitions,
          })
          .select('id')
          .single()

        if (createError || !created) return { error: `Error creando ejercicio "${ex.title}": ${createError?.message}` }
        exerciseIdMap.set(key, created.id)
      }
    }
  }

  // 2. Create sets
  const setEntries: { id: string; rounds: number }[] = []

  for (let si = 0; si < rb.sets.length; si++) {
    const bs = rb.sets[si]

    const { data: newSet, error: setErr } = await supabase
      .from('sets')
      .insert({
        name: bs.name.toLowerCase(),
        description: bs.description?.toLowerCase() ?? null,
      })
      .select('id')
      .single()

    if (setErr || !newSet) return { error: `Error creando set "${bs.name}": ${setErr?.message}` }

    const exerciseRows = bs.exercises.map((_, ei) => ({
      set_id: newSet.id,
      exercise_id: exerciseIdMap.get(`${si}-${ei}`)!,
      position: ei,
    }))

    if (exerciseRows.length > 0) {
      const { error: linkErr } = await supabase.from('set_exercises').insert(exerciseRows)
      if (linkErr) return { error: `Error vinculando ejercicios al set "${bs.name}": ${linkErr.message}` }
    }

    setEntries.push({ id: newSet.id, rounds: bs.rounds })
  }

  // 3. Create routine
  const { data: routine, error: routineErr } = await supabase
    .from('routines')
    .insert({
      name: rb.routine.name.toLowerCase(),
      description: rb.routine.description?.toLowerCase() ?? null,
      rest_secs: rb.routine.rest_secs,
    })
    .select('id')
    .single()

  if (routineErr || !routine) return { error: `Error creando rutina "${rb.routine.name}": ${routineErr?.message}` }

  if (setEntries.length > 0) {
    const rows = setEntries.map((entry, i) => ({
      routine_id: routine.id,
      set_id: entry.id,
      position: i,
      rounds: entry.rounds,
    }))
    const { error: linkErr } = await supabase.from('routine_sets').insert(rows)
    if (linkErr) return { error: `Error vinculando sets a rutina: ${linkErr.message}` }
  }

  return { id: routine.id }
}

export default function ImportPlanPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImport = async () => {
    setError(null)

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      setError('JSON inválido — revisa la sintaxis')
      return
    }

    const result = validateBundle(parsed)
    if (!result.ok) {
      setError(result.error)
      return
    }

    const { bundle } = result
    setLoading(true)

    try {
      const supabase = createClient()

      // Import each day's routine
      const dayEntries: { day_of_week: number; routine_id: string }[] = []

      for (const day of bundle.days) {
        const routineResult = await importRoutineBundle(supabase, day.routine)
        if ('error' in routineResult) {
          setError(`${DAY_LABELS[day.day_of_week]}: ${routineResult.error}`)
          return
        }
        dayEntries.push({ day_of_week: day.day_of_week, routine_id: routineResult.id })
      }

      // Redirect to /plans/new with prefilled data
      const params = new URLSearchParams()
      params.set('name', bundle.plan.name)
      if (bundle.plan.description) {
        params.set('description', bundle.plan.description)
      }
      params.set('day_entries', JSON.stringify(dayEntries))

      router.push(`/plans/new?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <Breadcrumb
        items={[
          { label: 'Planes', href: '/plans' },
          { label: 'Nuevo Plan', href: '/plans/new' },
          { label: 'Importar' },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Importar Plan</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="json" className="block text-sm font-medium mb-1">
            Pega el JSON del plan
          </label>
          <textarea
            id="json"
            rows={16}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='{"plan": {"name": "...", ...}, "days": [...]}'
            className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {error && (
          <div className="bg-danger-400/10 border border-danger-400/30 text-danger-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={loading || !text.trim()}
          className="bg-primary-500 text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? 'Importando…' : 'Validar e importar'}
        </button>
      </div>
    </div>
  )
}
