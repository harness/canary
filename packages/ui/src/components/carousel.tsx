import {
  ComponentProps,
  createContext,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { Button } from '@/components'
import { cn } from '@/utils/cn'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselRootProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
  initialSlide?: number
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselRootProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel.Root />')
  }

  return context
}

const CarouselRoot = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & CarouselRootProps>(
  ({ orientation = 'horizontal', opts, setApi, plugins, className, children, initialSlide, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y'
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const onSelect = useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on('reInit', onSelect)
      api.on('select', onSelect)

      return () => {
        api?.off('select', onSelect)
      }
    }, [api, onSelect])

    const scrollToSlide = useCallback(() => {
      if (api && !!initialSlide) {
        api.scrollTo(initialSlide)
      }
    }, [api, initialSlide])

    useEffect(() => {
      if (!api) {
        return
      }

      scrollToSlide()
      api.on('reInit', scrollToSlide)
      api.on('init', scrollToSlide)

      return () => {
        api?.off('init', scrollToSlide)
      }
    }, [scrollToSlide, api])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
CarouselRoot.displayName = 'CarouselRoot'

interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {
  carouselBlockClassName?: string
}

const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, carouselBlockClassName, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
      <div ref={carouselRef} className={cn('overflow-hidden', carouselBlockClassName)}>
        <div
          ref={ref}
          className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}
          {...props}
        />
      </div>
    )
  }
)
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', className)}
      {...props}
    />
  )
})
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(
  ({ className, variant = 'surface', theme = 'muted', size = 'sm', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        theme={theme}
        size={size}
        iconOnly
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === 'horizontal'
            ? '-left-12 top-1/2 -translate-y-1/2'
            : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeftIcon className="size-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  }
)
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(
  ({ className, variant = 'surface', theme = 'muted', size = 'sm', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        theme={theme}
        size={size}
        iconOnly
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === 'horizontal'
            ? '-right-12 top-1/2 -translate-y-1/2'
            : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRightIcon className="size-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  }
)
CarouselNext.displayName = 'CarouselNext'

const Carousel = {
  Root: CarouselRoot,
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext
}

export { type CarouselApi, Carousel }
