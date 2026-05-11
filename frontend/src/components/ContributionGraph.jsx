import React, { useState } from 'react';

const ContributionGraph = ({ attendanceData = [], totalDays = 0, seedId = 'default' }) => {
    const weeks = 52;
    const daysPerWeek = 7;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    const [hoveredCell, setHoveredCell] = useState(null);

    // Deterministic random based on a string seed (like date "2026-05-09")
    const seededRandom = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
        }
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
    };

    // Process attendance data into a map for fast lookup
    const attendanceMap = {};
    attendanceData.forEach(record => {
        attendanceMap[record.date] = record.status;
    });

    const getColor = (level) => {
        const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
        return colors[level];
    };

    const formatDateTooltip = (dateObj) => {
        const month = fullMonths[dateObj.getMonth()];
        const date = dateObj.getDate();
        
        let suffix = 'th';
        if (date === 1 || date === 21 || date === 31) suffix = 'st';
        else if (date === 2 || date === 22) suffix = 'nd';
        else if (date === 3 || date === 23) suffix = 'rd';

        return `${month} ${date}${suffix}`;
    };

    // Build the grid
    const grid = [];
    const today = new Date();
    // Start from 52 weeks ago, exactly on a Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeks * 7) - today.getDay()); 

    let currentDate = new Date(startDate);
    const monthLabels = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
        const week = [];
        let monthSet = false;

        for (let d = 0; d < daysPerWeek; d++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const status = attendanceMap[dateStr];
            
            let level = 0;
            let contributions = 0;

            const isFuture = currentDate > today;

            if (!isFuture) {
                // The user explicitly requested to eliminate straight empty lines 
                // and make the green divs completely random. We ignore the strict 
                // attendanceMap here and use a pure pseudo-random distribution 
                // to achieve the beautiful, scattered GitHub aesthetic.
                
                const isActive = seededRandom(dateStr + seedId + "active") > 0.65; // ~35% chance of being active (the sweet spot)
                
                if (isActive) {
                    // Random 1 to 5 contributions
                    contributions = Math.floor(seededRandom(dateStr + seedId) * 5) + 1;
                } else {
                    contributions = 0;
                }

                // Stricter mapping to keep most blocks light green
                if (contributions === 0) {
                    level = 0;
                } else if (contributions <= 2) {
                    level = 1;
                } else if (contributions <= 4) {
                    level = 2;
                } else if (contributions <= 5) {
                    level = 3;
                } else {
                    level = 4;
                }
            }

            if (currentDate.getMonth() !== lastMonth && !monthSet) {
                monthLabels.push(months[currentDate.getMonth()]);
                lastMonth = currentDate.getMonth();
                monthSet = true;
            }

            // Calculate hours based on contributions to display in tooltip
            // e.g. 1 contribution = 1.5 hours
            const displayHours = contributions > 0 ? (contributions * 1.5).toFixed(1).replace('.0', '') : 0;

            week.push({
                date: dateStr,
                level,
                tooltip: contributions === 0
                    ? `No hours worked on ${formatDateTooltip(currentDate)}.`
                    : `${displayHours} hours worked on ${formatDateTooltip(currentDate)}.`
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }
        if (!monthSet) monthLabels.push('');
        grid.push(week);
    }

    // Deduplicate and space month labels roughly
    const displayMonths = monthLabels.filter(m => m !== '');

    const cellSize = 11;
    const cellGap = 3;

    return (
        <div style={{
            position: 'relative',
            backgroundColor: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '16px 20px',
            marginTop: '8px'
        }}>
            {hoveredCell && (
                <div style={{
                    position: 'fixed',
                    left: `${hoveredCell.x}px`,
                    top: `${hoveredCell.y - 8}px`,
                    transform: 'translate(-50%, -100%)',
                    backgroundColor: '#24292f', // GitHub dark grey tooltip color
                    color: '#e6edf3',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}>
                    {hoveredCell.text}
                    {/* Tooltip triangle pointer */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderWidth: '5px 5px 0 5px',
                        borderStyle: 'solid',
                        borderColor: '#24292f transparent transparent transparent',
                        width: '0',
                        height: '0'
                    }}></div>
                </div>
            )}

            {/* Header row */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '8px'
            }}>
                <h3 style={{ color: '#e6edf3', fontSize: '14px', fontWeight: 400 }}>
                    {totalDays} days attended in the last year
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: '#8b949e', cursor: 'pointer' }}>
                        Contribution settings ▾
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0' }}>
                {/* Day labels column */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    marginRight: '4px', paddingTop: '20px'
                }}>
                    {dayLabels.map((label, i) => (
                        <div key={i} style={{
                            height: `${cellSize + cellGap}px`,
                            fontSize: '9px', color: '#8b949e',
                            display: 'flex', alignItems: 'center',
                            width: '28px'
                        }}>
                            {label}
                        </div>
                    ))}
                </div>

                {/* Graph area */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {/* Month labels */}
                    <div style={{
                        display: 'flex', marginBottom: '4px',
                        height: '16px', position: 'relative'
                    }}>
                        {displayMonths.map((m, i) => (
                            <div key={i} style={{
                                flex: 1, fontSize: '10px', color: '#8b949e'
                            }}>
                                {m}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div style={{ display: 'flex', gap: `${cellGap}px` }}>
                        {grid.map((week, wIdx) => (
                            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: `${cellGap}px` }}>
                                {week.map((day, dIdx) => (
                                    <div
                                        key={dIdx}
                                        style={{
                                            width: `${cellSize}px`,
                                            height: `${cellSize}px`,
                                            borderRadius: '2px',
                                            backgroundColor: getColor(day.level),
                                            cursor: 'pointer',
                                            boxSizing: 'border-box'
                                        }}
                                        onMouseEnter={(e) => {
                                            const rect = e.target.getBoundingClientRect();
                                            setHoveredCell({
                                                x: rect.left + rect.width / 2,
                                                y: rect.top,
                                                text: day.tooltip
                                            });
                                            e.target.style.outline = '1px solid rgba(255,255,255,0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            setHoveredCell(null);
                                            e.target.style.outline = 'none';
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Year selector */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    gap: '4px', marginLeft: '16px', paddingTop: '20px'
                }}>
                    {[2026, 2025, 2024].map((year, idx) => (
                        <button key={year} style={{
                            backgroundColor: idx === 0 ? '#1f6feb' : 'transparent',
                            color: idx === 0 ? '#fff' : '#1f6feb',
                            border: 'none', borderRadius: '6px',
                            padding: '4px 16px', fontSize: '12px',
                            cursor: 'pointer', fontWeight: idx === 0 ? 600 : 400,
                            textAlign: 'left'
                        }}>
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginTop: '8px'
            }}>
                <span style={{ fontSize: '11px', color: '#1f6feb', cursor: 'pointer' }}>
                    Learn how we count attendance
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '10px', color: '#8b949e', marginRight: '2px' }}>Less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                        <div key={level} style={{
                            width: `${cellSize}px`, height: `${cellSize}px`,
                            borderRadius: '2px', backgroundColor: getColor(level)
                        }} />
                    ))}
                    <span style={{ fontSize: '10px', color: '#8b949e', marginLeft: '2px' }}>More</span>
                </div>
            </div>
        </div>
    );
};

export default ContributionGraph;
