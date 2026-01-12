
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const storesToUpdate = [
    "Archangel", "Armine", "Atasay", "Bambi", "Batık", "Ceyo", "Dagi",
    "Ekol", "Elis Gümüş Kiosk", "English Home", "FLO", "Gold Magazin",
    "Gusto", "Haribo Kiosk", "IGS", "Jimmy Key", "Journey", "Koton",
    "Lee Cooper", "Moa IGL", "Pierre Cardin", "Prestij Aksesuar", "Sarar",
    "Setrms", "Sitare", "Suwen", "Tanca", "Tergan", "Tiffany Tomato",
    "Tudors Fashion", "U.S. Polo"
];

async function updateFloorsFirst() {
    console.log(`Searching for ${storesToUpdate.length} stores to update to '1. Kat'...`);

    const { data: allStores, error } = await supabase.from('stores').select('id, name');
    if (error) {
        console.error("Error fetching stores:", error);
        return;
    }

    const idsToUpdate: number[] = [];
    const notFound: string[] = [];
    const foundNames: string[] = [];

    for (const reqName of storesToUpdate) {
        // Normalize Turkish chars for comparison
        const lowerReq = reqName.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/i/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');

        const match = allStores.find(s => {
            const lowerOb = s.name.toLowerCase()
                .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/i/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');
            return lowerOb === lowerReq
                || (lowerOb.includes(lowerReq) && lowerReq.length > 3)
                || (lowerReq.includes(lowerOb) && lowerOb.length > 3);
        });

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
            .update({ floor: '1. Kat' })
            .in('id', idsToUpdate);

        if (updateError) {
            console.error("Update failed:", updateError);
        } else {
            console.log("✅ Success! Updated floors for found stores.");
        }
    } else {
        console.log("No matching stores found to update.");
    }

    if (notFound.length > 0) {
        console.log("⚠️ Not Found:", notFound.join(", "));
    }
}

updateFloorsFirst();
