/* eslint-disable no-template-curly-in-string */
import type { Locale } from '../LocaleProvider';
import DatePicker from '../DateTimePicker/DatePicker/Locale/uk_UA';
import Dialog from '../Dialog/BaseDialog/Locale/uk_UA';
import InfoBar from '../InfoBar/Locale/uk_UA';
import Pagination from '../Pagination/Locale/uk_UA';
import Panel from '../Panel/Locale/uk_UA';
import Table from '../Table/Locale/uk_UA';
import TimePicker from '../DateTimePicker/TimePicker/Locale/uk_UA';
import Upload from '../Upload/Locale/uk_UA';

const typeTemplate = '${label} не є типом ${type}';

const localeValues: Locale = {
    locale: 'uk',
    global: {
        placeholder: 'Будь ласка, оберіть',
    },
    DatePicker,
    Dialog,
    Form: {
        optional: '(опціонально)',
        defaultValidateMessages: {
            default: 'Помилка валідації для поля ${label}',
            required: 'Будь ласка, заповніть ${label}',
            enum: 'Лише одне зі значень [${enum}] доступне для ${label}',
            whitespace: 'Значення у полі ${label} не може бути пробілом',
            date: {
                format: 'Не валідний формат дати у ${label}',
                parse: 'Значення ${label} не може бути приведене до дати',
                invalid: 'Не валідна дата у ${label}',
            },
            types: {
                string: typeTemplate,
                method: typeTemplate,
                array: typeTemplate,
                object: typeTemplate,
                number: typeTemplate,
                date: typeTemplate,
                boolean: typeTemplate,
                integer: typeTemplate,
                float: typeTemplate,
                regexp: typeTemplate,
                email: typeTemplate,
                url: typeTemplate,
                hex: typeTemplate,
            },
            string: {
                len: '${label} має містити ${len} символів',
                min: '${label} має містити не менш, ніж ${min} символів',
                max: '${label} має містити не більш, ніж ${max} символів',
                range: '${label} має містити ${min}-${max} символів',
            },
            number: {
                len: '${label} має дорівнювати ${len}',
                min: '${label} має бути не менш, ніж ${min}',
                max: '${label} має бути не більш, ніж ${max}',
                range: '${label} має бути в межах ${min}-${max}',
            },
            array: {
                len: '${label} має містити ${len} елементи',
                min: '${label} має містити не менш, ніж ${min} елементи',
                max: '${label} має містити не більш, ніж ${max} елементи',
                range: 'Кількість елементів в ${label} має бути в межах ${min}-${max}',
            },
            pattern: {
                mismatch: '${label} не відповідає шаблону ${pattern}',
            },
        },
    },
    InfoBar,
    Pagination,
    Panel,
    Table,
    TimePicker,
    Upload,
};

export default localeValues;
