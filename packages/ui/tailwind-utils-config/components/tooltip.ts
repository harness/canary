export default {
    '.cn-tooltip': {
        minWidth: 'var(--cn-tooltip-min)',
        maxWidth: 'var(--cn-tooltip-max)',
        borderRadius: 'var(--cn-tooltip-radius)',
        border: 'var(--cn-tooltip-border) solid var(--cn-set-brand-solid-bg)',
        background: 'var(--cn-set-brand-solid-bg)',
        padding: 'var(--cn-tooltip-py) var(--cn-tooltip-px)',
        color: 'var(--cn-set-brand-solid-text)',
        '@apply flex flex-col z-50 font-body-normal animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2': '',

        '&-title': {
            '@apply font-body-strong': ''
        }
    }
}
