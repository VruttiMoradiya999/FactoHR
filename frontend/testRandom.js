const seededRandom = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
};

let countActive = 0;
let countTotal = 0;
let seedId = '663c87e1a9e9c9b4e5d61234'; // Dummy ID

// Test from Feb 1 2026 to May 9 2026
let d = new Date('2026-02-01T00:00:00Z');
let end = new Date('2026-05-09T00:00:00Z');

while(d <= end) {
    const dateStr = d.toISOString().split('T')[0];
    const isActive = seededRandom(dateStr + seedId + "active") > 0.65;
    if (isActive) countActive++;
    countTotal++;
    d.setDate(d.getDate() + 1);
}

console.log(`Active: ${countActive}/${countTotal} (${(countActive/countTotal*100).toFixed(1)}%)`);
