export type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type DaySchedule = {
  day: string;
  open: string | null;
  close: string | null;
  isClosed: boolean;
};

const WEEKDAYS: Weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const WIB_TIME_ZONE = 'Asia/Jakarta';

// TODO(company): Confirm regular hours, holiday closures, booking-only exceptions, and timezone before launch. See CONCEPT_HANDOFF.md.
export const schedule: Record<Weekday, DaySchedule> = {
  sunday: { day: 'Minggu', open: '10:00', close: '18:00', isClosed: false },
  monday: { day: 'Senin', open: null, close: null, isClosed: true },
  tuesday: { day: 'Selasa', open: '13:00', close: '18:00', isClosed: false },
  wednesday: { day: 'Rabu', open: '13:00', close: '18:00', isClosed: false },
  thursday: { day: 'Kamis', open: '13:00', close: '18:00', isClosed: false },
  friday: { day: 'Jumat', open: '13:00', close: '18:00', isClosed: false },
  saturday: { day: 'Sabtu', open: '10:00', close: '18:00', isClosed: false },
};

/** Display-ready weekly hours used by the footer. Keep in sync with `schedule`. */
export const openingHoursSummary = [
  { label: 'Sel - Jum', value: '13:00 – 18:00', isClosed: false },
  { label: 'Sab - Min', value: '10:00 – 18:00', isClosed: false },
  { label: 'Senin', value: 'Tutup', isClosed: true },
] as const;

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getWibDateParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WIB_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const weekdayLower = values.weekday ? values.weekday.toLowerCase() : '';
  const dayIndex = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(weekdayLower);

  return {
    dayIndex: dayIndex === -1 ? 0 : dayIndex,
    currentTime: Number(values.hour) * 60 + Number(values.minute),
  };
};

export const getTodayScheduleWIB = (date = new Date()): DaySchedule & { isOpenNow: boolean; displayText: string } => {
  const { dayIndex, currentTime } = getWibDateParts(date);
  const todaySchedule = schedule[WEEKDAYS[dayIndex]];
  const openTime = todaySchedule.open ? timeToMinutes(todaySchedule.open) : null;
  const closeTime = todaySchedule.close ? timeToMinutes(todaySchedule.close) : null;
  const isOpenNow = openTime !== null && closeTime !== null
    && currentTime >= openTime
    && currentTime < closeTime;

  if (isOpenNow) {
    return {
      ...todaySchedule,
      isOpenNow,
      displayText: `${todaySchedule.day.toUpperCase()}: ${todaySchedule.open} - ${todaySchedule.close}`,
    };
  }

  if (openTime !== null && currentTime < openTime) {
    return {
      ...todaySchedule,
      isOpenNow,
      displayText: `BUKA HARI INI: ${todaySchedule.open} - ${todaySchedule.close}`,
    };
  }

  for (let offset = 1; offset <= WEEKDAYS.length; offset += 1) {
    const nextDay = schedule[WEEKDAYS[(dayIndex + offset) % WEEKDAYS.length]];
    if (!nextDay.isClosed && nextDay.open) {
      return {
        ...todaySchedule,
        isOpenNow,
        displayText: `BUKA ${nextDay.day.toUpperCase()}: ${nextDay.open} - ${nextDay.close}`,
      };
    }
  }

  return { ...todaySchedule, isOpenNow, displayText: 'JADWAL BELUM TERSEDIA' };
};
