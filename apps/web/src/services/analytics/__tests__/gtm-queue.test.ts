import { EventType } from '../types'

const mockSendGAEvent = jest.fn()

jest.mock('@next/third-parties/google', () => ({
  sendGAEvent: (...args: unknown[]) => mockSendGAEvent(...args),
}))

jest.mock('@/config/constants', () => ({
  GA_TRACKING_ID: 'G-TEST',
  SAFE_APPS_GA_TRACKING_ID: 'G-TEST-APPS',
  IS_PRODUCTION: true,
}))

jest.mock('../../tracking/abTesting', () => ({
  getAbTest: () => undefined,
}))

// Must import after mocks are set up
import { gtmTrack, gtmTrackPageview, gtmSetChainId, gtmFlushQueue, _resetQueueForTesting } from '../gtm'

describe('gtm event queue (chainId race condition fix)', () => {
  beforeEach(() => {
    mockSendGAEvent.mockClear()
    _resetQueueForTesting()
    gtmSetChainId('')
  })

  it('queues events when chainId is empty and not yet ready', () => {
    gtmTrack({
      event: EventType.CLICK,
      category: 'test',
      action: 'Test action',
    })

    // Event should NOT be sent directly
    expect(mockSendGAEvent).not.toHaveBeenCalled()
  })

  it('flushes queued events with the correct chainId when gtmFlushQueue is called', () => {
    // Fire events while chainId is empty
    gtmTrack({
      event: EventType.CLICK,
      category: 'test',
      action: 'Action 1',
    })

    gtmTrack({
      event: EventType.CLICK,
      category: 'test',
      action: 'Action 2',
    })

    expect(mockSendGAEvent).not.toHaveBeenCalled()

    // Now set chainId and flush
    gtmSetChainId('84532')
    gtmFlushQueue()

    expect(mockSendGAEvent).toHaveBeenCalledTimes(2)

    // Both events should have the correct chainId
    expect(mockSendGAEvent.mock.calls[0][2]).toMatchObject({ chainId: '84532' })
    expect(mockSendGAEvent.mock.calls[1][2]).toMatchObject({ chainId: '84532' })
  })

  it('sends events directly after chainId is set and queue is flushed', () => {
    gtmSetChainId('1')
    gtmFlushQueue()

    mockSendGAEvent.mockClear()

    gtmTrack({
      event: EventType.CLICK,
      category: 'test',
      action: 'Direct event',
    })

    // Should be sent immediately, not queued
    expect(mockSendGAEvent).toHaveBeenCalledTimes(1)
    expect(mockSendGAEvent.mock.calls[0][2]).toMatchObject({ chainId: '1' })
  })

  it('only flushes once — subsequent flush calls are no-ops', () => {
    gtmTrack({
      event: EventType.CLICK,
      category: 'test',
      action: 'Queued event',
    })

    gtmSetChainId('10')
    gtmFlushQueue()
    expect(mockSendGAEvent).toHaveBeenCalledTimes(1)

    // Second flush should be a no-op
    mockSendGAEvent.mockClear()
    gtmFlushQueue()
    expect(mockSendGAEvent).not.toHaveBeenCalled()
  })

  it('queues pageview events when chainId is empty', () => {
    gtmTrackPageview('/balances', '/balances?safe=eth:0x123')

    expect(mockSendGAEvent).not.toHaveBeenCalled()

    gtmSetChainId('1')
    gtmFlushQueue()

    expect(mockSendGAEvent).toHaveBeenCalledTimes(1)
    expect(mockSendGAEvent.mock.calls[0][2]).toMatchObject({
      chainId: '1',
      page_path: '/balances',
    })
  })

  it('sends events with explicit chainId immediately without queueing', () => {
    // Events that already have a chainId set should bypass the queue
    gtmTrack({
      event: EventType.CLICK,
      category: 'test',
      action: 'Test',
      chainId: '137',
    })

    // Should be sent immediately since the event has its own chainId
    expect(mockSendGAEvent).toHaveBeenCalledTimes(1)
    expect(mockSendGAEvent.mock.calls[0][2]).toMatchObject({ chainId: '137' })
  })
})
