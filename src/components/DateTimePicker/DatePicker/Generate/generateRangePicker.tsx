import React, {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import DisabledContext, {
    Disabled,
} from '../../../ConfigProvider/DisabledContext';
import {
    ShapeContext,
    Shape,
    SizeContext,
    Size,
} from '../../../ConfigProvider';
import { DatePickerShape, DatePickerSize } from '../../Internal/OcPicker.types';
import { mergeClasses } from '../../../../shared/utilities';
import OcRangePicker from '../../Internal/OcRangePicker';
import type { GenerateConfig } from '../../Internal/Generate';
import { Components } from './Generate.types';
import type {
    CommonPickerMethods,
    PickerComponentClass,
    PickerLocale,
    RangePickerProps,
} from './Generate.types';
import { getTimeProps } from './Generate';
import LocaleReceiver, {
    useLocaleReceiver,
} from '../../../LocaleProvider/LocaleReceiver';
import enUS from '../Locale/en_US';
import { getRangePlaceholder, transPlacement2DropdownAlign } from '../util';
import { Icon, IconName, IconSize } from '../../../Icon';
import { dir, useCanvasDirection } from '../../../../hooks/useCanvasDirection';
import { Breakpoints, useMatchMedia } from '../../../../hooks/useMatchMedia';
import { FormItemInputContext } from '../../../Form/Context';
import { getMergedStatus } from '../../../../shared/utilities';

import styles from '../datepicker.module.scss';

export default function generateRangePicker<DateType>(
    generateConfig: GenerateConfig<DateType>
): PickerComponentClass<RangePickerProps<DateType>> {
    type InternalRangePickerProps = RangePickerProps<DateType> & {};

    const RangePicker = forwardRef<
        InternalRangePickerProps | CommonPickerMethods,
        RangePickerProps<DateType>
    >((props, ref) => {
        const {
            bordered = true,
            classNames,
            clearIconAriaLabelText: defaultClearIconAriaLabelText,
            configContextProps = {
                noDisabledContext: false,
                noShapeContext: false,
                noSizeContext: false,
            },
            disabled = false,
            formItemInput = false,
            getPopupContainer,
            id,
            locale = enUS,
            nowText: defaultNowText,
            okText: defaultOkText,
            placeholder,
            popupPlacement,
            shape = DatePickerShape.Rectangle,
            size = DatePickerSize.Medium,
            status,
            todayText: defaultTodayText,
            ...rest
        } = props;
        const largeScreenActive: boolean = useMatchMedia(Breakpoints.Large);
        const mediumScreenActive: boolean = useMatchMedia(Breakpoints.Medium);
        const smallScreenActive: boolean = useMatchMedia(Breakpoints.Small);
        const xSmallScreenActive: boolean = useMatchMedia(Breakpoints.XSmall);
        const innerRef: React.MutableRefObject<OcRangePicker<DateType>> =
            React.useRef<OcRangePicker<DateType>>(null);
        const htmlDir: string = useCanvasDirection();
        const { format, showTime, picker } = props as any;

        let additionalOverrideProps: any = {};
        additionalOverrideProps = {
            ...additionalOverrideProps,
            ...(showTime ? getTimeProps({ format, picker, ...showTime }) : {}),
            ...(picker === 'time'
                ? getTimeProps({ format, ...props, picker })
                : {}),
        };

        const { isFormItemInput, status: contextStatus } =
            useContext(FormItemInputContext);
        const mergedStatus = getMergedStatus(contextStatus, status);
        const mergedFormItemInput: boolean = isFormItemInput || formItemInput;

        const contextuallyDisabled: Disabled = useContext(DisabledContext);
        const mergedDisabled: Disabled | [boolean, boolean] =
            configContextProps.noDisabledContext
                ? disabled
                : contextuallyDisabled || disabled;

        const contextuallyShaped: Shape = useContext(ShapeContext);
        const mergedShape = configContextProps.noShapeContext
            ? shape
            : contextuallyShaped || shape;

        const contextuallySized: Size = useContext(SizeContext);
        const mergedSize = configContextProps.noSizeContext
            ? size
            : contextuallySized || size;

        // ============================ Strings ===========================
        const [pickerLocale] = useLocaleReceiver('DatePicker');
        let mergedLocale: PickerLocale;

        if (props.locale) {
            mergedLocale = props.locale;
        } else {
            mergedLocale = pickerLocale || props.locale;
        }

        const [clearIconAriaLabelText, setClearIconAriaLabelText] =
            useState<string>(defaultClearIconAriaLabelText);
        const [nowText, setNowText] = useState<string>(defaultNowText);
        const [okText, setOkText] = useState<string>(defaultOkText);
        const [todayText, setTodayText] = useState<string>(defaultTodayText);

        // Locs: if the prop isn't provided use the loc defaults.
        // If the mergedLocale is changed, update.
        useEffect(() => {
            setClearIconAriaLabelText(
                props.clearIconAriaLabelText
                    ? props.clearIconAriaLabelText
                    : mergedLocale.lang!.clear
            );
            setNowText(props.nowText ? props.nowText : mergedLocale.lang!.now);
            setOkText(props.okText ? props.okText : mergedLocale.lang!.ok);
            setTodayText(
                props.todayText ? props.todayText : mergedLocale.lang!.today
            );
        }, [mergedLocale]);

        const getIconSize = (): IconSize => {
            let iconSize: IconSize;
            if (largeScreenActive) {
                iconSize = IconSize.Small;
            } else if (mediumScreenActive) {
                iconSize = IconSize.Medium;
            } else if (smallScreenActive) {
                iconSize = IconSize.Medium;
            } else if (xSmallScreenActive) {
                iconSize = IconSize.Large;
            }
            return iconSize;
        };

        const pickerSizeToIconSizeMap = new Map<typeof mergedSize, IconSize>([
            [DatePickerSize.Flex, getIconSize()],
            [DatePickerSize.Large, IconSize.Large],
            [DatePickerSize.Medium, IconSize.Medium],
            [DatePickerSize.Small, IconSize.Small],
        ]);

        const iconColor = (): string => {
            let color: string = 'var(--grey-color-60)';
            if (mergedStatus === 'error') {
                color = 'var(--error-color)';
            } else if (mergedStatus === 'warning') {
                color = 'var(--warning-color)';
            }
            return color;
        };

        const suffixNode = (
            <>
                {picker === 'time' ? (
                    <Icon
                        color={iconColor()}
                        path={IconName.mdiClockOutline}
                        size={pickerSizeToIconSizeMap.get(size)}
                    />
                ) : (
                    <Icon
                        color={iconColor()}
                        path={IconName.mdiCalendarBlankOutline}
                        size={pickerSizeToIconSizeMap.get(size)}
                    />
                )}
            </>
        );

        useImperativeHandle(ref, () => ({
            focus: () => innerRef.current?.focus(),
            blur: () => innerRef.current?.blur(),
        }));

        return (
            <LocaleReceiver componentName={'DatePicker'} defaultLocale={enUS}>
                {(contextLocale: PickerLocale) => {
                    const locale = { ...contextLocale, ...mergedLocale };

                    return (
                        <OcRangePicker<DateType>
                            bordered={bordered}
                            clearIconAriaLabelText={clearIconAriaLabelText}
                            id={id}
                            separator={
                                <span
                                    aria-label="to"
                                    className={styles.pickerSeparator}
                                >
                                    <Icon
                                        path={IconName.mdiArrowRightThin}
                                        rotate={htmlDir === 'rtl' ? 180 : 0}
                                        size={IconSize.Medium}
                                    />
                                </span>
                            }
                            disabled={mergedDisabled}
                            ref={innerRef}
                            dropdownAlign={transPlacement2DropdownAlign(
                                htmlDir as dir,
                                popupPlacement
                            )}
                            popupPlacement={popupPlacement}
                            nowText={nowText}
                            okText={okText}
                            todayText={todayText}
                            placeholder={getRangePlaceholder(
                                picker,
                                locale,
                                placeholder
                            )}
                            suffixIcon={suffixNode}
                            clearIcon={
                                <Icon
                                    path={IconName.mdiCloseCircle}
                                    size={pickerSizeToIconSizeMap.get(size)}
                                />
                            }
                            prevIcon={IconName.mdiChevronLeft}
                            nextIcon={IconName.mdiChevronRight}
                            superPrevIcon={IconName.mdiChevronDoubleLeft}
                            superNextIcon={IconName.mdiChevronDoubleRight}
                            allowClear
                            {...rest}
                            {...additionalOverrideProps}
                            classNames={mergeClasses([
                                {
                                    [styles.pickerSmall]:
                                        mergedSize === DatePickerSize.Flex &&
                                        largeScreenActive,
                                },
                                {
                                    [styles.pickerMedium]:
                                        mergedSize === DatePickerSize.Flex &&
                                        mediumScreenActive,
                                },
                                {
                                    [styles.pickerMedium]:
                                        mergedSize === DatePickerSize.Flex &&
                                        smallScreenActive,
                                },
                                {
                                    [styles.pickerLarge]:
                                        mergedSize === DatePickerSize.Flex &&
                                        xSmallScreenActive,
                                },
                                {
                                    [styles.pickerLarge]:
                                        mergedSize === DatePickerSize.Large,
                                },
                                {
                                    [styles.pickerMedium]:
                                        mergedSize === DatePickerSize.Medium,
                                },
                                {
                                    [styles.pickerSmall]:
                                        mergedSize === DatePickerSize.Small,
                                },
                                { [styles.pickerBorderless]: !bordered },
                                {
                                    [styles.pickerUnderline]:
                                        mergedShape ===
                                        DatePickerShape.Underline,
                                },
                                {
                                    [styles.pickerPill]:
                                        mergedShape === DatePickerShape.Pill,
                                },
                                {
                                    [styles.pickerStatusWarning]:
                                        mergedStatus === 'warning',
                                },
                                {
                                    [styles.pickerStatusError]:
                                        mergedStatus === 'error',
                                },
                                {
                                    [styles.pickerStatusSuccess]:
                                        mergedStatus === 'success',
                                },
                                { [styles.pickerRtl]: htmlDir === 'rtl' },
                                { ['in-form-item']: mergedFormItemInput },
                                classNames,
                            ])}
                            locale={locale!.lang}
                            getPopupContainer={getPopupContainer}
                            generateConfig={generateConfig}
                            components={Components}
                            direction={htmlDir}
                            shape={mergedShape}
                            size={mergedSize}
                        />
                    );
                }}
            </LocaleReceiver>
        );
    });

    return RangePicker as unknown as PickerComponentClass<
        RangePickerProps<DateType>
    >;
}
