import { Home, Map, Star, UserRound, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: "/" | "/map" | "/recommend" | "/profile";
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/map", label: "지도", icon: Map },
  { href: "/recommend", label: "추천", icon: Star },
  { href: "/profile", label: "내 정보", icon: UserRound },
];

export function getActiveNavHref(pathname: string): NavItem["href"] {
  const path = pathname.split("?")[0];

  if (path === "/" || !path) {
    return "/";
  }

  if (path.startsWith("/parking") || path.startsWith("/map")) {
    return "/map";
  }

  if (path.startsWith("/recommend")) {
    return "/recommend";
  }

  if (path.startsWith("/profile")) {
    return "/profile";
  }

  return "/";
}
