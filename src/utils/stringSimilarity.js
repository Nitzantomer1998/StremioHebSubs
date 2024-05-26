const stringSimilarity = (firstString, secondString) => {
    if (!firstString || !secondString) return 0;

    const first = firstString.replace(/\s+/g, "");
    const second = secondString.replace(/\s+/g, "");

    if (first === second) return 1;
    if (first.length < 2 || second.length < 2) return 0;

    const bigramCounts = {};
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        bigramCounts[bigram] = (bigramCounts[bigram] || 0) + 1;
    }

    let commonBigramCount = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        if (bigramCounts[bigram] > 0) {
            bigramCounts[bigram]--;
            commonBigramCount++;
        }
    }

    const similarity = (2.0 * commonBigramCount) / (first.length + second.length - 2);
    return Math.round(similarity * 100);
};


export default stringSimilarity;