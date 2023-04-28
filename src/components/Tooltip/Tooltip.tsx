/**
 * @author Pavel Kalachev <pkalachev@usetech.com>
 */

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import './Tooltip.scss';

export type VerticalAlign = 'top' | 'middle' | 'bottom';

export type HorizontalAlign = 'left' | 'middle' | 'right';

export type AppearanceAlign = 'vertical' | 'horizontal';

export type TooltipAlign = {
  vertical: VerticalAlign;
  horizontal: HorizontalAlign;
  appearance: AppearanceAlign;
};

export interface TooltipProps {
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
  className?: string;
  align?: TooltipAlign;
}

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const { className, targetRef, children, align } = props;

  const {
    vertical = 'bottom',
    horizontal = 'right',
    appearance = 'vertical',
  } = align || {};

  const tooltipRef = useRef<HTMLDivElement>(null);

  const tooltipProps = {
    isVisible: false,
    posX: 1,
    posY: 1,
  };

  const [tooltip, setTooltip] = useState(tooltipProps);
  const [arrow, setArrow] = useState({
    x: 'right',
    y: 'bottom',
  });

  const handleMouseOut = () => setTooltip(tooltipProps);

  const handleMouseEnter = (e: MouseEvent) => {
    let leftPos = 0;
    let topPos = 0;
    const arrowPos = { x: 'right', y: 'bottom' };
    window.addEventListener('mousewheel', handleMouseOut);

    setTooltip({
      isVisible: true,
      posX: leftPos,
      posY: topPos,
    });

    if (!tooltipRef.current || !targetRef.current) {
      return;
    }

    const { top, height, left, width } = targetRef.current.getBoundingClientRect();

    if (align) {
      if (appearance === 'horizontal') {
        if (vertical === 'top') {
          topPos = top - 5;
          arrowPos.y = 'top';
        }
        if (vertical === 'middle') {
          topPos = top + (height - tooltipRef.current.clientHeight) / 2;
          arrowPos.y = 'middle';
        }
        if (vertical === 'bottom') {
          topPos = top + height - tooltipRef.current.clientHeight + 5;
          arrowPos.y = 'bottom';
        }

        if (horizontal === 'left') {
          leftPos = left - tooltipRef.current.clientWidth - 10;
          arrowPos.x = 'right';
        }
        if (horizontal === 'right') {
          leftPos = left + width + 10;
          arrowPos.x = 'left';
        }
      } else {
        if (vertical === 'top') {
          topPos = top - tooltipRef.current.clientHeight - 5;
          arrowPos.y = 'bottom';
        }
        if (vertical === 'middle') {
          topPos = top - (height - tooltipRef.current.clientHeight) / 2;
          arrowPos.y = 'middle';
        }
        if (vertical === 'bottom') {
          topPos = top + height + 5;
          arrowPos.y = 'top';
        }

        if (horizontal === 'left') {
          leftPos = left - 10;
          arrowPos.x = 'left';
        }
        if (horizontal === 'right') {
          leftPos = left + width - tooltipRef.current.clientWidth + 10;
          if (leftPos < 0) {
            leftPos = 4;
          }
          arrowPos.x = 'right';
        }
        if (horizontal === 'middle') {
          leftPos = left + (width - tooltipRef.current.clientWidth) / 2;
          arrowPos.x = 'middle';
        }
      }
    } else {
      if (left <= tooltipRef.current.clientWidth / 2) {
        arrowPos.x = 'left';
        leftPos = left + width / 2 - 15;
      } else if (
        document.documentElement.clientWidth - left <=
        tooltipRef.current.clientWidth / 2
      ) {
        arrowPos.x = 'right';
        leftPos = left + width / 2 - tooltipRef.current.clientWidth + 10;
      } else {
        arrowPos.x = 'middle';
        leftPos = left + width / 2 - tooltipRef.current.clientWidth / 2;
      }

      if (
        document.documentElement.clientHeight - top - height >=
        tooltipRef.current.clientHeight
      ) {
        arrowPos.y = 'top';
        topPos = top + height + 10;
      } else {
        arrowPos.y = 'bottom';
        topPos = top - tooltipRef.current.clientHeight - 10;
      }
    }

    setTooltip({
      isVisible: true,
      posX: leftPos,
      posY: topPos,
    });
    setArrow(arrowPos);
  };

  useEffect(() => {
    const element = targetRef.current;
    const tooltip = tooltipRef.current;

    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseOut);

      if (tooltip) {
        tooltip.addEventListener('mouseenter', handleMouseEnter);
        tooltip.addEventListener('mouseleave', handleMouseOut);
      }
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseOut);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef, tooltipRef.current]);

  const TooltipContent = tooltip.isVisible ? (
    <div
      className={classNames('unique-tooltip', className)}
      ref={tooltipRef}
      style={{ top: tooltip.posY, left: tooltip.posX }}
    >
      <div
        className={classNames('arrow', appearance, {
          [arrow.x]: !![arrow.x],
          [arrow.y]: !![arrow.y],
        })}
      >
        <div className="icon" />
      </div>
      {typeof children === 'string' ? (
        <div className="content" dangerouslySetInnerHTML={{ __html: children }}></div>
      ) : (
        <div className="content">{children}</div>
      )}
    </div>
  ) : null;

  const el = useRef(document.querySelector('#root'));

  return ReactDOM.createPortal(TooltipContent, el.current as Element);
};
