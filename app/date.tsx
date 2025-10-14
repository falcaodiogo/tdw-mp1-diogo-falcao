import { format } from "date-fns";

export function formatDate(dateString: string) {
  return format(new Date(dateString), "LLLL d, yyyy");
}

export default function DateComponent({
  dateString,
}: Readonly<{ dateString: string }>) {
  return <time dateTime={dateString}>{formatDate(dateString)}</time>;
}
