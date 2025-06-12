export default {
    '.cn-button-group': {
        '@apply flex': '',

        '&-horizontal': {
            '& .cn-button': {
                '&:not(:first-child)': {
                    'margin-left': '-1px',
                },

                '&:not(:last-child)': {
                    'margin-right': '-1px',
                },

                '&:not(:first-child):not(:last-child)': {
                    'border-radius': '0',
                },

                '&:first-child:not(:last-child)': {
                    'border-top-right-radius': '0',
                    'border-bottom-right-radius': '0',
                },

                '&:last-child:not(:first-child)': {
                    'border-top-left-radius': '0',
                    'border-bottom-left-radius': '0',
                }
            }
        },

        '&-vertical': {
            '@apply flex-col': '',

            '& .cn-button': {
                '&:not(:first-child)': {
                    'margin-top': '-1px',
                },

                '&:not(:last-child)': {
                    'margin-bottom': '-1px',
                },

                '&:not(:first-child):not(:last-child)': {
                    'border-radius': '0',
                },

                '&:first-child:not(:last-child)': {
                    'border-bottom-left-radius': '0',
                    'border-bottom-right-radius': '0',
                },

                '&:last-child:not(:first-child)': {
                    'border-top-left-radius': '0',
                    'border-top-right-radius': '0',
                }
            }
        },

        '& .cn-button': {
            '&:hover, &:focus': {
                'z-index': '1',
            }
        }
    }
}
