// =========================================================================
// SPECIMENRY — mineral-care.js
// Extracted from app.js: chemical formula formatting/parsing, elemental
// composition, and mineral hazard & storage-care guidance.
// Loaded as a classic script before app.js (see index.html).
// =========================================================================
function formatChemicalFormula(formula) {
    if (!formula) return '';
    return formula.replace(/(\d+)/g, '<sub>$1</sub>');
}

// =========================================================================
// MINERAL CARE — formula parsing, composition %, hazard & storage alerts
// =========================================================================
var ATOMIC_WEIGHTS = {
    H: 1.008, He: 4.003, Li: 6.94, Be: 9.012, B: 10.81, C: 12.011, N: 14.007,
    O: 15.999, F: 18.998, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085,
    P: 30.974, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Ti: 47.867,
    V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693,
    Cu: 63.546, Zn: 65.38, As: 74.922, Se: 78.971, Br: 79.904, Sr: 87.62,
    Zr: 91.224, Mo: 95.95, Ag: 107.87, Cd: 112.41, Sn: 118.71, Sb: 121.76,
    Te: 127.60, I: 126.90, Ba: 137.33, W: 183.84, Au: 196.97, Hg: 200.59,
    Tl: 204.38, Pb: 207.2, Bi: 208.98, Th: 232.04, U: 238.03
};

var ELEMENT_BAR_COLORS = {
    H: '#94a3b8', C: '#475569', O: '#0ea5e9', S: '#ca8a04', Fe: '#b45309',
    Cu: '#c2410c', Pb: '#64748b', Hg: '#0f766e', As: '#b91c1c', Si: '#78716c',
    Ca: '#a8a29e', Na: '#f59e0b', Mg: '#65a30d', Al: '#a1a1aa', Zn: '#71717a',
    Cl: '#22c55e', K: '#eab308', P: '#d97706', F: '#14b8a6', Ba: '#78716c',
    Sb: '#a16207', Cd: '#92400e', U: '#15803d', Th: '#166534', Be: '#b45309',
    Ag: '#9ca3af', Au: '#d97706', Ni: '#78716c', Mn: '#a16207', Cr: '#4d7c0f'
};

var TOXIC_ELEMENTS = {
    Hg: {
        level: 'danger',
        title: 'Mercury hazard',
        text: 'Contains mercury. Wash hands after handling. Do not inhale dust, heat, or store in unventilated living spaces.'
    },
    As: {
        level: 'danger',
        title: 'Arsenic hazard',
        text: 'Contains arsenic. Avoid dust inhalation and prolonged skin contact. Wash hands thoroughly after handling.'
    },
    Pb: {
        level: 'warning',
        title: 'Lead content',
        text: 'Contains lead. Minimize dust, wash hands after handling, and keep away from food-prep surfaces.'
    },
    Cd: {
        level: 'danger',
        title: 'Cadmium hazard',
        text: 'Contains cadmium. Treat as toxic — avoid dust and wash hands after any contact.'
    },
    Tl: {
        level: 'danger',
        title: 'Thallium hazard',
        text: 'Contains thallium. Highly toxic — handle with gloves and store securely away from living areas.'
    },
    Sb: {
        level: 'warning',
        title: 'Antimony content',
        text: 'Contains antimony. Avoid generating dust; wash hands after handling.'
    },
    Be: {
        level: 'warning',
        title: 'Beryllium dust risk',
        text: 'Beryllium-bearing minerals can be hazardous if dust is inhaled. Prefer sealed display; do not grind or sand.'
    },
    U: {
        level: 'danger',
        title: 'Radioactive uranium',
        text: 'Uranium-bearing. Store ventilated/away from prolonged close contact; check local guidance for radioactive specimens.'
    },
    Th: {
        level: 'danger',
        title: 'Radioactive thorium',
        text: 'Thorium-bearing. Store thoughtfully, limit prolonged proximity, and avoid creating dust.'
    },
    Se: {
        level: 'caution',
        title: 'Selenium content',
        text: 'Selenium can be toxic in dust form. Avoid inhaling powder; wash hands after handling.'
    },
    Ba: {
        level: 'caution',
        title: 'Barium content',
        text: 'Soluble barium salts are toxic. Keep dry specimens intact; wash hands after handling powders or fragments.'
    }
};

