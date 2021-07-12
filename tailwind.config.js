module.exports = {
    purge: {
        content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
        safelist: [
            'flex-col',
            'flex-row',
            'bg-green-400',
            'bg-red-400',
            'text-green-500',
            'text-red-500',
            'w-full',
            'w-2/4',
            'origin-left',
            'origin-right',
            'bg-purple-600',
            'bg-red-600',
        ],
    },
    darkMode: false,
    theme: {
        backgroundColor: (theme) => ({
            ...theme('colors'),
            indigoBlue: '#141623',
        }),
        extend: {
            zIndex: {
                '-1': '-1',
            },
            gridTemplateColumns: {
                custom: 'repeat(3, minmax(0, 1fr)) 10%',
            },
            borderColor: {
                'dropdown-arrow': '#FFF transparent transparent',
            },
        },
    },
    important: true,
    variants: {
        extend: {},
    },
    plugins: [],
}
