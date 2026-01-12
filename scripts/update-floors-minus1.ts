
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const storesToUpdate = [
    "Adidas",
    "Aura",
    "Ayakkabı Dünyası",
    "Benetton",
    "Beymen Business",
    "Calvin Klein",
    "Carrefour",
    "Colins",
    "DeFacto",
    "Fenerium",
    "Gant",
    "GS Store",
    "Hummel",
    "InStreet",
    "InterSport",
    "Jack & Jones",
    "JePublic",
    "Kiğılı",
    "Lescon",
    "Levi’s",
    "Lufian",
    "Mavi Jeans",
    "Nautica",
    "Nike",
    "Puma",
    "Skechers",
    "SuperStep",
    "Tommy Hilfiger",
    "ToyzzShop"
];

async function updateFloors() {
    console.log(`Searching for ${storesToUpdate.length} stores to update to '-1. Kat'...`);

    const { data: allStores, error } = await supabase.from('stores').select('id, name');
    if (error) {
        console.error("Error fetching stores:", error);
        return;
    }

    const idsToUpdate: number[] = [];
    const notFound: string[] = [];
    const foundNames: string[] = [];

    for (const reqName of storesToUpdate) {
        const lowerReq = reqName.toLowerCase();

        // 1. Exact case-insensitive match
        let match = allStores.find(s => s.name.toLowerCase() === lowerReq);

        // 2. Fallback: Check if store name contains specific keywords or vice versa
        // Careful not to match unrelated things, but 'Mavi Jeans' vs 'Mavi' is safe.
        if (!match) {
            match = allStores.find(s => {
                const lowerOb = s.name.toLowerCase();
                return lowerOb === lowerReq
                    || (lowerOb.includes(lowerReq) && lowerReq.length > 3)
                    || (lowerReq.includes(lowerOb) && lowerOb.length > 3);
            });
        }

        if (match) {
            if (!idsToUpdate.includes(match.id)) {
                idsToUpdate.push(match.id);
                foundNames.push(`${reqName} -> Found as: ${match.name}`);
            }
        } else {
            notFound.push(reqName);
        }
    }

    if (idsToUpdate.length > 0) {
        console.log(`Found ${idsToUpdate.length} matches. Updating...`);
        const { error: updateError } = await supabase
            .from('stores')
            .update({ floor: '-1. Kat' })
            .in('id', idsToUpdate);

        if (updateError) {
            console.error("Update failed:", updateError);
        } else {
            console.log("✅ Success! Updated floors for:");
            foundNames.forEach(n => console.log(` - ${n}`));
        }
    } else {
        console.log("No matching stores found to update.");
    }

    if (notFound.length > 0) {
        console.log("\n⚠️ Could not find the following stores to update:");
        notFound.forEach(n => console.log(` - ${n}`));
    }
}

updateFloors();
