import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'

export const CONTACT_EMAIL = 'afrankenreider@gmail.com'

const socialLinks = [
  {
    Icon: LinkedInIcon,
    href: 'https://www.linkedin.com/in/andrew-frankenreider-934581b1/',
    label: 'LinkedIn',
    external: true,
  },
  { Icon: GitHubIcon, href: 'https://github.com/afrankenreider', label: 'GitHub', external: true },
  { Icon: EmailIcon, href: `mailto:${CONTACT_EMAIL}`, label: 'Email', external: false },
]

interface SocialLinksProps {
  className?: string
}

/** Icon links to LinkedIn, GitHub, and email. Shared by the home hero and the footer. */
export default function SocialLinks({ className = '' }: SocialLinksProps) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map(({ Icon, href, label, external }) => (
        <li key={label}>
          <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="social-link"
          >
            <Icon aria-hidden="true" sx={{ fontSize: 18 }} />
            <span className="visually-hidden">
              {label}
              {external && ' (opens in a new tab)'}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