var MINERAL_CARE_PROFILES = [
    {
        keys: ['pyrite', 'marcasite'],
        formulaHints: ['FeS2'],
        alerts: [{
            level: 'warning',
            title: 'Pyrite decay risk',
            text: 'Iron sulfides can oxidize (“pyrite disease”) in humid air. Keep below ~45% RH, dry storage preferred, check periodically for powdery sulfate bloom.'
        }]
    },
    {
        keys: ['cinnabar'],
        formulaHints: ['HgS'],
        alerts: [{
            level: 'danger',
            title: 'Mercury mineral',
            text: 'Cinnabar is HgS. Wash hands after handling; do not heat or inhale dust; avoid long-term open storage in living rooms.'
        }]
    },
    {
        keys: ['galena'],
        formulaHints: ['PbS'],
        alerts: [{
            level: 'warning',
            title: 'Lead sulfide',
            text: 'Galena contains lead. Handle with care, wash hands, and keep dust contained.'
        }]
    },
    {
        keys: ['halite', 'sylvite', 'chalcanthite', 'melanterite', 'epsomite', 'borax'],
        formulaHints: ['NaCl', 'KCl', 'CuSO4', 'FeSO4', 'MgSO4'],
        alerts: [{
            level: 'caution',
            title: 'Deliquescence / humidity',
            text: 'Water-soluble or hydrate-prone. Keep in a sealed box with desiccant; high humidity can soften, weep, or dissolve the specimen.'
        }]
    },
    {
        keys: ['realgar', 'orpiment', 'proustite', 'pyrargyrite'],
        formulaHints: ['As4S4', 'As2S3', 'AsS'],
        alerts: [{
            level: 'warning',
            title: 'Light & arsenic sensitive',
            text: 'Light-sensitive arsenic sulfides can degrade or powder under UV/strong light. Display low light / covered storage; toxic if dust is inhaled.'
        }]
    },
    {
        keys: ['gypsum', 'selenite', 'alabaster'],
        formulaHints: ['CaSO4'],
        alerts: [{
            level: 'caution',
            title: 'Soft & water sensitive',
            text: 'Very soft (Mohs ~2) and water-soluble over time. Avoid washing, high humidity, and abrasive cleaning.'
        }]
    },
    {
        keys: ['malachite', 'azurite', 'chrysocolla'],
        formulaHints: [],
        alerts: [{
            level: 'caution',
            title: 'Acid & humidity care',
            text: 'Copper secondaries can react to acids and damp air. Avoid acid cleaners; stable, moderate humidity display is best.'
        }]
    },
    {
        keys: ['fluorite'],
        formulaHints: ['CaF2'],
        alerts: [{
            level: 'info',
            title: 'Cleavage & UV note',
            text: 'Perfect cleavage — protect from knocks. Some fluorite fades under prolonged strong UV; rotate display lighting if vivid color matters.'
        }]
    },
    {
        keys: ['sulfur', 'sulphur'],
        formulaHints: [],
        alerts: [{
            level: 'caution',
            title: 'Heat fragile',
            text: 'Native sulfur cracks with temperature swings. Keep cool, avoid direct sun/heat lamps, and handle gently.'
        }]
    },
    {
        keys: ['amber'],
        formulaHints: [],
        alerts: [{
            level: 'caution',
            title: 'Organic / UV sensitive',
            text: 'Amber can darken or craze with UV and dry air. Prefer low light and stable humidity; avoid solvents and ultrasonic cleaners.'
        }]
    }
];

var KNOWN_MINERAL_FORMULAS = {
    pyrite: 'FeS2', marcasite: 'FeS2', galena: 'PbS', cinnabar: 'HgS',
    chalcanthite: 'CuSO4·5H2O', halite: 'NaCl', sylvite: 'KCl',
    realgar: 'As4S4', orpiment: 'As2S3', quartz: 'SiO2', amethyst: 'SiO2',
    calcite: 'CaCO3', gypsum: 'CaSO4·2H2O', fluorite: 'CaF2',
    hematite: 'Fe2O3', magnetite: 'Fe3O4', malachite: 'Cu2CO3(OH)2',
    azurite: 'Cu3(CO3)2(OH)2', barite: 'BaSO4', baryte: 'BaSO4',
    cerussite: 'PbCO3', anglesite: 'PbSO4', stibnite: 'Sb2S3',
    sphalerite: 'ZnS', chalcopyrite: 'CuFeS2', bornite: 'Cu5FeS4',
    covellite: 'CuS', cuprite: 'Cu2O', rutile: 'TiO2', corundum: 'Al2O3',
    emerald: 'Be3Al2Si6O18', beryl: 'Be3Al2Si6O18',
    apatite: 'Ca5(PO4)3F', turquoise: 'CuAl6(PO4)4(OH)8·4H2O',
    melanterite: 'FeSO4·7H2O', epsomite: 'MgSO4·7H2O', sulfur: 'S',
    sulphur: 'S', graphite: 'C', diamond: 'C', gold: 'Au', silver: 'Ag',
    copper: 'Cu'
};

