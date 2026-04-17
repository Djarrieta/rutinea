import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('exercises')
    .select('title, title_search, description, description_search')
    .ilike('title_search', '%gluteo%')
    .limit(5)
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Results for %gluteo%:', data)
  }
}

test()
