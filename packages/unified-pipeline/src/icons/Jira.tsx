import * as React from 'react'
import { SVGProps } from 'react'

const Jira = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect y={-0.00012207} width={24} height={24} rx={4} fill="#0C66E4" />
    <path
      d="M19.3524 4.00012H11.6313C11.6313 5.91922 13.1934 7.48128 15.1125 7.48128H16.5407V8.8425C16.5407 10.7616 18.1027 12.3236 20.0218 12.3236V4.66957C20.0218 4.29022 19.7094 4.00012 19.3524 4.00012Z"
      fill="white"
    />
    <path
      d="M15.5362 7.83838H7.81519C7.81519 9.75748 9.37724 11.3195 11.2963 11.3195H12.7245V12.7031C12.7245 14.6222 14.2866 16.1842 16.2057 16.1842V8.53015C16.2057 8.15079 15.8932 7.83838 15.5362 7.83838Z"
      fill="url(#paint0_linear_3618_13669)"
    />
    <path
      d="M11.7205 11.6766H3.99951C3.99951 13.5957 5.56157 15.1578 7.48066 15.1578H8.88651V16.519C8.88651 18.4381 10.4486 20.0002 12.3677 20.0002V12.3238C12.39 11.989 12.0776 11.6766 11.7205 11.6766Z"
      fill="url(#paint1_linear_3618_13669)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_3618_13669"
        x1={16.0344}
        y1={7.85462}
        x2={12.7519}
        y2={11.2398}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.15} stopColor="white" stopOpacity={0.4} />
        <stop offset={0.29} stopColor="white" stopOpacity={0.47} />
        <stop offset={0.56} stopColor="white" stopOpacity={0.66} />
        <stop offset={0.95} stopColor="white" stopOpacity={0.96} />
        <stop offset={1} stopColor="white" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3618_13669"
        x1={12.434}
        y1={11.7207}
        x2={8.63824}
        y2={15.4138}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.15} stopColor="white" stopOpacity={0.4} />
        <stop offset={0.29} stopColor="white" stopOpacity={0.47} />
        <stop offset={0.56} stopColor="white" stopOpacity={0.66} />
        <stop offset={0.95} stopColor="white" stopOpacity={0.96} />
        <stop offset={1} stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
)
export default Jira
