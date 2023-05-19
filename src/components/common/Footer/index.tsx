import type { SyntheticEvent, ReactElement } from 'react'
import { Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { useAppDispatch } from '@/store'
import { openCookieBanner } from '@/store/popupSlice'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
//import AppstoreButton from '../AppStoreButton'
import ExternalLink from '@/components/common/ExternalLink'
// import MUILink from '@mui/material/Link'

const footerPages = [
  AppRoutes.welcome,
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.cookie,
  AppRoutes.terms,
]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  const onCookieClick = (e: SyntheticEvent) => {
    e.preventDefault()
    dispatch(openCookieBanner({}))
  }

  return (
    <footer className={css.container}>
      <ul>
        <li>
          <Typography variant="caption">&copy;2022 Cronos</Typography>
        </li>
        <li>
          <ExternalLink noIcon href="https://cronos.org/">
            Cronos Network
          </ExternalLink>
        </li>
        <li>
          <ExternalLink noIcon href="https://cronos.org/docs/">
            Cronos Documentation
          </ExternalLink>
        </li>
        <li>
          <ExternalLink noIcon href="https://help.gnosis-safe.io/en/">
            Help Center
          </ExternalLink>
        </li>
        {/* <li>
          <ExternalLink suppressIcon href="https://safe.global/imprint">
            Imprint
          </ExternalLink>
        </li> */}
        <li>
          {/* <ExternalLink suppressIcon href="https://safe.global/cookie">
            Cookie Policy
          </ExternalLink>
          &nbsp;&mdash;&nbsp; */}
          <Link href="#" onClick={onCookieClick}>
            Preferences
          </Link>
        </li>
        <li>
          <ExternalLink noIcon href="/terms">
            Disclaimer
          </ExternalLink>
        </li>
        <li>
          <ExternalLink noIcon href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`}>
            v{packageJson.version}
          </ExternalLink>
        </li>
        {/* <li>
          <AppstoreButton placement="footer" />
        </li> */}
      </ul>
    </footer>
  )
}

export default Footer
