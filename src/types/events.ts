export interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  eventDate: Date | string;
  location: string;
  locationUrl: string | null;
  flyerImage: string | null;
  capacity: number | null;
  ticketPrice: string | null;
  currency: string;
  status: string;
  collectInstagram: boolean;
  collectPhone: boolean;
  allowPlusOnes: boolean;
  showGuestList: boolean;
  rsvpCount: number;
}

export interface RSVPData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  status: string;
  plusOnes: number;
  plusOneNames: string | null;
  referralSource: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt: Date | string | null;
  createdAt: Date | string;
}
