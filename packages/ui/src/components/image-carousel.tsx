import { FC, useState } from 'react'

import { Button, Carousel, Dialog, Icon, Spacer } from '@/components'
import { INITIAL_ZOOM_LEVEL, ZOOM_INC_DEC_LEVEL } from '@/utils/utils'

export interface ImageCarouselProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  imgEvent: string[]
  title?: string
  initialSlide?: number
}

export const ImageCarousel: FC<ImageCarouselProps> = ({ isOpen, setIsOpen, imgEvent, title, initialSlide }) => {
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL)

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false)
        setZoomLevel(1)
      }}
    >
      <Dialog.Content className="h-[600px] max-w-[800px] grid-rows-[1fr_auto]">
        <Dialog.Header>
          <Dialog.Title>{title ? title : <Spacer size={7} />}</Dialog.Title>
        </Dialog.Header>
        <Carousel.Root className="flex-1 overflow-hidden" initialSlide={initialSlide}>
          <Carousel.Content className="h-full" carouselBlockClassName="h-full">
            {imgEvent &&
              imgEvent.map((image, idx) => {
                return (
                  <Carousel.Item key={idx} className="flex items-center justify-center">
                    <img
                      className="max-h-full"
                      alt="slide"
                      style={{ transform: `scale(${zoomLevel || 1})` }}
                      src={image}
                    />
                  </Carousel.Item>
                )
              })}
          </Carousel.Content>
        </Carousel.Root>
        <Dialog.Footer className="!justify-center">
          <Button
            variant="outline"
            size="icon"
            data-testid="zoomOutButton"
            onClick={() => {
              if (Number(zoomLevel.toFixed(1)) > 0.3) {
                setZoomLevel(zoomLevel - ZOOM_INC_DEC_LEVEL)
              }
            }}
            title="Zoom out"
          >
            <Icon name="minus" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            data-testid="zoomInButton"
            onClick={() => {
              if (Number(zoomLevel.toFixed(1)) < 2) {
                setZoomLevel(zoomLevel + ZOOM_INC_DEC_LEVEL)
              }
            }}
            title="Zoom in"
          >
            <Icon name="plus" size={16} />
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
