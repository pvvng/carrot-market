export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

/** 날짜를 x일 전, x일 후로 표기하는 함수 */
export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "days");
}