function normalizeMineralFormula(raw) {
    if (!raw) return '';
    var s = String(raw).trim();
    var subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
    s = s.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, function(ch) { return subMap[ch]; });
    s = s.replace(/[·∙•⋅×]/g, '·');
    s = s.replace(/\s+/g, '');
    return s;
}

function parseChemicalFormula(raw) {
    var str = normalizeMineralFormula(raw);
    if (!str) return null;

    var i = 0;
    function readNumber() {
        if (i >= str.length || !/[0-9.]/.test(str.charAt(i))) return null;
        var start = i;
        while (i < str.length && /[0-9.]/.test(str.charAt(i))) i++;
        var n = parseFloat(str.slice(start, i));
        return isNaN(n) ? null : n;
    }

    function mergeCounts(target, source, mult) {
        Object.keys(source).forEach(function(el) {
            target[el] = (target[el] || 0) + source[el] * mult;
        });
    }

    function parseGroup() {
        var counts = {};
        while (i < str.length) {
            var ch = str.charAt(i);
            if (ch === ')') {
                break;
            }
            if (ch === '(' || ch === '[') {
                i++;
                var inner = parseGroup();
                if (str.charAt(i) === ')' || str.charAt(i) === ']') i++;
                var mult = readNumber();
                if (mult === null) mult = 1;
                mergeCounts(counts, inner, mult);
            } else if (ch === '·') {
                i++;
                var hydMult = readNumber();
                if (hydMult === null) hydMult = 1;
                var afterDot = parseGroup();
                mergeCounts(counts, afterDot, hydMult);
            } else if (ch === ',') {
                i++;
            } else if (/[A-Z]/.test(ch)) {
                var el = ch;
                i++;
                if (i < str.length && /[a-z]/.test(str.charAt(i))) {
                    el += str.charAt(i);
                    i++;
                }
                var n = readNumber();
                if (n === null) n = 1;
                counts[el] = (counts[el] || 0) + n;
            } else {
                i++;
            }
        }
        return counts;
    }

    try {
        var result = parseGroup();
        if (Object.keys(result).length === 0) return null;
        return result;
    } catch (e) {
        return null;
    }
}

function getElementComposition(counts) {
    if (!counts) return [];
    var total = 0;
    var rows = [];
    Object.keys(counts).forEach(function(el) {
        var mass = ATOMIC_WEIGHTS[el];
        if (!mass) return;
        var w = mass * counts[el];
        total += w;
        rows.push({ element: el, atoms: counts[el], weight: w });
    });
    if (total <= 0) return [];
    rows.forEach(function(r) {
        r.percent = (r.weight / total) * 100;
    });
    rows.sort(function(a, b) { return b.percent - a.percent; });
    return rows;
}

function lookupKnownFormula(specimenName) {
    if (!specimenName) return '';
    var key = specimenName.toLowerCase().trim();
    if (KNOWN_MINERAL_FORMULAS[key]) return KNOWN_MINERAL_FORMULAS[key];
    var names = Object.keys(KNOWN_MINERAL_FORMULAS);
    for (var i = 0; i < names.length; i++) {
        if (key.indexOf(names[i]) !== -1) return KNOWN_MINERAL_FORMULAS[names[i]];
    }
    return '';
}

