export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
}

export function formatTimeAgo(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}p trước`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins < 10 ? '0' : ''}${remainingMins}p trước`;
}
