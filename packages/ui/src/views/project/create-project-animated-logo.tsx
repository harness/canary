/**
 * Follow the 'hasError' prop to find the animated parts.
 * Greenish shadow of the logo goes to the right and changes to purplish.
 */
export const CreateProjectAnimatedLogo: React.FC<{ hasError: boolean }> = ({ hasError }) => (
  <svg width="112" height="112" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="56" cy="56" r="37.5" stroke="url(#a)" />
    <circle opacity=".8" cx="56" cy="56" r="43.5" stroke="url(#b)" />
    <circle opacity=".6" cx="56" cy="56" r="49.5" stroke="url(#c)" />
    <circle opacity=".4" cx="56" cy="56" r="55.5" stroke="url(#d)" />
    <circle cx="96" cy="27" r="8" fill="#131316" />
    <circle cx="96" cy="27" r="8" fill="url(#e)" />
    <path d="M96 27v-3m0 3h-3m3 0v3m0-3h3" stroke="url(#f)" strokeLinecap="round" />
    <circle cx="16" cy="85" r="8" fill="#131316" />
    <circle cx="16" cy="85" r="8" fill="url(#g)" />
    <g clipPath="url(#h)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.603 83.104a1.604 1.604 0 1 1-3.208 0 1.604 1.604 0 0 1 3.208 0Zm-4.781 5.07a3.19 3.19 0 0 1 6.355 0 .29.29 0 0 1-.29.322h-5.775a.294.294 0 0 1-.217-.096.294.294 0 0 1-.073-.225Z"
        fill="url(#i)"
      />
    </g>
    <mask id="j" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="24" y="24" width="64" height="64">
      <circle cx="56" cy="56" r="32" fill="#131316" />
    </mask>
    <g mask="url(#j)">
      <circle cx="56" cy="56" r="32" fill="#131316" />
      <g opacity=".3" filter="url(#k)">
        <circle cx="56" cy="81" r="21" fill="#93939F" />
      </g>
      <g opacity=".4" filter="url(#l)">
        <ellipse cx="56" cy="88" rx="10" ry="13" fill="#93939F" />
      </g>
      <circle cx="56" cy="56" r="31.5" stroke="url(#m)" />
      <g style={{ mixBlendMode: 'plus-lighter' }} opacity=".16" filter="url(#n)">
        <circle
          cx="38.5"
          cy="30.5"
          r="26.5"
          fill={hasError ? '#AD79D2' : '#70DCD3'}
          style={{
            transition: '0.7s ease-in-out',
            transitionProperty: 'fill, transform',
            transform: `translateX(${hasError ? 35 : 0}px)`
          }}
        />
      </g>
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M43 59h11a1 1 0 0 0 1-1V42a1 1 0 0 0-1-1H43a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1Zm0 12h11a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H43a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1Zm26-20H58a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1ZM58 71h11a1 1 0 0 0 1-1V54a1 1 0 0 0-1-1H58a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1Z"
      fill="url(#o)"
    />
    <defs>
      <linearGradient id="a" x1="56" y1="18" x2="56" y2="94" gradientUnits="userSpaceOnUse">
        <stop stopColor="#18181B" stopOpacity=".3" />
        <stop offset=".5" stopColor="#18181B" />
        <stop offset="1" stopColor="#18181B" stopOpacity=".3" />
      </linearGradient>
      <linearGradient id="b" x1="56" y1="12" x2="56" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#18181B" stopOpacity=".3" />
        <stop offset=".5" stopColor="#18181B" />
        <stop offset="1" stopColor="#18181B" stopOpacity=".3" />
      </linearGradient>
      <linearGradient id="c" x1="56" y1="6" x2="56" y2="106" gradientUnits="userSpaceOnUse">
        <stop stopColor="#18181B" stopOpacity=".3" />
        <stop offset=".5" stopColor="#18181B" />
        <stop offset="1" stopColor="#18181B" stopOpacity=".3" />
      </linearGradient>
      <linearGradient id="d" x1="56" y1="0" x2="56" y2="112" gradientUnits="userSpaceOnUse">
        <stop stopColor="#18181B" stopOpacity=".3" />
        <stop offset=".5" stopColor="#18181B" />
        <stop offset="1" stopColor="#18181B" stopOpacity=".3" />
      </linearGradient>
      <linearGradient id="f" x1="99" y1="24" x2="93" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60606C" />
        <stop offset="1" stopColor="#93939F" />
      </linearGradient>
      <linearGradient id="i" x1="12.999" y1="88" x2="18.999" y2="82" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60606C" />
        <stop offset="1" stopColor="#93939F" />
      </linearGradient>
      <linearGradient id="m" x1="56" y1="24" x2="56" y2="88" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff" stopOpacity=".1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="o" x1="69.941" y1="41.195" x2="52.284" y2="68.606" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EFEFF1" />
        <stop offset="1" stopColor="#93939F" />
      </linearGradient>
      <filter id="k" x="11" y="36" width="90" height="90" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="12" />
      </filter>
      <filter id="l" x="36" y="65" width="40" height="46" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter
        id="n"
        x={hasError ? '-8' : '22'}
        y="-16"
        width="97"
        height="93"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="10"></feGaussianBlur>
      </filter>
      <radialGradient
        id="e"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(-45 86.249 -88.725) scale(22.6274)"
      >
        <stop stopColor="#787887" stopOpacity=".3" />
        <stop offset="1" stopColor="#787887" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="g"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(135 -3.947 43.47) scale(22.6274)"
      >
        <stop stopColor="#787887" stopOpacity=".3" />
        <stop offset="1" stopColor="#787887" stopOpacity="0" />
      </radialGradient>
      <clipPath id="h">
        <path fill="#fff" transform="translate(12.5 81.5)" d="M0 0h7v7H0z" />
      </clipPath>
    </defs>
  </svg>
)
