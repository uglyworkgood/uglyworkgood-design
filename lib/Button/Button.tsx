import React, {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import './Button.css';

type CommonProps = {
  children?: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'dashed';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

/** Button-as-<button> props */
type ButtonAsButton = CommonProps & {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'type'>;

/** Button-as-<a> props */
type ButtonAsLink = CommonProps & {
  as: 'a';
  href: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href' | 'target' | 'rel'>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      as,
      children,
      variant = 'solid',
      size = 'md',
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      className,
      ...rest
    } = props as ButtonProps;

    const isLink = as === 'a' || ('href' in props && props.href != null);
    const classes = cx(
      'uglyworkgood-button',
      `uwg-variant-${variant}`,
      `uwg-size-${size}`,
      fullWidth && 'uwg-full',
      loading && 'uwg-loading',
      className
    );

    const content = (
      <>
        {loading && <span className="uwg-spinner" aria-hidden />}
        {leftIcon && <span className="uwg-icon uwg-icon-left">{leftIcon}</span>}
        <span className="uwg-label">{children}</span>
        {rightIcon && <span className="uwg-icon uwg-icon-right">{rightIcon}</span>}
      </>
    );

    if (isLink) {
      const { href, target, rel, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      };
      // Prevent accidental security issues when opening a new tab
      const secureRel =
        target === '_blank'
          ? rel
            ? rel
            : 'noopener noreferrer'
          : rel;

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          href={(props as ButtonAsLink).href ?? href}
          target={target}
          rel={secureRel}
          aria-disabled={loading ? true : undefined}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    const { type = 'button', disabled, ...buttonRest } =
      rest as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading ? true : undefined}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
