export type DaySchedule = {
  day: string;
  open: string | null;
  close: string | null;
  isClosed: boolean;
};

// TODO(company): Confirm regular hours, holiday closures, booking-only exceptions, and timezone before launch. See CONCEPT_HANDOFF.md.
export const schedule: Record<string, DaySchedule> = {
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

export const getTodayScheduleWIB = (): DaySchedule & { isOpenNow: boolean; displayText: string } => {
  // Get current day in WIB timezone (Asia/Jakarta)
  const dateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  const dateWIB = new Date(dateStr);
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayIndex = dateWIB.getDay();
  const dayName = days[currentDayIndex];
  
  const todaySchedule = schedule[dayName];
  
  let isOpenNow = false;
  const currentHour = dateWIB.getHours();
  const currentMinute = dateWIB.getMinutes();
  const currentTime = currentHour + currentMinute / 60;
  
  if (!todaySchedule.isClosed && todaySchedule.open && todaySchedule.close) {
    const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
    const openTime = openHour + openMinute / 60;
    
    const [closeHour, closeMinute] = todaySchedule.close.split(':').map(Number);
    const closeTime = closeHour + closeMinute / 60;
    
    if (currentTime >= openTime && currentTime < closeTime) {
      isOpenNow = true;
    }
  }
  
  let displayText = '';

  if (isOpenNow) {
    displayText = `${todaySchedule.day.toUpperCase()}: ${todaySchedule.open} - ${todaySchedule.close}`;
  } else {
    // Check if it will open later today
    if (!todaySchedule.isClosed && todaySchedule.open) {
      const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
      const openTime = openHour + openMinute / 60;
      if (currentTime < openTime) {
        displayText = `BUKA HARI INI: ${todaySchedule.open}`;
      }
    }
    
    // If not opening today, find the next day it is open
    if (!displayText) {
      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const nextDaySchedule = schedule[days[nextDayIndex]];
        if (!nextDaySchedule.isClosed && nextDaySchedule.open) {
          displayText = `BUKA ${nextDaySchedule.day.toUpperCase()}: ${nextDaySchedule.open}`;
          break;
        }
      }
    }
  }
  
  return { ...todaySchedule, isOpenNow, displayText };
};
