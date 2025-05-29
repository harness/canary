export default {
    '.cn-tooltip': {
        minWidth: 'var(--cn-tooltip-min)',
        maxWidth: 'var(--cn-tooltip-max)',
        borderRadius: 'var(--cn-tooltip-radius)',
        border: 'var(--cn-tooltip-border) solid var(--cn-set-brand-solid-bg)',
        background: 'var(--cn-set-brand-solid-bg)',
        padding: 'var(--cn-tooltip-py) var(--cn-tooltip-px)',
        color: 'var(--cn-set-brand-solid-text)',
        boxShadow: 'var(--cn-shadow-2)',
        '@apply flex flex-col z-50 font-body-normal opacity-0 transition-opacity': '',

        '&:where([data-state="delayed-open"])': {
            '@apply opacity-100': '',
        },

        '&-title': {
            '@apply font-body-strong': ''
        },

        '&-arrow': {
            color: 'var(--cn-set-brand-solid-bg)',
            '@apply w-5 h-2': ''
        }
    }
}
