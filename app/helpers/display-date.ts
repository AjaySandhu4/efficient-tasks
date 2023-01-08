import { helper } from '@ember/component/helper';

export function displayDate(
  [date]: [Date | null],
  { type }: { type: 'short' | 'long' }
): string {
  if (!date) return 'TBD';
  const dateStringArray: string[] = date?.toDateString().split(' ');
  if (type === 'short') {
    return `${dateStringArray?.[1]} ${dateStringArray?.[2]}`;
  } else {
    return 'Not supported just yet';
  }
}

export default helper(displayDate);
