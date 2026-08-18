export interface AdminBookingRow {
  ticketId: string;
  itemId: string;
  title: string;
  meta: string;
  price: string;
  qty: number;
  purchasedAt: string;
  ownerEmail: string;
}

export interface AdminMembershipRow {
  tierId: string;
  tierName: string;
  price: string;
  period: string;
  memberNumber: string;
  joinedAt: string;
  ownerEmail: string;
}
