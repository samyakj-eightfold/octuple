import React from 'react';
import { MONTH_COL_COUNT, MonthBodyProps } from './Month.types';
import { formatValue, isSameMonth } from '../../Utils/dateUtil';
import RangeContext from '../../RangeContext';
import useCellClassNames from '../../Hooks/useCellClassNames';
import PartialBody from '../PartialBody';
import { DatePickerSize, NullableDateType } from '../../OcPicker.types';

const MONTH_ROW_COUNT: number = 4;

function MonthBody<DateType>(props: MonthBodyProps<DateType>) {
    const {
        generateConfig,
        locale,
        monthCellRender,
        size = DatePickerSize.Medium,
        value,
        viewDate,
    } = props;

    const { rangedValue, hoverRangedValue } = React.useContext(RangeContext);

    const getCellClassNames = useCellClassNames({
        value,
        generateConfig,
        rangedValue,
        hoverRangedValue,
        isSameCell: (
            current: NullableDateType<DateType>,
            target: NullableDateType<DateType>
        ): boolean => isSameMonth(generateConfig, current, target),
        isInView: (): boolean => true,
        offsetCell: (date: DateType, offset: number): DateType =>
            generateConfig.addMonth(date, offset),
    });

    const monthsLocale: string[] =
        locale.shortMonths ||
        (generateConfig.locale.getShortMonths
            ? generateConfig.locale.getShortMonths(locale.locale)
            : []);

    const baseMonth: DateType = generateConfig.setMonth(viewDate, 0);

    const getCellNode: (date: DateType) => React.ReactNode = monthCellRender
        ? (date: DateType) => monthCellRender(date, locale)
        : undefined;

    return (
        <PartialBody
            {...props}
            rowNum={MONTH_ROW_COUNT}
            colNum={MONTH_COL_COUNT}
            baseDate={baseMonth}
            getCellNode={getCellNode}
            getCellText={(date: DateType): React.ReactNode =>
                locale.monthFormat
                    ? formatValue(date, {
                          locale,
                          format: locale.monthFormat,
                          generateConfig,
                      })
                    : monthsLocale[generateConfig.getMonth(date)]
            }
            getCellClassNames={getCellClassNames}
            getCellDate={generateConfig.addMonth}
            titleCell={(date: DateType): string =>
                formatValue(date, {
                    locale,
                    format: 'YYYY-MM',
                    generateConfig,
                })
            }
            size={size}
        />
    );
}

export default MonthBody;
