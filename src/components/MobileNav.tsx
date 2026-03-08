import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { navLinks } from '../util/constants'
import ExternalLinkIcon from './ExternalLinkIcon'

const MobileNav = () => (
  <Menu as="nav">
    {({ open }) => (
      <>
        <MenuButton className="bg-background-darker p-2 rounded-lg m-2">
          <NavIcon />
        </MenuButton>
        {open && (
          <MenuItems
            static
            as={motion.div}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="bg-background-darker opacity-100 p-4 m-2 rounded-lg w-[calc(100vw-1rem)] space-y-4 text-xl"
            anchor="bottom"
          >
            {navLinks.map((link) => (
              <MenuItem key={link.label}>
                {({ close }) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {link.to ? (
                      <Link
                        to={link.to}
                        onClick={close}
                        className={`block data-focus:bg-blue-100`}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={close}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block data-focus:bg-blue-100 relative`}
                      >
                        {link.label}
                        <span className="pointer-events-none select-none cursor-pointer absolute top-0.5 ml-1 md:ml-0 md:-right-5">
                          <ExternalLinkIcon />
                        </span>
                      </a>
                    )}
                  </motion.div>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        )}
      </>
    )}
  </Menu>
)

const NavIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-menu-icon lucide-menu"
  >
    <path d="M4 5h16" />
    <path d="M4 12h16" />
    <path d="M4 19h16" />
  </svg>
)

export default MobileNav
