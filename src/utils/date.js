import { format, parse, addSeconds, addMinutes, addHours } from 'date-fns';

export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

export const LOCALE_HASH = {
  years: 'anos',
  year: 'ano',
  months: 'meses',
  month: 'mês',
  days: 'dias',
  day: 'dia',
  hours: 'horas',
  hour: 'hora',
  minutes: 'minutos',
  minute: 'minuto',
  seconds: 'segundos',
  second: 'segundo',
};

export const formatDate = (date) => {
  return format(date, DATE_TIME_FORMAT);
};

export const parseStrDate = (str) => {
  return parse(str, DATE_TIME_FORMAT, new Date());
};

export const validateStrDate = (str) => {
  try {
    return !Number.isNaN(parseStrDate(str).getTime());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};

export const addDurationToDate = (date, durationStr) => {
  const [hours, minutes, seconds] = durationStr
    .split(':')
    .map((item) => parseInt(item, 10));

  date = addHours(date, hours);
  date = addMinutes(date, minutes);
  date = addSeconds(date, seconds);

  return date;
};

export const durationStrLocale = (str) => {
  Object.entries(LOCALE_HASH).forEach((item) => {
    str = str.replace(item[0], item[1]);
  });

  return str;
};

export * from 'date-fns';
