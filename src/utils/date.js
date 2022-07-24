import { format, parse } from 'date-fns';

export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

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
