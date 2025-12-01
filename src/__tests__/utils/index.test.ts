import {
  formatTime,
  getTimerStatus,
  generateId,
  formatTimestamp,
  calculateElapsedTime,
} from '../../utils';

describe('formatTime', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats seconds less than a minute', () => {
    expect(formatTime(30)).toBe('00:30');
    expect(formatTime(59)).toBe('00:59');
  });

  it('formats exact minutes', () => {
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(120)).toBe('02:00');
    expect(formatTime(600)).toBe('10:00');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(125)).toBe('02:05');
    expect(formatTime(2700)).toBe('45:00');
  });

  it('formats times over an hour', () => {
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(3661)).toBe('61:01');
  });

  it('pads single digit values with zeros', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(65)).toBe('01:05');
  });
});

describe('getTimerStatus', () => {
  
  it('returns "normal" for time above warning threshold', () => {
    expect(getTimerStatus(600)).toBe('normal');
    expect(getTimerStatus(301)).toBe('normal');
  });

  it('returns "warning" for time at or below warning threshold but above critical', () => {
    expect(getTimerStatus(300)).toBe('warning');
    expect(getTimerStatus(180)).toBe('warning');
    expect(getTimerStatus(61)).toBe('warning');
  });

  it('returns "critical" for time at or below critical threshold', () => {
    expect(getTimerStatus(60)).toBe('critical');
    expect(getTimerStatus(30)).toBe('critical');
    expect(getTimerStatus(1)).toBe('critical');
    expect(getTimerStatus(0)).toBe('critical');
  });
});

describe('generateId', () => {
  it('generates a string ID', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  it('generates unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });

  it('ID contains timestamp and random part', () => {
    const id = generateId();
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);
  });
});

describe('formatTimestamp', () => {
  it('formats a date to HH:MM:SS format', () => {
    const date = new Date('2024-01-15T14:30:45');
    const result = formatTimestamp(date);
    expect(result).toBe('14:30:45');
  });

  it('pads single digits with zeros', () => {
    const date = new Date('2024-01-15T09:05:03');
    const result = formatTimestamp(date);
    expect(result).toBe('09:05:03');
  });

  it('handles midnight', () => {
    const date = new Date('2024-01-15T00:00:00');
    const result = formatTimestamp(date);
    expect(result).toBe('00:00:00');
  });
});

describe('calculateElapsedTime', () => {
  it('calculates elapsed time in seconds', () => {
    const start = new Date('2024-01-15T10:00:00');
    const end = new Date('2024-01-15T10:05:00');
    expect(calculateElapsedTime(start, end)).toBe(300);
  });

  it('returns 0 for same time', () => {
    const time = new Date('2024-01-15T10:00:00');
    expect(calculateElapsedTime(time, time)).toBe(0);
  });

  it('handles times across hours', () => {
    const start = new Date('2024-01-15T10:45:00');
    const end = new Date('2024-01-15T11:30:00');
    expect(calculateElapsedTime(start, end)).toBe(2700);
  });
});
