export default {
  '.cn-shimmer': {
    position: 'relative',
    display: 'inline-block',
    backgroundSize: '250% 100%, auto',
    backgroundClip: 'text',
    color: 'transparent',
    '--shimmer-highlight':
      'linear-gradient(90deg, #0000 calc(50% - var(--shimmer-spread)), #fff, #0000 calc(50% + var(--shimmer-spread)))',
    backgroundImage: 'var(--shimmer-highlight), linear-gradient(var(--shimmer-color), var(--shimmer-color))',
    backgroundRepeat: 'no-repeat, padding-box'
  }
}
