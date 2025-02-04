import CalendarLocale from '../../Internal/Locale/de_DE';
import TimePickerLocale from '../../TimePicker/Locale/de_DE';
import type { PickerLocale } from '../Generate/Generate.types';

const locale: PickerLocale = {
    lang: {
        placeholder: 'Datum auswählen',
        rangePlaceholder: ['Startdatum', 'Enddatum'],
        ...CalendarLocale,
    },
    timePickerLocale: {
        ...TimePickerLocale,
    },
};

export default locale;
