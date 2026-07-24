import { trackTxEvents } from '../tracking'
import { TX_TYPES } from '@/services/analytics/events/transactions'
import { EventType } from '@/services/analytics/types'

const mockTrackEvent = jest.fn()

jest.mock('@/services/analytics', () => ({
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
  MODALS_EVENTS: { RECEIPT_TIME_SPENT: { action: 'Time spent', category: 'modals' } },
}))

jest.mock('@/utils/transaction-guards', () => ({
  isNestedConfirmationTxInfo: () => false,
  isERC721Transfer: () => false,
  isMultiSendTxInfo: () => false,
  isSettingsChangeTxInfo: () => false,
  isTransferTxInfo: () => false,
  isCustomTxInfo: () => false,
  isCancellationTxInfo: () => false,
  isSwapOrderTxInfo: () => false,
  isAnyStakingTxInfo: () => false,
  isAnyEarnTxInfo: () => false,
}))

// Mock tx-tracking to control the returned TX type
let mockTxType = TX_TYPES.custom
jest.mock('@/services/analytics/tx-tracking', () => ({
  getTransactionTrackingType: () => mockTxType,
}))

describe('trackTxEvents — specific execution events', () => {
  beforeEach(() => {
    mockTrackEvent.mockClear()
    mockTxType = TX_TYPES.custom
  })

  it('fires SWAP_EXECUTED alongside generic EXECUTE for native_swap', () => {
    mockTxType = TX_TYPES.native_swap

    trackTxEvents(undefined, false, true, false, false, false)

    // Should fire: generic EXECUTE + specific SWAP_EXECUTED
    expect(mockTrackEvent).toHaveBeenCalledTimes(2)

    // First call: generic execute event
    expect(mockTrackEvent.mock.calls[0][0]).toMatchObject({
      event: EventType.TX_EXECUTED,
      action: 'Execute transaction',
      label: TX_TYPES.native_swap,
    })

    // Second call: specific swap event
    expect(mockTrackEvent.mock.calls[1][0]).toMatchObject({
      event: EventType.TX_EXECUTED,
      action: 'Execute swap',
      category: 'swap',
      label: TX_TYPES.native_swap,
    })
  })

  it('fires SWAP_EXECUTED for native_swap_lifi', () => {
    mockTxType = TX_TYPES.native_swap_lifi

    trackTxEvents(undefined, false, true, false, false, false)

    expect(mockTrackEvent).toHaveBeenCalledTimes(2)
    expect(mockTrackEvent.mock.calls[1][0]).toMatchObject({
      action: 'Execute swap',
      category: 'swap',
      label: TX_TYPES.native_swap_lifi,
    })
  })

  it('fires BRIDGE_EXECUTED alongside generic EXECUTE for native_bridge', () => {
    mockTxType = TX_TYPES.native_bridge

    trackTxEvents(undefined, false, true, false, false, false)

    expect(mockTrackEvent).toHaveBeenCalledTimes(2)
    expect(mockTrackEvent.mock.calls[1][0]).toMatchObject({
      event: EventType.TX_EXECUTED,
      action: 'Execute bridge',
      category: 'bridge',
      label: TX_TYPES.native_bridge,
    })
  })

  it('fires EARN_TX_EXECUTED alongside generic EXECUTE for native_earn', () => {
    mockTxType = TX_TYPES.native_earn

    trackTxEvents(undefined, false, true, false, false, false)

    expect(mockTrackEvent).toHaveBeenCalledTimes(2)
    expect(mockTrackEvent.mock.calls[1][0]).toMatchObject({
      event: EventType.TX_EXECUTED,
      action: 'Execute earn transaction',
      category: 'earn',
      label: TX_TYPES.native_earn,
    })
  })

  it('does NOT fire specific event for non-swap/bridge/earn tx types', () => {
    mockTxType = TX_TYPES.transfer_token

    trackTxEvents(undefined, false, true, false, false, false)

    // Only generic EXECUTE, no specific event
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0][0]).toMatchObject({
      action: 'Execute transaction',
    })
  })

  it('does NOT fire specific event on creation-only (no execution)', () => {
    mockTxType = TX_TYPES.native_swap

    trackTxEvents(undefined, true, false, false, false, false)

    // Only generic CREATE event, no specific execution event
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0][0]).toMatchObject({
      action: 'Create transaction',
    })
  })

  it('fires specific event on immediate execution (isCreation=true, isExecuted=true)', () => {
    mockTxType = TX_TYPES.native_bridge

    trackTxEvents(undefined, true, true, false, false, false)

    // Should fire: CREATE + EXECUTE (immediate) + BRIDGE_EXECUTED
    expect(mockTrackEvent).toHaveBeenCalledTimes(3)
    expect(mockTrackEvent.mock.calls[0][0]).toMatchObject({ action: 'Create transaction' })
    expect(mockTrackEvent.mock.calls[1][0]).toMatchObject({ action: 'Execute transaction' })
    expect(mockTrackEvent.mock.calls[2][0]).toMatchObject({ action: 'Execute bridge', category: 'bridge' })
  })
})
