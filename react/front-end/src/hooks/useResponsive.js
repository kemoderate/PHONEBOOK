import { useState, useEffect } from 'react'

export default function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    isMobile: width < 600,
    isTablet: width >= 600 && width < 1024,
    isDesktop: width >= 1024,
    columns:
      width >= 1200 ? 5 :
      width >= 900  ? 4 :
      width >= 700  ? 3 :
      width >= 500  ? 2 : 1,
    width
  }
}
