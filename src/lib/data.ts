export type EventCategory = 'sports' | 'college' | 'entertainment' | 'circus' | 'theater' | 'music' | 'other';

export type EventStatus = 'pending' | 'approved' | 'rejected';

export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  location: {
    city: string;
    venue: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contactDetails: {
    phone?: string;
    email: string;
  };
  totalOccupancy: number;
  registeredCount: number;
  bookingOpeningDate: string; // ISO date string
  eventDate: string; // ISO date string
  eventTime: string; // Time string (e.g., "19:00")
  likes: number;
  rating: number; // Average star rating (1-5)
  description: string;
  shortDescription: string;
  organizer: string;
  tags: string[];
  imageUrl: string;
  status: EventStatus;
  submittedDate: string;
  approvedDate?: string;
  rejectedReason?: string;
}

export const events: Event[] = [
  {
    id: "1",
    name: "Annual College Basketball Tournament",
    category: "sports",
    location: {
      city: "Boston",
      venue: "University Sports Arena",
      coordinates: {
        lat: 42.350,
        lng: -71.105,
      },
    },
    contactDetails: {
      phone: "+1 (555) 123-4567",
      email: "sports@university.edu",
    },
    totalOccupancy: 2000,
    registeredCount: 1500,
    bookingOpeningDate: "2023-05-15T00:00:00Z",
    eventDate: "2023-07-15T00:00:00Z",
    eventTime: "14:00",
    likes: 320,
    rating: 4.5,
    shortDescription: "The biggest college basketball tournament of the year featuring teams from across the state.",
    description: "Join us for the annual college basketball tournament where the best teams from universities across the state compete for the championship title. With thrilling matches, food stalls, and entertainment areas, this event is perfect for basketball enthusiasts and families alike. Don't miss the special halftime shows and chances to meet your favorite college athletes!",
    organizer: "Boston University Athletics",
    tags: ["Basketball", "Tournament", "College Sports", "Competition"],
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop",
    status: "approved",
    submittedDate: "2023-05-01T00:00:00Z",
    approvedDate: "2023-05-02T00:00:00Z",
  },
  {
    id: "2",
    name: "Cirque Mystique",
    category: "circus",
    location: {
      city: "Las Vegas",
      venue: "Desert Circus Tent",
      coordinates: {
        lat: 36.169,
        lng: -115.139,
      },
    },
    contactDetails: {
      phone: "+1 (555) 789-0123",
      email: "info@cirquemystique.com",
    },
    totalOccupancy: 1000,
    registeredCount: 950,
    bookingOpeningDate: "2023-04-20T00:00:00Z",
    eventDate: "2023-06-10T00:00:00Z",
    eventTime: "19:30",
    likes: 456,
    rating: 4.9,
    shortDescription: "A mesmerizing circus performance combining artistry, acrobatics, and mystery.",
    description: "Cirque Mystique brings you a breathtaking spectacle of human achievement and artistic expression. Our world-class performers will dazzle you with gravity-defying acrobatics, mystifying illusions, and heart-stopping stunts. The show combines traditional circus acts with modern theatrical elements to create an unforgettable experience for audiences of all ages. Prepare to be transported to a world of wonder and amazement!",
    organizer: "Entertainment Global Productions",
    tags: ["Circus", "Acrobatics", "Performance", "Arts", "Family"],
    imageUrl: "https://images.unsplash.com/photo-1572380301528-12f385290fb2?q=80&w=2069&auto=format&fit=crop",
    status: "approved",
    submittedDate: "2023-04-15T00:00:00Z",
    approvedDate: "2023-04-16T00:00:00Z",
  },
  {
    id: "3",
    name: "Tech Innovation Summit",
    category: "college",
    location: {
      city: "San Francisco",
      venue: "Tech Campus Auditorium",
      coordinates: {
        lat: 37.783,
        lng: -122.416,
      },
    },
    contactDetails: {
      email: "summit@techinstitute.edu",
    },
    totalOccupancy: 500,
    registeredCount: 320,
    bookingOpeningDate: "2023-05-01T00:00:00Z",
    eventDate: "2023-06-25T00:00:00Z",
    eventTime: "09:00",
    likes: 189,
    rating: 4.2,
    shortDescription: "A gathering of tech visionaries sharing insights on emerging technologies.",
    description: "The Tech Innovation Summit brings together industry leaders, researchers, and students to explore the latest advancements in technology. This day-long event features keynote speeches, panel discussions, and interactive workshops on artificial intelligence, blockchain, quantum computing, and more. Network with professionals and discover potential career opportunities in the rapidly evolving tech landscape. Perfect for students, faculty, and industry professionals interested in the future of technology.",
    organizer: "Tech Institute of Innovation",
    tags: ["Technology", "Conference", "Innovation", "Networking", "Education"],
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    status: "pending",
    submittedDate: "2023-05-20T00:00:00Z",
  },
  {
    id: "4",
    name: "Summer Music Festival",
    category: "music",
    location: {
      city: "Austin",
      venue: "Riverside Park",
      coordinates: {
        lat: 30.267,
        lng: -97.743,
      },
    },
    contactDetails: {
      phone: "+1 (555) 234-5678",
      email: "tickets@summerfest.com",
    },
    totalOccupancy: 5000,
    registeredCount: 3500,
    bookingOpeningDate: "2023-03-15T00:00:00Z",
    eventDate: "2023-07-01T00:00:00Z",
    eventTime: "16:00",
    likes: 720,
    rating: 4.7,
    shortDescription: "Three days of live music performances from top artists across multiple genres.",
    description: "Get ready for the biggest music event of the summer! Our annual festival features three days of non-stop music across five stages, with performances from chart-topping artists and emerging talents. Enjoy a diverse lineup spanning rock, pop, hip-hop, electronic, and indie genres. Beyond the music, explore food vendors offering cuisine from around the world, art installations, and interactive experiences throughout the festival grounds. Camp on-site to get the full festival experience!",
    organizer: "Melody Productions",
    tags: ["Music", "Festival", "Concert", "Outdoor", "Entertainment"],
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop",
    status: "approved",
    submittedDate: "2023-03-01T00:00:00Z",
    approvedDate: "2023-03-02T00:00:00Z",
  },
  {
    id: "5",
    name: "Shakespeare in the Park",
    category: "theater",
    location: {
      city: "New York",
      venue: "Central Park",
      coordinates: {
        lat: 40.782,
        lng: -73.965,
      },
    },
    contactDetails: {
      phone: "+1 (555) 987-6543",
      email: "tickets@classictheater.org",
    },
    totalOccupancy: 800,
    registeredCount: 600,
    bookingOpeningDate: "2023-05-10T00:00:00Z",
    eventDate: "2023-06-18T00:00:00Z",
    eventTime: "20:00",
    likes: 256,
    rating: 4.6,
    shortDescription: "An outdoor performance of Shakespeare's 'A Midsummer Night's Dream'.",
    description: "Experience the magic of Shakespeare under the stars with our annual open-air performance in Central Park. This year, we present a magical interpretation of 'A Midsummer Night's Dream,' complete with enchanting costumes, live music, and professional actors from the Classical Theater Company. Bring a blanket, pack a picnic, and enjoy one of literature's most beloved comedies in the beautiful setting of the park. Pre-show workshops on Shakespearean language and themes will be available for those interested.",
    organizer: "Classical Theater Company",
    tags: ["Theater", "Shakespeare", "Outdoor", "Arts", "Culture"],
    imageUrl: "https://images.unsplash.com/photo-1561310728-93765f0ea516?q=80&w=2070&auto=format&fit=crop",
    status: "approved",
    submittedDate: "2023-05-05T00:00:00Z",
    approvedDate: "2023-05-06T00:00:00Z",
  },
  {
    id: "6",
    name: "Comic Convention",
    category: "entertainment",
    location: {
      city: "San Diego",
      venue: "Convention Center",
      coordinates: {
        lat: 32.706,
        lng: -117.161,
      },
    },
    contactDetails: {
      phone: "+1 (555) 345-6789",
      email: "info@comiccon-sd.com",
    },
    totalOccupancy: 3000,
    registeredCount: 2800,
    bookingOpeningDate: "2023-02-01T00:00:00Z",
    eventDate: "2023-07-20T00:00:00Z",
    eventTime: "10:00",
    likes: 890,
    rating: 4.8,
    shortDescription: "The ultimate gathering for comic, movie, and pop culture enthusiasts.",
    description: "Calling all fans of comics, sci-fi, fantasy, and pop culture! Join us for the biggest comic convention in the region, featuring celebrity guest appearances, exclusive panels, sneak previews of upcoming releases, and a massive exhibition hall with vendors selling collectibles, artwork, and merchandise. Showcase your best cosplay in our costume contest, get autographs from your favorite creators, and connect with a community that shares your passions. Special activities for children make this a perfect family event.",
    organizer: "Comic Entertainment Group",
    tags: ["Comics", "Pop Culture", "Cosplay", "Entertainment", "Convention"],
    imageUrl: "https://images.unsplash.com/photo-1612036782180-6f0822045d55?q=80&w=2070&auto=format&fit=crop",
    status: "pending",
    submittedDate: "2023-01-25T00:00:00Z",
  },
  {
    id: "7",
    name: "College Hackathon",
    category: "college",
    location: {
      city: "Cambridge",
      venue: "Innovation Lab",
      coordinates: {
        lat: 42.377,
        lng: -71.116,
      },
    },
    contactDetails: {
      email: "hackathon@universitytech.edu",
    },
    totalOccupancy: 300,
    registeredCount: 250,
    bookingOpeningDate: "2023-04-25T00:00:00Z",
    eventDate: "2023-06-15T00:00:00Z",
    eventTime: "09:00",
    likes: 145,
    rating: 4.4,
    shortDescription: "A 48-hour coding competition for university students to build innovative solutions.",
    description: "Push the boundaries of technology and creativity at our annual 48-hour hackathon! Students from all disciplines are invited to form teams and develop innovative solutions addressing real-world challenges. Industry mentors will be available to provide guidance throughout the event. Substantial prizes await the most impressive projects, including internship opportunities, tech gadgets, and cash awards. All skill levels are welcome—what matters is your creativity and teamwork. Food, drinks, and energy boosters will be provided to keep you coding through the night!",
    organizer: "University Tech Department",
    tags: ["Hackathon", "Coding", "Technology", "Competition", "Innovation"],
    imageUrl: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=2070&auto=format&fit=crop",
    status: "approved",
    submittedDate: "2023-04-20T00:00:00Z",
    approvedDate: "2023-04-21T00:00:00Z",
  },
  {
    id: "8",
    name: "Marathon for Charity",
    category: "sports",
    location: {
      city: "Chicago",
      venue: "Lakefront Trail",
      coordinates: {
        lat: 41.879,
        lng: -87.623,
      },
    },
    contactDetails: {
      phone: "+1 (555) 456-7890",
      email: "run@charitymarathon.org",
    },
    totalOccupancy: 1500,
    registeredCount: 800,
    bookingOpeningDate: "2023-03-01T00:00:00Z",
    eventDate: "2023-06-05T00:00:00Z",
    eventTime: "07:00",
    likes: 310,
    rating: 4.3,
    shortDescription: "Run along the scenic lakefront to raise funds for local children's hospitals.",
    description: "Lace up your running shoes for a good cause! Our annual charity marathon takes participants on a beautiful route along the lakefront, with options for full marathon, half marathon, and 5K distances to accommodate runners of all levels. Every registration fee and additional donation goes directly to supporting children's hospitals in our community. Training programs, nutrition advice, and group practice runs are available in the months leading up to the event. Join us to make a difference with every step!",
    organizer: "Community Health Foundation",
    tags: ["Marathon", "Running", "Charity", "Fitness", "Fundraising"],
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop",
    status: "rejected",
    submittedDate: "2023-02-25T00:00:00Z",
    rejectedReason: "Missing required permits and documentation.",
  }
];

