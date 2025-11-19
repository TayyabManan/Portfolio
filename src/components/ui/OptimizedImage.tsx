'use client'

import React, { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { Skeleton } from './SkeletonLoader'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallback?: string
  aspectRatio?: string
  showSkeleton?: boolean
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback,
  aspectRatio,
  showSkeleton = true,
  blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+",
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
    setLoaded(false)
    setError(false)
  }, [src])

  const handleLoad = () => {
    setLoaded(true)
    setError(false)
  }

  const handleError = () => {
    setError(true)
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback)
      setError(false)
    }
  }

  const containerClasses = cn(
    'relative overflow-hidden',
    aspectRatio && `aspect-[${aspectRatio}]`
  )

  const imageClasses = cn(
    'transition-all duration-500 ease-out',
    loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105',
    className
  )

  return (
    <div className={containerClasses}>
      {showSkeleton && !loaded && !error && (
        <div className="absolute inset-0 z-10">
          <Skeleton
            variant="rectangular"
            className="h-full w-full"
            animation="wave"
          />
        </div>
      )}
      
      {error && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}

      <Image
        src={currentSrc}
        alt={alt}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        priority={priority}
        {...props}
      />
    </div>
  )
}

interface ProgressiveImageProps extends Omit<OptimizedImageProps, 'src'> {
  lowQualitySrc?: string
  highQualitySrc: string
}

export function ProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
  className,
  ...props
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || highQualitySrc)
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false)

  useEffect(() => {
    if (lowQualitySrc && highQualitySrc !== currentSrc) {
      const img = new window.Image()
      img.src = highQualitySrc
      img.onload = () => {
        setCurrentSrc(highQualitySrc)
        setIsHighQualityLoaded(true)
      }
    }
  }, [lowQualitySrc, highQualitySrc, currentSrc])

  return (
    <OptimizedImage
      {...props}
      src={currentSrc}
      alt={alt}
      className={cn(
        className,
        !isHighQualityLoaded && lowQualitySrc && 'blur-sm'
      )}
    />
  )
}

interface LazyImageProps extends OptimizedImageProps {
  threshold?: number
  rootMargin?: string
}

export function LazyImage({
  src,
  alt,
  threshold = 0.1,
  rootMargin = '50px',
  className,
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const imageRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true)
          setHasLoaded(true)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    const currentRef = imageRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={imageRef} className="relative">
      {isInView ? (
        <OptimizedImage
          src={src}
          alt={alt}
          className={className}
          {...props}
        />
      ) : (
        <div className={cn('bg-gray-200 dark:bg-gray-700 animate-pulse', className)}>
          <div className="aspect-video" />
        </div>
      )}
    </div>
  )
}

export function ImageWithFallback({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  alt,
  ...props
}: OptimizedImageProps & { fallbackSrc?: string }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fallback={fallbackSrc}
      {...props}
    />
  )
}