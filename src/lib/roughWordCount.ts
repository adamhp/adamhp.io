/** Word count of a post body, rounded to the nearest 10 and formatted (e.g. "1,290"). */
export function roughWordCount(body: string | undefined): string {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length
  return (Math.round(words / 10) * 10).toLocaleString('en-US')
}
