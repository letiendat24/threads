import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const avatarSizes = {
  xs: "size-7 text-xs",
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-base",
  xl: "size-24 text-xl",
} as const;

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: keyof typeof avatarSizes;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserAvatar({ name, src, size = "md", className }: UserAvatarProps) {
  return (
    <Avatar className={cn(avatarSizes[size], className)}>
      {src ? <AvatarImage src={src} alt={`${name} avatar`} /> : null}
      <AvatarFallback>{getInitials(name) || "U"}</AvatarFallback>
    </Avatar>
  );
}
