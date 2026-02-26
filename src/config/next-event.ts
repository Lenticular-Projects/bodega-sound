export interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  eventDate: Date;
  time: string;
  location: string;
  description: string;
  capacity: string;
  imageUrl: string;
  ticketUrl: string;
  isActive: boolean;
  showCountdown: boolean;
}

export const upcomingEvent: UpcomingEvent = {
  id: "contrabanda-v",
  name: "CONTRABANDA V",
  date: "June 21, 2025",
  eventDate: new Date("2025-06-21T22:00:00+08:00"),
  time: "10:00 PM - 6:00 AM",
  location: "Secret Location • Poblacion, Makati",
  description:
    "Our summer solstice celebration. 8 hours of house, techno, and open-format selections. Featuring international headliners and Manila's finest selectors.",
  capacity: "Limited Capacity • 500 Tickets",
  imageUrl: "/images/party-photos/optimized/DSC00070.webp",
  ticketUrl: "#tickets",
  isActive: true,
  showCountdown: false, // FLIP TO true WHEN EVENT IS CONFIRMED AND LIVE
};
