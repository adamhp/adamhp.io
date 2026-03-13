import { navLinks } from '@/util/constants'
import { Link } from '@tanstack/react-router'
import ExternalLinkIcon from './ExternalLinkIcon'
import MobileNav from './MobileNav'

interface NavLinkProps {
  label: string
  to?: string
  href?: string
}

function NavLink({ label, to, href }: NavLinkProps) {
  if (to) {
    return (
      <>
        <Link to={to} className="link nav-link">
          {label}
        </Link>
      </>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="nav-link link relative"
    >
      {label}
      <span className="pointer-events-none select-none cursor-pointer absolute top-0.5 -right-5">
        <ExternalLinkIcon />
      </span>
    </a>
  )
}

export default function Header() {
  return (
    <header>
      <div className="hidden md:block">
        <nav className="h-24 max-w-2xl mx-auto flex flex-row items-end space-x-8 py-4 text-base font-mono uppercase justify-between">
          {navLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </nav>
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
    </header>
  )
}
