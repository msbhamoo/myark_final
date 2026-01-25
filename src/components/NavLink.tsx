import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  activeClassName?: string;
  inset?: boolean;
}

const NavLink = ({ href, className, activeClassName, inset, children, ...props }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname ? (pathname === href || (href !== '/' && pathname.startsWith(href))) : false;

  return (
    <Link
      href={href}
      className={cn(
        className,
        isActive ? activeClassName : "",
        inset ? "pl-8" : ""
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
