export const getIsRunStep = (step: Record<string, any>) => Object.hasOwn(step, 'run')

export const getIsRunTestStep = (step: Record<string, any>) => Object.hasOwn(step, 'run-test')

export const getIsBackgroundStep = (step: Record<string, any>) => Object.hasOwn(step, 'background')

export const getIsActionStep = (step: Record<string, any>) => Object.hasOwn(step, 'action')

export const getIsTemplateStep = (step: Record<string, any>) => Object.hasOwn(step, 'template')
