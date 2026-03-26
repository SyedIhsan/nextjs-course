export interface Event {
  id: string;
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "ReactConf 2026",
    image: "/images/event1.png",
    slug: "reactconf-2026",
    location: "Las Vegas, USA",
    date: "May 15-16, 2026",
    time: "9:00 AM",
  },
  {
    id: "2",
    title: "NextJS Weekly Meetup",
    image: "/images/event2.png",
    slug: "nextjs-weekly-meetup",
    location: "San Francisco, USA",
    date: "April 2, 2026",
    time: "6:00 PM",
  },
  {
    id: "3",
    title: "TypeScript Summit 2026",
    image: "/images/event3.png",
    slug: "typescript-summit-2026",
    location: "Berlin, Germany",
    date: "June 10-12, 2026",
    time: "8:00 AM",
  },
  {
    id: "4",
    title: "DevFest Global 2026",
    image: "/images/event4.png",
    slug: "devfest-global-2026",
    location: "Multiple Cities",
    date: "August 1-31, 2026",
    time: "9:00 AM",
  },
  {
    id: "5",
    title: "Web3 Developers Hackathon",
    image: "/images/event5.png",
    slug: "web3-hackathon",
    location: "NYC, USA",
    date: "July 20-22, 2026",
    time: "10:00 AM",
  },
  {
    id: "6",
    title: "JavaScript Conference EU 2026",
    image: "/images/event6.png",
    slug: "jsconf-eu-2026",
    location: "Graz, Austria",
    date: "September 15-17, 2026",
    time: "9:00 AM",
  },
];
