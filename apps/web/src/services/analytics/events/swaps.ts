import { EventType } from '../types'

const SWAP_CATEGORY = 'swap'

export const SWAP_EVENTS = {
  OPEN_SWAPS: {
    action: 'Open swaps',
    category: SWAP_CATEGORY,
  },
  SWAP_EXECUTED: {
    event: EventType.TX_EXECUTED,
    action: 'Execute swap',
    category: SWAP_CATEGORY,
  },
}

export enum SWAP_LABELS {
  dashboard = 'dashboard',
  sidebar = 'sidebar',
  asset = 'asset',
  dashboard_assets = 'dashboard_assets',
  promoWidget = 'promoWidget',
  safeAppsPromoWidget = 'safeAppsPromoWidget',
  newTransaction = 'newTransaction',
}