export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

export const getEventsByCategory = (category: EventCategory): Event[] => {
  return events.filter(event => event.category === category && event.status === 'approved');
};

export const getFeaturedEvents = (): Event[] => {
  return events.filter(event => event.status === 'approved').slice(0, 4);
};

export const getTrendingEvents = (): Event[] => {
  return [...events].filter(event => event.status === 'approved').sort((a, b) => b.likes - a.likes).slice(0, 4);
};

export const searchEvents = (query: string): Event[] => {
  const lowercaseQuery = query.toLowerCase();
  return events.filter(
    event => 
      event.status === 'approved' &&
      (event.name.toLowerCase().includes(lowercaseQuery) || 
      event.location.city.toLowerCase().includes(lowercaseQuery) || 
      event.category.toLowerCase().includes(lowercaseQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  );
};

export const getPendingEvents = (): Event[] => {
  return events.filter(event => event.status === 'pending');
};

export const getApprovedEvents = (): Event[] => {
  return events.filter(event => event.status === 'approved');
};

export const getRejectedEvents = (): Event[] => {
  return events.filter(event => event.status === 'rejected');
};

// Admin functions to update event status
export const approveEvent = (eventId: string): boolean => {
  const eventIndex = events.findIndex(event => event.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex].status = 'approved';
    events[eventIndex].approvedDate = new Date().toISOString();
    return true;
  }
  return false;
};

export const rejectEvent = (eventId: string, reason: string): boolean => {
  const eventIndex = events.findIndex(event => event.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex].status = 'rejected';
    events[eventIndex].rejectedReason = reason;
    return true;
  }
  return false;
};
