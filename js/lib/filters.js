// =========================================================================
// SPECIMENRY — filters.js
// Persists the search/filter bar to localStorage so it survives reloads.
// Loaded as a classic script before app.js (see index.html).
//
// Note: the archive view (localStorage key "current_view") and the grid/
// list layout (localStorage key "fossil_layout_view") already have their
// own dedicated persistence + restore logic elsewhere in the app. They are
// captured here as read-only fields for a complete snapshot, but restore()
// deliberately does not re-apply them so it can't conflict with that
// existing logic.
//
// Wiring (calling save/restore/bindAutoSave at the right times) is done
// from app.js separately — this file only provides the API.
// =========================================================================
var SpecimenryFilters = (function() {
    var STORAGE_KEY = 'specimenry_filter_state';

    var FIELD_IDS = [
        'search',
        'filter-specimen-type',
        'filter-category',
        'filter-type',
        'filter-period',
        'filter-sort'
    ];

    function getEl(id) {
        return document.getElementById(id);
    }

    function save() {
        var state = {};
        FIELD_IDS.forEach(function(id) {
            var el = getEl(id);
            if (el) state[id] = el.value;
        });

        // Read-only snapshot of fields already persisted elsewhere.
        state.current_view = localStorage.getItem('current_view') || '';
        state.layout_view = localStorage.getItem('fossil_layout_view') || '';

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            if (typeof reportAppError === 'function') {
                reportAppError(e, 'SpecimenryFilters.save');
            } else {
                console.error('SpecimenryFilters.save failed:', e);
            }
        }
        return state;
    }

    function restore() {
        var state = null;
        try {
            state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        } catch (e) {
            state = null;
        }
        if (!state) return null;

        FIELD_IDS.forEach(function(id) {
            var el = getEl(id);
            if (el && typeof state[id] !== 'undefined') {
                el.value = state[id];
            }
        });

        // Programmatic .value does not fire oninput/onchange — re-apply the grid filter.
        try {
            if (window.app && typeof window.app.renderFossils === 'function') {
                window.app.renderFossils();
            }
        } catch (e) {}

        return state;
    }

    function bindAutoSave() {
        FIELD_IDS.forEach(function(id) {
            var el = getEl(id);
            if (!el) return;
            var evtName = (id === 'search') ? 'input' : 'change';
            el.addEventListener(evtName, save);
        });
    }

    return {
        save: save,
        restore: restore,
        bindAutoSave: bindAutoSave
    };
})();
