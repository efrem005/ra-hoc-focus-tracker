import { useState, useCallback, forwardRef } from 'react'
import { composeEventHandlers } from '../utils/composeEventHandlers'

export interface FocusTrackerInjectedProps {
  isFocused?: boolean
  onFocusChange?: (isFocused: boolean) => void
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void
}

function withFocusTracker<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P & FocusTrackerInjectedProps> & React.RefAttributes<HTMLDivElement>
> {
  type WrapperProps = P & FocusTrackerInjectedProps

  const FocusTrackerWrapper = forwardRef<HTMLDivElement, WrapperProps>(
    (
      {
        onFocusChange,
        onFocus: onFocusProp,
        onBlur: onBlurProp,
        ...restProps
      },
      ref
    ) => {
      const [, setFocused] = useState(false)

      const handleFocus = useCallback(
        (event: React.FocusEvent<HTMLDivElement>) => {
          setFocused(true);
          onFocusChange?.(true);
          (onFocusProp as ((event: React.FocusEvent<HTMLDivElement>) => void) | undefined)?.(event);
        },
        [onFocusChange, onFocusProp]
      );

      const handleBlur = useCallback(
        (event: React.FocusEvent<HTMLDivElement>) => {
          setFocused(false);
          onFocusChange?.(false);
          (onBlurProp as ((event: React.FocusEvent<HTMLDivElement>) => void) | undefined)?.(event);
        },
        [onFocusChange, onBlurProp]
      );

      const composedOnFocus = composeEventHandlers(
        handleFocus,
        (restProps as { onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void }).onFocus
      )

      const composedOnBlur = composeEventHandlers(
        handleBlur,
        (restProps as { onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void }).onBlur
      )

      return (
        <div
          ref={ref}
          onFocus={composedOnFocus}
          onBlur={composedOnBlur}
          tabIndex={-1}
          style={{ display: 'contents' }}
        >
          <WrappedComponent
            {...(restProps as P)}
          />
        </div>
      )
    }
  )

  const displayName = (WrappedComponent as { displayName?: string; name?: string }).displayName
    || (WrappedComponent as { name?: string }).name
    || 'Component'
  FocusTrackerWrapper.displayName = `withFocusTracker(${displayName})`

  return FocusTrackerWrapper
}

export default withFocusTracker
