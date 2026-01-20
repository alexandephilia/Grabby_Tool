(function () {
    if (!window.location.search.includes('grab=true')) return;

    // Singleton Guard: If an instance already exists, destroy it before starting a new one
    if (window.__GRABBY_INSTANCE__) {
        window.__GRABBY_INSTANCE__.destroy();
    }

    console.log('🎯 Grabby: Inspector Mode initialized');

    // ============================================
    // STATE & LIFECYCLE
    // ============================================
    const controller = new AbortController();
    const { signal } = controller;

    let activeEl = null;
    let elementStack = [];
    let stackIndex = 0;
    let isLocked = false;
    let lastX = 0, lastY = 0;

    const hudNodes = [];

    // ============================================
    // CREATE HUD ELEMENTS
    // ============================================

    const createNode = (id, css) => {
        const el = document.createElement('div');
        if (id) el.id = id;
        el.style.cssText = css;
        document.documentElement.appendChild(el);
        hudNodes.push(el);
        return el;
    };

    const blurOverlay = createNode('grabby-blur', `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 2147483640;
    pointer-events: none;
    display: none;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  `);

    const clearWindow = createNode('grabby-clear', `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 2147483641;
    pointer-events: none;
    display: none;
    background: transparent;
  `);

    const highlight = createNode('grabby-highlight', `
    position: fixed;
    pointer-events: none;
    z-index: 2147483645;
    border: 1px dashed rgba(0, 0, 0, 0.6);
    background: rgba(59, 130, 246, 0.05);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.08s ease-out;
    display: none;
  `);

    const chV = createNode(null, `position: fixed; top: 0; bottom: 0; left: 0; width: 1px; background: rgba(0,0,0,0.5); z-index: 2147483646; pointer-events: none; display: none;`);
    const chH = createNode(null, `position: fixed; top: 0; left: 0; right: 0; height: 1px; background: rgba(0,0,0,0.5); z-index: 2147483646; pointer-events: none; display: none;`);

    const tooltip = createNode(null, `
    position: fixed;
    background: linear-gradient(180deg, rgba(8, 8, 10, 0.95) 0%, rgba(4, 4, 5, 0.98) 100%);
    backdrop-filter: blur(16px) saturate(200%);
    -webkit-backdrop-filter: blur(16px) saturate(200%);
    color: #ffffff;
    padding: 6px 14px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 500;
    border-radius: 8px;
    white-space: nowrap;
    z-index: 2147483647;
    text-transform: lowercase;
    letter-spacing: -0.02em;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    display: none;
    pointer-events: none;
  `);

    const infoPanel = createNode('grabby-info', `
    position: fixed;
    bottom: 12px;
    right: 12px;
    background: linear-gradient(180deg, rgba(8, 8, 10, 0.95) 0%, rgba(4, 4, 5, 0.98) 100%);
    backdrop-filter: blur(16px) saturate(200%);
    -webkit-backdrop-filter: blur(16px) saturate(200%);
    color: #fff;
    padding: 5px 10px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9px;
    line-height: 1.2;
    white-space: nowrap;
    border-radius: 6px;
    z-index: 2147483647;
    display: none;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    pointer-events: none;
  `);

    const breadcrumb = createNode(null, `
    position: fixed;
    bottom: 12px;
    left: 12px;
    background: linear-gradient(180deg, rgba(8, 8, 10, 0.95) 0%, rgba(4, 4, 5, 0.98) 100%);
    backdrop-filter: blur(16px) saturate(200%);
    -webkit-backdrop-filter: blur(16px) saturate(200%);
    color: #fff;
    padding: 5px 10px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9px;
    line-height: 1.2;
    border-radius: 6px;
    z-index: 2147483647;
    display: none;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    max-width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
  `);

    // ============================================
    // HELPERS
    // ============================================

    const getSelector = (el) => {
        if (!el || el === document.body || el === document.documentElement) return '';
        let selector = el.tagName.toLowerCase();
        if (el.id) return `${selector}#${el.id}`;
        const cls = typeof el.className === 'string'
            ? el.className.split(' ').filter(c => c && !c.includes(':') && !c.includes('grabby'))[0]
            : '';
        return cls ? `${selector}.${cls}` : selector;
    };

    const getFullPath = (el) => {
        const path = [];
        let current = el;
        while (current && current !== document.body && current !== document.documentElement) {
            path.unshift(getSelector(current));
            current = current.parentElement;
        }
        return path.join(' > ');
    };

    const getBreadcrumbPath = (el) => {
        const parts = [];
        let current = el;
        let depth = 0;
        while (current && current !== document.body && depth < 5) {
            const sel = getSelector(current);
            const isActive = current === el;
            parts.unshift(`<span style="color: ${isActive ? '#3b82f6' : 'rgba(255,255,255,0.6)'}">${sel}</span>`);
            current = current.parentElement;
            depth++;
        }
        if (current && current !== document.body) parts.unshift('<span style="color:rgba(255,255,255,0.35)">…</span>');
        return parts.join(' <span style="color:rgba(255,255,255,0.35)">›</span> ');
    };

    const getElementsAtPoint = (x, y) => {
        const elements = [];
        let el = document.elementFromPoint(x, y);
        while (el && el !== document.documentElement && el !== document.body) {
            if (!el.id?.includes('grabby') && !el.className?.toString().includes('grabby')) {
                elements.push(el);
            }
            el = el.parentElement;
        }
        return elements;
    };

    const positionTooltip = (rect) => {
        const tooltipRect = tooltip.getBoundingClientRect();
        const padding = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top = rect.top - tooltipRect.height - padding;
        let left = rect.left;

        if (top < padding) top = rect.bottom + padding;
        if (top + tooltipRect.height > vh - padding) top = rect.top + padding;
        if (left < padding) left = padding;
        if (left + tooltipRect.width > vw - padding) left = vw - tooltipRect.width - padding;

        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    };

    // ============================================
    // CORE LOGIC
    // ============================================

    const updateHighlight = (el) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        blurOverlay.style.display = 'block';
        blurOverlay.style.clipPath = `polygon(0% 0%, 0% 100%, ${rect.left}px 100%, ${rect.left}px ${rect.top}px, ${rect.right}px ${rect.top}px, ${rect.right}px ${rect.bottom}px, ${rect.left}px ${rect.bottom}px, ${rect.left}px 100%, 100% 100%, 100% 0%)`;

        Object.assign(highlight.style, {
            display: 'block',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px'
        });

        const tag = el.tagName.toLowerCase();
        const cls = typeof el.className === 'string' ? el.className.split(' ').filter(c => c && !c.includes('grabby'))[0] : '';
        tooltip.innerHTML = `<span style="color:rgba(255,255,255,0.4)">target:</span> ${tag}${cls ? '.' + cls : ''}`;
        tooltip.style.display = 'block';
        positionTooltip(rect);

        breadcrumb.innerHTML = getBreadcrumbPath(el);
        breadcrumb.style.display = 'block';

        const childCount = el.children.length;
        infoPanel.innerHTML = `${rect.width.toFixed(0)}×${rect.height.toFixed(0)} <span style="color:rgba(255,255,255,0.5)">·</span> ${childCount} children <span style="color:rgba(255,255,255,0.5)">·</span> ${stackIndex + 1}/${elementStack.length} <span style="color:rgba(255,255,255,0.4)">| ↑ ↓ ← → scroll click</span>`;
        infoPanel.style.display = 'block';
    };

    const hideAll = () => {
        hudNodes.forEach(el => el.style.display = 'none');
        document.body.style.cursor = '';
        activeEl = null;
        elementStack = [];
    };

    // ============================================
    // EVENTS
    // ============================================

    window.addEventListener('mousemove', (e) => {
        if (!(e.metaKey || e.ctrlKey)) {
            hideAll();
            return;
        }

        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (isLocked && dist > 4) {
            isLocked = false;
        }

        lastX = e.clientX;
        lastY = e.clientY;

        chV.style.display = chH.style.display = 'block';
        chV.style.transform = `translateX(${e.clientX}px)`;
        chH.style.transform = `translateY(${e.clientY}px)`;
        document.body.style.cursor = 'crosshair';

        if (isLocked) return;

        elementStack = getElementsAtPoint(e.clientX, e.clientY);
        stackIndex = 0;

        if (elementStack.length > 0) {
            activeEl = elementStack[0];
            updateHighlight(activeEl);
        }
    }, { signal, passive: true });

    window.addEventListener('wheel', (e) => {
        if (!(e.metaKey || e.ctrlKey) || elementStack.length === 0) return;
        e.preventDefault();

        if (e.deltaY > 0) {
            stackIndex = Math.min(stackIndex + 1, elementStack.length - 1);
        } else {
            stackIndex = Math.max(stackIndex - 1, 0);
        }

        activeEl = elementStack[stackIndex];
        updateHighlight(activeEl);
    }, { signal, passive: false });

    window.addEventListener('keydown', (e) => {
        if (!(e.metaKey || e.ctrlKey) || !activeEl) return;

        let newEl = null;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (activeEl.parentElement && activeEl.parentElement !== document.body) {
                    newEl = activeEl.parentElement;
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                const firstChild = Array.from(activeEl.children).find(c => !c.id?.includes('grabby') && !c.className?.toString().includes('grabby'));
                if (firstChild) newEl = firstChild;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                let prevSib = activeEl.previousElementSibling;
                while (prevSib && (prevSib.id?.includes('grabby') || prevSib.className?.toString().includes('grabby'))) {
                    prevSib = prevSib.previousElementSibling;
                }
                if (prevSib) newEl = prevSib;
                break;
            case 'ArrowRight':
                e.preventDefault();
                let nextSib = activeEl.nextElementSibling;
                while (nextSib && (nextSib.id?.includes('grabby') || nextSib.className?.toString().includes('grabby'))) {
                    nextSib = nextSib.nextElementSibling;
                }
                if (nextSib) newEl = nextSib;
                break;
            case 'Escape':
                e.preventDefault();
                isLocked = false;
                elementStack = getElementsAtPoint(lastX, lastY);
                stackIndex = 0;
                if (elementStack.length > 0) {
                    activeEl = elementStack[0];
                    updateHighlight(activeEl);
                }
                return;
        }

        if (newEl) {
            isLocked = true;
            activeEl = newEl;
            elementStack = [newEl];
            let parent = newEl.parentElement;
            while (parent && parent !== document.body) {
                elementStack.push(parent);
                parent = parent.parentElement;
            }
            stackIndex = 0;
            updateHighlight(activeEl);
        }
    }, { signal });

    const block = (e) => {
        if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };

    window.addEventListener('mousedown', block, { signal, capture: true });
    window.addEventListener('mouseup', block, { signal, capture: true });

    window.addEventListener('click', (e) => {
        if (!(e.metaKey || e.ctrlKey) || !activeEl) return;

        e.preventDefault();
        e.stopPropagation();

        highlight.style.borderColor = '#22c55e';
        setTimeout(() => { if (highlight) highlight.style.borderColor = 'rgba(0, 0, 0, 0.6)'; }, 200);

        const computed = window.getComputedStyle(activeEl);
        const rect = activeEl.getBoundingClientRect();

        const grabInfo = {
            tagName: activeEl.tagName,
            id: activeEl.id || null,
            className: typeof activeEl.className === 'string' ? activeEl.className : null,
            selector: getFullPath(activeEl),
            innerText: activeEl.innerText?.slice(0, 500) || null,
            innerHTML: activeEl.innerHTML?.slice(0, 1000) || null,
            childCount: activeEl.children.length,
            attributes: Array.from(activeEl.attributes).reduce((acc, attr) => {
                if (!['class', 'id', 'style'].includes(attr.name)) acc[attr.name] = attr.value;
                return acc;
            }, {}),
            styles: {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize,
                padding: computed.padding,
                margin: computed.margin,
                display: computed.display,
                position: computed.position,
                width: computed.width,
                height: computed.height
            },
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            timestamp: new Date().toISOString()
        };

        const endpoint = window.__NEXT_DATA__ ? '/api/grabby-sync' : '/__grabby_sync';
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(grabInfo)
        }).then(r => r.json()).then(res => {
            if (res.success && tooltip) {
                tooltip.innerHTML = "<span style='color:#22c55e; font-weight:700;'>⚡ synced</span>";
                setTimeout(() => { if (activeEl) updateHighlight(activeEl); }, 1200);
            }
        }).catch(console.error);

        return false;
    }, { signal, capture: true });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Meta' || e.key === 'Control') {
            hideAll();
        }
    }, { signal });

    // ============================================
    // PUBLIC INTERFACE (for cleanup)
    // ============================================
    window.__GRABBY_INSTANCE__ = {
        destroy: () => {
            controller.abort();
            hudNodes.forEach(node => node.remove());
            window.__GRABBY_INSTANCE__ = null;
            console.log('🧹 Grabby: Cleaned up.');
        }
    };

})();
