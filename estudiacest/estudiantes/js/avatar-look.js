(function(global) {
    'use strict';

    var ASSET_ROOT = 'assets/avatar';
    var CATEGORY_ORDER = ['skinTone', 'eyes', 'mouth', 'hairStyle', 'hairColor', 'outfit', 'accessory', 'aura'];
    var DEFAULT_LOOK = {
        skinTone: 'clara',
        eyes: 'amables',
        mouth: 'sonrisa',
        hairStyle: 'onda',
        hairColor: 'tinta',
        outfit: 'uniforme',
        accessory: 'none',
        aura: 'none'
    };

    var CATALOG = {
        skinTone: {
            label: 'Piel',
            options: [
                { id: 'clara', name: 'Clara', color: '#f6d5bf', swatch: '#f6d5bf' },
                { id: 'miel', name: 'Miel', color: '#deab7e', swatch: '#deab7e' },
                { id: 'canela', name: 'Canela', color: '#b8754d', swatch: '#b8754d' },
                { id: 'bronce', name: 'Bronce', color: '#8a5339', swatch: '#8a5339' }
            ]
        },
        eyes: {
            label: 'Ojos',
            options: [
                { id: 'amables', name: 'Amables', asset: 'amables.svg', preview: 'oo' },
                { id: 'foco', name: 'Enfocados', asset: 'foco.svg', preview: '--' },
                { id: 'chispa', name: 'Con chispa', asset: 'chispa.svg', preview: '**', minXp: 120 },
                { id: 'calma', name: 'En calma', asset: 'calma.svg', preview: 'uu', minXp: 260 }
            ]
        },
        mouth: {
            label: 'Boca',
            options: [
                { id: 'sonrisa', name: 'Sonrisa', asset: 'sonrisa.svg', preview: ')' },
                { id: 'media', name: 'Media sonrisa', asset: 'media.svg', preview: '/' },
                { id: 'seria', name: 'Seria', asset: 'seria.svg', preview: '_' },
                { id: 'asombro', name: 'Asombro', asset: 'asombro.svg', preview: 'o', minXp: 220 }
            ]
        },
        hairStyle: {
            label: 'Pelo',
            options: [
                { id: 'onda', name: 'Onda', asset: 'onda.svg', preview: 'Ond', minXp: 0 },
                { id: 'puntas', name: 'Puntas', asset: 'puntas.svg', preview: 'Pnt', minXp: 150 },
                { id: 'bob', name: 'Bob', asset: 'bob.svg', preview: 'Bob', minXp: 420 },
                { id: 'rizo', name: 'Rizo', asset: 'rizo.svg', preview: 'Riz', minXp: 900 }
            ]
        },
        hairColor: {
            label: 'Color de pelo',
            options: [
                { id: 'tinta', name: 'Tinta', color: '#1f2937', swatch: '#1f2937' },
                { id: 'castana', name: 'Castana', color: '#6f4e37', swatch: '#6f4e37', minXp: 100 },
                { id: 'miel', name: 'Miel', color: '#d4a64a', swatch: '#d4a64a', minXp: 300 },
                { id: 'cobre', name: 'Cobre', color: '#c96f3b', swatch: '#c96f3b', minXp: 650 }
            ]
        },
        outfit: {
            label: 'Ropa',
            options: [
                { id: 'uniforme', name: 'Uniforme', asset: 'uniforme.svg', color: '#2563eb', preview: 'UNI', minXp: 0 },
                { id: 'hoodie', name: 'Hoodie', asset: 'hoodie.svg', color: '#7c3aed', preview: 'HD', minXp: 180 },
                { id: 'deporte', name: 'Deporte', asset: 'deporte.svg', color: '#059669', preview: 'SP', minXp: 500 },
                { id: 'armadura', name: 'Armadura', asset: 'armadura.svg', color: '#f97316', preview: 'AR', minXp: 1100 }
            ]
        },
        accessory: {
            label: 'Accesorio',
            options: [
                { id: 'none', name: 'Sin accesorio', asset: '', color: 'transparent', preview: '0' },
                { id: 'lentes', name: 'Lentes', asset: 'lentes.svg', color: '#111827', preview: 'LN', minXp: 120 },
                { id: 'audifonos', name: 'Audifonos', asset: 'audifonos.svg', color: '#0f766e', preview: 'AU', minXp: 700 },
                { id: 'corona', name: 'Corona', asset: 'corona.svg', color: '#facc15', preview: 'CR', minXp: 2500, rewardAnyOf: ['corona_suprema'] }
            ]
        },
        aura: {
            label: 'Aura',
            options: [
                { id: 'none', name: 'Sin aura', preview: '0' },
                { id: 'chispa', name: 'Chispas', preview: 'CH', minXp: 300 },
                { id: 'fuego', name: 'Fuego', preview: 'FG', minXp: 1200 },
                { id: 'oro', name: 'Oro', preview: 'OR', minXp: 3500, rewardAnyOf: ['aura_dorada'] }
            ]
        }
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function buildContext(context) {
        return {
            xpTotal: Number(context && context.xpTotal) || 0,
            avatarData: (context && context.avatarData) || {}
        };
    }

    function getCategory(categoryId) {
        return CATALOG[categoryId] || null;
    }

    function getOption(categoryId, optionId) {
        var category = getCategory(categoryId);
        if (!category) return null;
        return category.options.find(function(option) {
            return option.id === optionId;
        }) || null;
    }

    function hasReward(avatarData, rewardKey) {
        var rewards = (avatarData && avatarData.recompensas) || {};
        var cosmetics = (avatarData && avatarData.cosmeticos) || {};
        if (rewardKey === 'aura_dorada') {
            return !!rewards.aura_dorada || cosmetics.aura === 'dorada';
        }
        if (rewardKey === 'corona_suprema') {
            return !!rewards.corona_suprema || cosmetics.corona === 'suprema';
        }
        return !!rewards[rewardKey] || !!cosmetics[rewardKey];
    }

    function isUnlocked(option, context) {
        if (!option) return false;
        var resolved = buildContext(context);
        if (Array.isArray(option.rewardAnyOf) && option.rewardAnyOf.some(function(rewardKey) {
            return hasReward(resolved.avatarData, rewardKey);
        })) {
            return true;
        }
        if (typeof option.minXp === 'number') {
            return resolved.xpTotal >= option.minXp;
        }
        return true;
    }

    function getUnlockedOptions(categoryId, context) {
        var category = getCategory(categoryId);
        if (!category) return [];
        return category.options.filter(function(option) {
            return isUnlocked(option, context);
        });
    }

    function getFallbackOption(categoryId, context) {
        var unlocked = getUnlockedOptions(categoryId, context);
        return unlocked[0] || (getCategory(categoryId) && getCategory(categoryId).options[0]) || null;
    }

    function normalizeLook(rawLook, context) {
        var safeLook = rawLook || {};
        var resolvedContext = buildContext(context);
        var normalized = {};
        CATEGORY_ORDER.forEach(function(categoryId) {
            var option = getOption(categoryId, safeLook[categoryId]);
            if (option && isUnlocked(option, resolvedContext)) {
                normalized[categoryId] = option.id;
                return;
            }
            var fallback = getFallbackOption(categoryId, resolvedContext);
            normalized[categoryId] = fallback ? fallback.id : DEFAULT_LOOK[categoryId];
        });
        return normalized;
    }

    function auraBackground(auraId) {
        if (auraId === 'chispa') {
            return 'radial-gradient(circle at 50% 50%, rgba(96,165,250,.7) 0%, rgba(59,130,246,.35) 42%, rgba(59,130,246,0) 74%)';
        }
        if (auraId === 'fuego') {
            return 'radial-gradient(circle at 50% 55%, rgba(251,146,60,.75) 0%, rgba(249,115,22,.42) 42%, rgba(249,115,22,0) 76%)';
        }
        if (auraId === 'oro') {
            return 'radial-gradient(circle at 50% 50%, rgba(253,224,71,.88) 0%, rgba(250,204,21,.48) 42%, rgba(250,204,21,0) 78%)';
        }
        return '';
    }

    function ensureStyles() {
        if (document.getElementById('avatar-look-styles')) return;
        var style = document.createElement('style');
        style.id = 'avatar-look-styles';
        style.textContent = [
            '.avatar-render-host{display:inline-flex;align-items:center;justify-content:center}',
            '.avatar-stack{position:relative;overflow:hidden;border:2px solid rgba(255,255,255,.16);background:linear-gradient(180deg,#f8fbff 0%,#dbeafe 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 10px 24px rgba(15,23,42,.18)}',
            '.avatar-shape-rounded{border-radius:24px}',
            '.avatar-shape-circle{border-radius:999px}',
            '.avatar-layer{position:absolute;inset:0;pointer-events:none}',
            '.avatar-mask{display:block;background-position:center;background-repeat:no-repeat;background-size:contain;transform:translateZ(0)}',
            '.avatar-aura{inset:-12%;filter:blur(12px);opacity:.9;transform:scale(1.04)}',
            '.avatar-body{z-index:2}',
            '.avatar-outfit{z-index:3}',
            '.avatar-eyes{z-index:4}',
            '.avatar-mouth{z-index:5}',
            '.avatar-hair{z-index:6}',
            '.avatar-accessory{z-index:7}',
            '.avatar-badge{position:absolute;right:6px;bottom:6px;z-index:8;padding:3px 6px;border-radius:999px;background:rgba(15,23,42,.82);color:#fff;font-size:9px;font-weight:800;letter-spacing:.4px;text-transform:uppercase}'
        ].join('');
        document.head.appendChild(style);
    }

    function maskLayer(className, assetPath, color) {
        var layer = document.createElement('span');
        var maskValue = 'url("' + assetPath + '") center / contain no-repeat';
        layer.className = 'avatar-layer avatar-mask ' + className;
        layer.style.background = color;
        layer.style.webkitMask = maskValue;
        layer.style.mask = maskValue;
        return layer;
    }

    function optionSummary(categoryId, option, context) {
        return {
            id: option.id,
            name: option.name,
            preview: option.preview || option.name.slice(0, 2).toUpperCase(),
            swatch: option.swatch || option.color || '',
            locked: !isUnlocked(option, context),
            minXp: typeof option.minXp === 'number' ? option.minXp : 0
        };
    }

    function getEditorCategories(context, look) {
        var resolvedContext = buildContext(context);
        var selected = normalizeLook(look, resolvedContext);
        return CATEGORY_ORDER.map(function(categoryId) {
            var category = getCategory(categoryId);
            return {
                id: categoryId,
                label: category.label,
                selected: selected[categoryId],
                options: category.options.map(function(option) {
                    var summary = optionSummary(categoryId, option, resolvedContext);
                    summary.selected = summary.id === selected[categoryId];
                    return summary;
                })
            };
        });
    }

    function chooseRandom(items) {
        if (!items.length) return null;
        return items[Math.floor(Math.random() * items.length)];
    }

    function randomizeLook(context) {
        var resolvedContext = buildContext(context);
        var randomized = {};
        CATEGORY_ORDER.forEach(function(categoryId) {
            var unlocked = getUnlockedOptions(categoryId, resolvedContext);
            var randomOption = chooseRandom(unlocked);
            randomized[categoryId] = randomOption ? randomOption.id : DEFAULT_LOOK[categoryId];
        });
        return randomized;
    }

    function render(container, options) {
        if (!container) return null;
        ensureStyles();

        var resolvedContext = buildContext(options);
        var look = normalizeLook(options && options.look, resolvedContext);
        var size = Number(options && options.size) || 96;
        var shape = options && options.shape === 'circle' ? 'circle' : 'rounded';
        var label = options && options.badgeText;
        var skin = getOption('skinTone', look.skinTone);
        var eyes = getOption('eyes', look.eyes);
        var mouth = getOption('mouth', look.mouth);
        var hair = getOption('hairStyle', look.hairStyle);
        var hairColor = getOption('hairColor', look.hairColor);
        var outfit = getOption('outfit', look.outfit);
        var accessory = getOption('accessory', look.accessory);
        var aura = getOption('aura', look.aura);

        var stack = document.createElement('div');
        stack.className = 'avatar-stack avatar-shape-' + shape;
        stack.style.width = size + 'px';
        stack.style.height = size + 'px';
        stack.style.background = (options && options.background) || 'linear-gradient(180deg,#f8fbff 0%,#dbeafe 100%)';

        if (aura && aura.id !== 'none') {
            var auraLayer = document.createElement('span');
            auraLayer.className = 'avatar-layer avatar-aura';
            auraLayer.style.background = auraBackground(aura.id);
            stack.appendChild(auraLayer);
        }

        stack.appendChild(maskLayer('avatar-body', ASSET_ROOT + '/masks/body.svg', skin.color));
        stack.appendChild(maskLayer('avatar-outfit', ASSET_ROOT + '/outfit/' + outfit.asset, outfit.color));
        stack.appendChild(maskLayer('avatar-eyes', ASSET_ROOT + '/eyes/' + eyes.asset, '#1f2937'));
        stack.appendChild(maskLayer('avatar-mouth', ASSET_ROOT + '/mouth/' + mouth.asset, '#7c2d12'));
        stack.appendChild(maskLayer('avatar-hair', ASSET_ROOT + '/hair/' + hair.asset, hairColor.color));
        if (accessory && accessory.id !== 'none' && accessory.asset) {
            stack.appendChild(maskLayer('avatar-accessory', ASSET_ROOT + '/accessory/' + accessory.asset, accessory.color));
        }

        if (label) {
            var badge = document.createElement('span');
            badge.className = 'avatar-badge';
            badge.textContent = label;
            stack.appendChild(badge);
        }

        container.innerHTML = '';
        container.classList.add('avatar-render-host');
        container.appendChild(stack);
        return look;
    }

    global.AvatarLookSystem = {
        getDefaultLook: function() {
            return clone(DEFAULT_LOOK);
        },
        getEditorCategories: getEditorCategories,
        getOptionMeta: function(categoryId, optionId, context) {
            var option = getOption(categoryId, optionId);
            return option ? optionSummary(categoryId, option, context) : null;
        },
        getUnlockedOptions: getUnlockedOptions,
        normalizeLook: normalizeLook,
        randomizeLook: randomizeLook,
        render: render
    };
})(window);