function analyzeMineralCare(formula, specimenName) {
    var usedFormula = (formula || '').trim();
    var inferred = false;
    if (!usedFormula) {
        usedFormula = lookupKnownFormula(specimenName);
        inferred = !!usedFormula;
    }

    var counts = parseChemicalFormula(usedFormula);
    var composition = getElementComposition(counts);
    var alerts = [];
    var seenTitles = {};

    function pushAlert(alert) {
        if (!alert || seenTitles[alert.title]) return;
        seenTitles[alert.title] = true;
        alerts.push(alert);
    }

    if (counts) {
        Object.keys(counts).forEach(function(el) {
            if (TOXIC_ELEMENTS[el]) pushAlert(TOXIC_ELEMENTS[el]);
        });
    }

    var nameKey = (specimenName || '').toLowerCase();
    var normFormula = normalizeMineralFormula(usedFormula);
    MINERAL_CARE_PROFILES.forEach(function(profile) {
        var nameHit = profile.keys.some(function(k) { return nameKey.indexOf(k) !== -1; });
        var formulaHit = profile.formulaHints.some(function(h) {
            var nh = normalizeMineralFormula(h);
            return nh && normFormula && normFormula.indexOf(nh) !== -1;
        });
        if (nameHit || formulaHit) {
            profile.alerts.forEach(pushAlert);
        }
    });

    var levelRank = { danger: 0, warning: 1, caution: 2, info: 3 };
    alerts.sort(function(a, b) {
        return (levelRank[a.level] || 9) - (levelRank[b.level] || 9);
    });

    return {
        formula: usedFormula,
        inferred: inferred,
        composition: composition,
        alerts: alerts,
        parseOk: !!counts && composition.length > 0
    };
}

function renderMineralCareHtml(analysis, options) {
    options = options || {};
    if (!analysis || (!analysis.parseOk && (!analysis.alerts || analysis.alerts.length === 0))) {
        if (options.showEmptyHint) {
            return '<div class="mineral-care-empty">Enter a formula (e.g. FeS₂, HgS, CuSO₄·5H₂O) for composition & care guidance.</div>';
        }
        return '';
    }

    var html = '<div class="mineral-care-panel-inner">';

    if (analysis.parseOk) {
        html += '<div class="mineral-care-header">' +
            '<span class="mineral-care-title">Elemental composition</span>' +
            '<span class="mineral-care-formula">' + formatChemicalFormula(analysis.formula) + '</span>' +
            (analysis.inferred ? '<span class="mineral-care-inferred">from specimen name</span>' : '') +
            '</div>';
        html += '<div class="mineral-comp-bars">';
        analysis.composition.forEach(function(row) {
            var color = ELEMENT_BAR_COLORS[row.element] || 'var(--accent)';
            var pct = row.percent.toFixed(1);
            html += '<div class="mineral-comp-row" title="' + escapeHtml(row.element) + ': ' + pct + ' wt%">' +
                '<span class="mineral-comp-el">' + escapeHtml(row.element) + '</span>' +
                '<div class="mineral-comp-track"><div class="mineral-comp-fill" style="width:' + pct + '%; background:' + color + ';"></div></div>' +
                '<span class="mineral-comp-pct">' + pct + '%</span>' +
                '</div>';
        });
        html += '</div>';
    } else if (analysis.formula) {
        html += '<div class="mineral-care-empty">Could not fully parse “' + escapeHtml(analysis.formula) + '”. Recognized care tips still apply below.</div>';
    }

    if (analysis.alerts && analysis.alerts.length > 0) {
        html += '<div class="mineral-care-alerts">';
        analysis.alerts.forEach(function(a) {
            html += '<div class="mineral-care-alert level-' + escapeHtml(a.level) + '">' +
                '<div class="mineral-care-alert-title">' + escapeHtml(a.title) + '</div>' +
                '<div class="mineral-care-alert-text">' + escapeHtml(a.text) + '</div>' +
                '</div>';
        });
        html += '</div>';
    }

    html += '</div>';
    return html;
}

function getMineralHazardBadgeHtml(formula, specimenName) {
    var analysis = analyzeMineralCare(formula, specimenName);
    if (!analysis.alerts.length) return '';
    var top = analysis.alerts[0];
    var icon = top.level === 'danger' ? '☠️' : (top.level === 'warning' ? '⚠️' : '💧');
    var label = top.level === 'danger' ? 'Toxic' : (top.level === 'warning' ? 'Handle with care' : 'Special storage');
    return '<span class="mineral-hazard-badge level-' + escapeHtml(top.level) + '" title="' + escapeHtml(top.title + ' — ' + top.text) + '">' +
        icon + ' ' + label + '</span>';
}
