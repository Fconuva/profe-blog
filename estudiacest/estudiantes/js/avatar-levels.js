/**
 * AVATAR LEVELS — Sistema de 200 niveles
 * Shared across all student platform pages
 * 
 * TIERS (20 niveles cada uno):
 *   Bronce    1-20    🥉  XP per level: 25
 *   Plata     21-40   🥈  XP per level: 35
 *   Oro       41-60   🥇  XP per level: 50
 *   Platino   61-80   💠  XP per level: 70
 *   Diamante  81-100  💎  XP per level: 100
 *   Maestro   101-120 🏅  XP per level: 140
 *   Gran M.   121-140 🏆  XP per level: 190
 *   Élite     141-160 ⚡  XP per level: 250
 *   Leyenda   161-180 🔥  XP per level: 350
 *   Mítico    181-200 👑  XP per level: 500
 */

(function(root) {
    'use strict';

    var TIERS = [
        { name:'Bronce',       emoji:'🥉', color:'#cd7f32', bg:'linear-gradient(135deg,#92400e,#b45309)', from:1,   to:20,  xpPer:25  },
        { name:'Plata',        emoji:'🥈', color:'#94a3b8', bg:'linear-gradient(135deg,#475569,#64748b)', from:21,  to:40,  xpPer:35  },
        { name:'Oro',          emoji:'🥇', color:'#eab308', bg:'linear-gradient(135deg,#a16207,#ca8a04)', from:41,  to:60,  xpPer:50  },
        { name:'Platino',      emoji:'💠', color:'#06b6d4', bg:'linear-gradient(135deg,#0e7490,#22d3ee)', from:61,  to:80,  xpPer:70  },
        { name:'Diamante',     emoji:'💎', color:'#8b5cf6', bg:'linear-gradient(135deg,#6d28d9,#a78bfa)', from:81,  to:100, xpPer:100 },
        { name:'Maestro',      emoji:'🏅', color:'#f59e0b', bg:'linear-gradient(135deg,#d97706,#fbbf24)', from:101, to:120, xpPer:140 },
        { name:'Gran Maestro', emoji:'🏆', color:'#10b981', bg:'linear-gradient(135deg,#047857,#34d399)', from:121, to:140, xpPer:190 },
        { name:'Élite',        emoji:'⚡', color:'#3b82f6', bg:'linear-gradient(135deg,#1d4ed8,#60a5fa)', from:141, to:160, xpPer:250 },
        { name:'Leyenda',      emoji:'🔥', color:'#ef4444', bg:'linear-gradient(135deg,#b91c1c,#f87171)', from:161, to:180, xpPer:350 },
        { name:'Mítico',       emoji:'👑', color:'#d946ef', bg:'linear-gradient(135deg,#a21caf,#e879f9)', from:181, to:200, xpPer:500 }
    ];

    // Pre-compute XP thresholds for all 200 levels
    var LEVELS = [];  // index 0 = level 1
    var cumXP = 0;
    for (var t = 0; t < TIERS.length; t++) {
        var tier = TIERS[t];
        for (var lv = tier.from; lv <= tier.to; lv++) {
            LEVELS.push({
                level: lv,
                xp: cumXP,
                title: tier.name + ' ' + (lv - tier.from + 1),
                emoji: tier.emoji,
                tier: tier.name,
                tierIdx: t,
                color: tier.color,
                bg: tier.bg
            });
            cumXP += tier.xpPer;
        }
    }
    // Total XP for level 200: sum of all xpPer = 20*(25+35+50+70+100+140+190+250+350+500) = 20*1710 = 34200
    // XP to REACH level 200 = 34200 - 500 = 33700

    /**
     * Get level info from total XP
     * @param {number} totalXP
     * @returns {{ level:number, xp:number, title:string, emoji:string, tier:string, tierIdx:number, color:string, bg:string }}
     */
    function getLevel(totalXP) {
        for (var i = LEVELS.length - 1; i >= 0; i--) {
            if (totalXP >= LEVELS[i].xp) return LEVELS[i];
        }
        return LEVELS[0];
    }

    /**
     * Get level + next level info
     * @param {number} totalXP
     * @returns {{ current: object, next: object|null, progress: number }}
     */
    function getLevelInfo(totalXP) {
        var current = LEVELS[0], next = LEVELS[1] || null;
        for (var i = LEVELS.length - 1; i >= 0; i--) {
            if (totalXP >= LEVELS[i].xp) {
                current = LEVELS[i];
                next = LEVELS[i + 1] || null;
                break;
            }
        }
        var progress = 0;
        if (next) {
            progress = Math.round(((totalXP - current.xp) / (next.xp - current.xp)) * 100);
        } else {
            progress = 100;
        }
        return { current: current, next: next, progress: progress };
    }

    /**
     * Get tier info from level number
     * @param {number} level (1-200)
     * @returns {object} tier
     */
    function getTier(level) {
        for (var i = TIERS.length - 1; i >= 0; i--) {
            if (level >= TIERS[i].from) return TIERS[i];
        }
        return TIERS[0];
    }

    /**
     * Calculate "power" score for ranking: level * 100 + xpIntoCurrentLevel
     * This creates a fine-grained numeric score for ordering
     * @param {number} totalXP
     * @returns {number}
     */
    function getPower(totalXP) {
        var info = getLevelInfo(totalXP);
        var xpInto = totalXP - info.current.xp;
        return info.current.level * 100 + Math.min(99, info.progress);
    }

    // Export
    var AvatarSystem = {
        TIERS: TIERS,
        LEVELS: LEVELS,
        MAX_LEVEL: 200,
        getLevel: getLevel,
        getLevelInfo: getLevelInfo,
        getTier: getTier,
        getPower: getPower
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AvatarSystem;
    } else {
        root.AvatarSystem = AvatarSystem;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
