import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ProgressStepsProps } from './Progress.types';
import { MAX_PERCENT } from './Internal/Common';
import { ResizeObserver } from '../../shared/ResizeObserver/ResizeObserver';
import { mergeClasses } from '../../shared/utilities';

import styles from './progress.module.scss';

const STEP_ITEM_MARGIN_OFFSET: number = 4;

const Steps: FC<ProgressStepsProps> = (props) => {
    const {
        children,
        direction: directionConfig,
        maxLabelRef,
        minLabelRef,
        percent = 0,
        showLabels,
        showValueLabel,
        size,
        steps,
        stepWidth,
        strokeColor,
        strokeWidth = 6,
        trailColor = null as any,
        valueLabelRef,
    } = props;
    const [calculatedWidth, setCalculatedWidth] = useState<string>('0');
    const current: number = Math.round(steps * (percent / MAX_PERCENT));
    const styledSteps: React.ReactNode[] = new Array(steps);
    const flexContainerRef: React.MutableRefObject<HTMLDivElement> =
        useRef<HTMLDivElement>(null);
    const progressBgRef: React.MutableRefObject<HTMLDivElement> =
        useRef<HTMLDivElement>(null);

    for (let i: number = 0; i < steps; ++i) {
        const color: string = Array.isArray(strokeColor)
            ? strokeColor[i]
            : strokeColor;
        styledSteps[i] = (
            <div
                ref={i <= current - 1 ? progressBgRef : undefined}
                key={i}
                className={mergeClasses([
                    styles.progressStepsItem,
                    {
                        [styles.progressStepsItemActive]: i <= current - 1,
                    },
                ])}
                style={{
                    backgroundColor: i <= current - 1 ? color : trailColor,
                    borderColor: i <= current - 1 ? color : trailColor,
                    width: stepWidth ? stepWidth : calculatedWidth,
                    height: size === 'small' ? 4 : strokeWidth,
                }}
            />
        );
    }

    useEffect(() => {
        // Early exit if there is stepWidth via props.
        if (stepWidth > 0) {
            return;
        }

        const flexContainerWidth: number =
            flexContainerRef.current?.offsetWidth || 0;
        const itemWidth: number = Math.round(
            Math.floor(flexContainerWidth / steps) -
                STEP_ITEM_MARGIN_OFFSET +
                Math.ceil(STEP_ITEM_MARGIN_OFFSET / steps)
        );

        // Calculates the percent width of each item
        setCalculatedWidth(
            `${(itemWidth / flexContainerWidth) * MAX_PERCENT}%`
        );
    }, [steps]);

    const updateLayout = (): void => {
        // Early exit if there is no ref available yet. The DOM has yet to initialize
        // and its not possible to calculate positions.
        if (!valueLabelRef?.current || !showValueLabel) {
            return;
        }

        // Hide the min/max labels if the value labels would collide.
        let progressBarOffset: number;
        const valueLabelOffset: number = valueLabelRef.current.offsetWidth;

        let showMaxLabel: boolean;
        let showMinLabel: boolean;

        if (directionConfig === 'rtl') {
            progressBarOffset = progressBgRef.current.offsetWidth;

            showMaxLabel =
                showLabels &&
                valueLabelRef.current.getBoundingClientRect().left >
                    maxLabelRef.current.getBoundingClientRect().right;
            maxLabelRef.current.style.opacity = showMaxLabel ? '1' : '0';

            showMinLabel =
                showLabels &&
                valueLabelRef.current.getBoundingClientRect().left +
                    valueLabelOffset <
                    minLabelRef.current.getBoundingClientRect().left;
            minLabelRef.current.style.opacity = showMinLabel ? '1' : '0';

            valueLabelRef.current.style.right = `${
                progressBarOffset - valueLabelOffset / 2
            }px`;
            valueLabelRef.current.style.left = 'unset';
        } else {
            progressBarOffset =
                progressBgRef.current.getBoundingClientRect().right;
            showMaxLabel =
                showLabels &&
                valueLabelRef.current.getBoundingClientRect().left +
                    valueLabelOffset <
                    maxLabelRef.current.getBoundingClientRect().left;
            maxLabelRef.current.style.opacity = showMaxLabel ? '1' : '0';

            showMinLabel =
                showLabels &&
                valueLabelRef.current.getBoundingClientRect().left >
                    minLabelRef.current.getBoundingClientRect().right;
            minLabelRef.current.style.opacity = showMinLabel ? '1' : '0';

            valueLabelRef.current.style.left = `${
                progressBarOffset - valueLabelOffset
            }px`;
            valueLabelRef.current.style.right = 'unset';
        }
    };

    useLayoutEffect(() => {
        updateLayout();
    }, [showLabels, showValueLabel]);

    return (
        <ResizeObserver onResize={updateLayout}>
            <div ref={flexContainerRef} className={styles.progressStepsOuter}>
                {styledSteps}
            </div>
            {children}
        </ResizeObserver>
    );
};

export default Steps;
