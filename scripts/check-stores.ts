
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv'; // Note: You might need to install dotenv if using ts-node/tsx without auto-env loading

// Manually load env from .env.local for script usage
const envConfig = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const requestedStores = [
    "Adidas", "Aura", "Ayakkabı Dünyası", "Benetton", "Beymen Business", "Calvin Klein", "Carrefour", "Colins", "DeFacto", "Fenerium",
    "Gant", "GS Store", "Hummel", "InStreet", "InterSport", "Jack & Jones", "JePublic", "Kiğılı", "Lescon", "Levi’s",
    "Lufian", "Mavi Jeans", "Nautica", "Nike", "Puma", "Skechers", "SuperStep", "Tommy Hilfiger", "ToyzzShop",
    "Arden FC", "Bambi", "Baransu Halı", "Baransu Yatak", "Exuma", "Gold Magazin", "Greyder", "Karaca Porselen", "Koçtaş", "Korkmaz",
    "Marka", "Sarar", "Taç Züccaciye", "Vivense", "Zenora Mobilya", "Akbank", "Albaraka", "Atasay", "Atasun Optik", "Beko", "Berk Kuyumculuk",
    "Beymen Club", "Bolçi", "Boss", "Boyner", "Coffee Di", "Columbia", "Cozy Cart’s", "D Diamond", "Derimod", "DP Parfume",
    "D’S Damat", "Eczane", "Entertainment Electronics", "GAP", "Garanti Bankası", "Gratis", "Guess", "Halkbank", "Hisar", "HSBC", "ING",
    "I Think Hardware", "İş Bankası", "Karaca", "Kahve Dünyası", "Knitss", "KRC Züccaciye", "Madame Coco", "Marks & Spencer", "Mado", "My Optical",
    "Optik Palermo", "Penti", "Point Optik", "QNB", "Saat & Saat", "Samsonite", "Samsung", "Simitçi Dünyası", "Starbucks", "TEB", "Tefal",
    "Tuğra Gümüş & Tesbih", "Turkish Airlines", "Turkcell", "Türk Telekom", "Union Takı", "Vakıfbank", "VDR", "Watsons", "Yves Rocher", "Yükselen Saat",
    "Ziraat Bankası", "Archangel", "Armine", "Batık", "Ceyo", "Dagi", "Ekol", "Elis Gümüş Kiosk", "English Home", "FLO", "Gusto", "Haribo Kiosk",
    "IGS", "Jimmy Key", "Journey", "Koton", "Lee Cooper", "Moa IGL", "Pierre Cardin", "Prestij Aksesuar", "Setrms", "Sitare", "Suwen", "Tanca", "Tergan",
    "Tiffany Tomato", "Tudors Fashion", "U.S. Polo", "Armağan Oyuncak", "Atış Poligonu", "Balon Evi", "Bosch", "Bubble Tea", "Bursa Kebap Evi",
    "Cinema", "Çaytaze", "Çocuk Atölye", "D&R Music & Book Store", "Eğlence Adası", "HD İskender", "Kahveci", "Kayseri Mutfağı", "Korku Evi",
    "Lahmacun Mola", "LG", "McDonald’s", "Meywa Waffle", "Öküz Burger", "Pideli", "Popeyes", "Riva Balo ve Nikah Salonu", "Rossmann", "Siemens",
    "Sbarro", "Softplay", "Terra Pizza", "Tavuk Dünyası", "Trambolin", "TTO Kozmetik", "Vestel", "Yaprak Döner", "Yemenli"
];

async function checkStores() {
    console.log("Checking stores in database...");

    // Fetch all stores from DB
    // We select name to minimize data transfer but get all of them
    // Using simple pagination loop if needed, but for <1000 items single fetch with explicit limit is fine.
    const { data: dbStores, error } = await supabase
        .from('stores')
        .select('name')
        .limit(1000);

    if (error) {
        console.error("Error fetching stores:", error);
        return;
    }

    const dbStoreNames = new Set(dbStores.map(s => {
        return s.name.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/i/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, '');
    }));

    const missing: string[] = [];
    const found: string[] = [];

    requestedStores.forEach(reqName => {
        let normalizedReq = reqName.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/i/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]/g, ''); // Remove spaces and special chars like &

        // Exact match on normalized string
        const isFound = dbStoreNames.has(normalizedReq);

        // Also try partial match if exact fails (e.g. Mavi vs Mavi Jeans)
        const isPartialFound = !isFound && Array.from(dbStoreNames).some(dbName =>
            dbName.includes(normalizedReq) || normalizedReq.includes(dbName)
        );

        if (isFound || isPartialFound) {
            found.push(reqName);
        } else {
            missing.push(reqName);
        }
    });

    console.log(`\nFound: ${found.length}`);
    console.log(`Missing: ${missing.length}`);

    if (missing.length > 0) {
        console.log("\n--- Missing Stores ---");
        missing.forEach(m => console.log(`- ${m}`));
    } else {
        console.log("\nAll stores are present!");
    }
}

checkStores();
