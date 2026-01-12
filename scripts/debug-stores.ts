
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugStores() {
    console.log("Debugging stores...");
    const targetNames = ["ARDEN FC", "BURGER KING", "BURSA KEBAP EVİ"];

    // Fetch these stores
    const { data: stores, error } = await supabase
        .from('stores')
        .select('*')
        .in('name', targetNames);

    if (error) {
        console.error(error);
        return;
    }

    console.log("Found stores:", stores);

    // Also fetch all categories to check for duplicates
    const { data: categories } = await supabase.from('categories').select('*').ilike('name', '%Cafe%');
    console.log("Categories found:", categories);
}

debugStores();
