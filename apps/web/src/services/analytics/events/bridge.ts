import { EventType } from '../types'

const BRIDGE_CATEGORY = 'bridge'

export const BRIDGE_EVENTS = {
  OPEN_BRIDGE: {
    action: 'Open bridge',
    category: BRIDGE_CATEGORY,
  },
  BRIDGE_EXECUTED: {
    event: EventType.TX_EXECUTED,
    action: 'Execute bridge',
    category: BRIDGE_CATEGORY,
  },
}

export enum BRIDGE_LABELS {
  sidebar = 'sidebar',
}
