import { FC, useState } from 'react'

import { Button, Carousel, Dialog, IconV2, Spacer } from '@/components'
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
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>{title ? title : <Spacer size={7} />}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
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
        </Dialog.Body>
        <Dialog.Footer className="!justify-center">
          <Button
            variant="outline"
            size="sm"
            iconOnly
            data-testid="zoomOutButton"
            onClick={() => {
              if (Number(zoomLevel.toFixed(1)) > 0.3) {
                setZoomLevel(zoomLevel - ZOOM_INC_DEC_LEVEL)
              }
            }}
            title="Zoom out"
          >
            <IconV2 name="minus" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconOnly
            data-testid="zoomInButton"
            onClick={() => {
              if (Number(zoomLevel.toFixed(1)) < 2) {
                setZoomLevel(zoomLevel + ZOOM_INC_DEC_LEVEL)
              }
            }}
            title="Zoom in"
          >
            <IconV2 name="plus" />
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
