// Helper function to generate random percentage width within a range
export const getRandomPercentageWidth = (min: number, max: number) =>
  `${Math.floor(Math.random() * (max - min + 1)) + min}%`

// Helper function to generate random pixel width within a range
export const getRandomPixelWidth = (min: number, max: number) =>
  `${Math.floor(Math.random() * (max - min + 1)) + min}px`
