// Lightweight class merge — replace with `clsx` + `tailwind-merge` if you grow
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
