export const LINK_CLICKED = 'link.clicked';

export interface LinkClickedEvent {
  linkId: string;
  referrer?: string;
  userAgent?: string;
}
