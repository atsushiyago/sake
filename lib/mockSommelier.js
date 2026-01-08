import { SAKE_DATABASE } from "./sakeData";

export async function consultSommelier(input) {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const text = input.toLowerCase();

    // Scoring Logic
    const scoredSake = SAKE_DATABASE.map((sake) => {
        let score = 0;

        // 1. Tag matching (Exact or partial match in tags)
        sake.tags.forEach((tag) => {
            if (text.includes(tag)) {
                score += 3;
            }
        });

        // 2. Name/Brewery matching (Direct request)
        if (text.includes(sake.name) || text.includes(sake.brewery)) {
            score += 10;
        }

        // 3. Flavor/Aroma matching
        // Handle "Sweet" (甘口) vs "Dry" (辛口)
        if (text.includes("甘口") && sake.flavor.includes("甘口")) score += 2;
        if (text.includes("辛口") && sake.flavor.includes("辛口")) score += 2;
        if (text.includes("旨口") && sake.flavor.includes("旨口")) score += 2;
        if (text.includes("フルーティー") && (sake.aroma.includes("華やか") || sake.aroma.includes("フレッシュ"))) score += 2;
        if (text.includes("スッキリ") && (sake.flavor.includes("辛口") || sake.flavor.includes("超辛口"))) score += 2;

        // 4. Vibe matching map (Simple keyword mapping to specific IDs if no specific tags hit)
        // Relaxed/Quiet -> Secchubai, Kakurei
        if ((text.includes("癒や") || text.includes("リラックス") || text.includes("静か")) && (sake.id === "secchubai" || sake.id === "kakurei")) {
            score += 2;
        }
        // Celebrate -> Kubota, Hakkaisan
        if ((text.includes("祝") || text.includes("乾杯")) && (sake.id === "kubota" || sake.id === "hakkaisan")) {
            score += 2;
        }
        // Refresh -> Takachiyo, Jozen
        if ((text.includes("リフレッシュ") || text.includes("気分転換")) && (sake.id === "takachiyo" || sake.id === "jozenmizunogotoshi")) {
            score += 2;
        }

        return { ...sake, score };
    });

    // Sort by score desc, but shuffle ties to give variety if scores are equal
    scoredSake.sort((a, b) => b.score - a.score);

    // If no score > 0, return fallback (Koshinokanbai or Kubota as generic good picks)
    if (scoredSake[0].score === 0) {
        // Return Koshinokanbai and Kubota as default safe picks
        const defaults = scoredSake.filter(s => s.id === "koshinokanbai" || s.id === "kubota");
        return defaults.map(formatResult);
    }

    // Take top 2
    const topResults = scoredSake.slice(0, 2);

    return topResults.map(formatResult);
}

// Helper to format the DB entry into the expected UI object structure
function formatResult(sake) {
    // Parse description for charts (Mocking chart values based on text for now)
    // "【甘辛度】辛口" -> Sweetness 2
    // "【甘辛度】甘口" -> Sweetness 4
    // "【華やか】華やか" -> Aroma 5
    // "【華やか】控えめ" -> Aroma 2

    let sweetness = 3;
    if (sake.flavor.includes("超辛口")) sweetness = 1;
    else if (sake.flavor.includes("辛口")) sweetness = 2;
    else if (sake.flavor.includes("甘口")) sweetness = 4;
    else if (sake.flavor.includes("旨口")) sweetness = 3.5;

    let aroma = 3;
    if (sake.aroma.includes("華やか") || sake.aroma.includes("フルーティー")) aroma = 5;
    else if (sake.aroma.includes("フレッシュ")) aroma = 4;
    else if (sake.aroma.includes("控えめ")) aroma = 2;
    else if (sake.aroma.includes("穏やか")) aroma = 2.5;

    return {
        id: sake.id,
        name: sake.name,
        brewery: sake.brewery,
        reason: generateReason(sake),
        charts: { sweetness, aroma },
        drinkStyle: sake.description.match(/【飲み方】(.*)/)?.[1] || "冷酒・常温", // Extract from description
        pairing: sake.pairing
    };
}

function generateReason(sake) {
    // Simple template tailored to the prompt style. 
    // Ideally this would be dynamic based on the user's input, 
    // but for this database version we use a high-quality static template per brand vibe.
    return `新潟清酒の代表格として名高い${sake.name}。${sake.flavor}で${sake.aroma}な味わいは、今のあなたの気分に寄り添う最高の一杯となるでしょう。特に${sake.pairing}との相性は抜群です。`;
}
