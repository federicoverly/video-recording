export function classNames(...classNames: (string | false | undefined | null)[]) {
  return classNames.filter(Boolean).join(' ');
}
