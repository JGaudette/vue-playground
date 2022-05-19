import dayjs from 'dayjs';

export function formatFullDate(dt) {
  return dayjs(dt).format('YYYY-MM-DD HH:mm:ss');
}
