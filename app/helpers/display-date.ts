import { helper } from '@ember/component/helper';

export function displayDate(
  [date]: [Date],
  { type }: { type: 'short' | 'long' }
): string {
  const dateStringArray: string[] = date?.toDateString().split(' ');
  if (type === 'short') {
    return `${dateStringArray?.[1]} ${dateStringArray?.[2]}`;
  } else {
    return 'Not supported just yet';
  }
}

export default helper(displayDate);
