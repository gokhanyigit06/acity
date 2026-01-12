const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../acity_tum_magazalar.json');
const outputPath = path.join(__dirname, '../SUPABASE_STORES_ADDITIONAL.sql');

const rawStores = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Deduplicate based on name
const uniqueStores = [];
const seenNames = new Set();

rawStores.forEach(store => {
    const normalizeName = store.name.trim().toUpperCase();
    if (!seenNames.has(normalizeName)) {
        seenNames.add(normalizeName);
        uniqueStores.push(store);
    }
});

// Better slugify for Turkish characters
function turklishSlugify(text) {
    const trMap = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };

    let slug = text.replace(/[çğıiöşüÇĞIİÖŞÜ]/g, (char) => trMap[char] || char);
    return slug.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

let sql = `-- Add new stores (Do NOT drop table)
INSERT INTO stores (name, slug, category, floor, website_url) VALUES
`;

const values = uniqueStores.map(store => {
    const slug = turklishSlugify(store.name);
    // Escape single quotes in name
    const name = store.name.replace(/'/g, "''");
    const floor = store.floor;
    // Map 'Mağazalar' category to 'Mağaza'
    const category = "Mağaza";
    const link = store.link;

    return `('${name}', '${slug}', '${category}', '${floor}', '${link}')`;
});

sql += values.join(',\n') + ' ON CONFLICT (slug) DO NOTHING;';

fs.writeFileSync(outputPath, sql);
console.log('SQL generated at ' + outputPath);
console.log(`Processed ${rawStores.length} entries. Generating inserts for ${uniqueStores.length} unique stores (DB will skip overlaps like 'Starbucks' if already exists).`);
