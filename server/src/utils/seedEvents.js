import Event from "../models/event.models.js";

// Sample events data for the ticket reservation system
const sampleEvents = [
    {
        name: "AR Rahman Live Concert",
        description: "Experience the magic of AR Rahman live! Join us for an unforgettable evening of soulful melodies and breathtaking performances featuring his greatest hits from Bollywood and beyond.",
        date: new Date("2024-03-15T19:00:00"),
        venue: "JLN Stadium, New Delhi",
        totalSeats: 500,
        availableSeats: 500,
        price: 1500,
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
        category: "Concert",
    },
    {
        name: "IPL Final 2024",
        description: "The ultimate cricket showdown! Watch the two best teams battle it out for the IPL trophy in the grand finale. An electrifying atmosphere guaranteed!",
        date: new Date("2024-05-26T19:30:00"),
        venue: "Narendra Modi Stadium, Ahmedabad",
        totalSeats: 1000,
        availableSeats: 1000,
        price: 2500,
        imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
        category: "Sports",
    },
    {
        name: "TechConf India 2024",
        description: "India's largest technology conference featuring talks from industry leaders, workshops on cutting-edge technologies, and networking opportunities with top tech professionals.",
        date: new Date("2024-04-20T09:00:00"),
        venue: "Bangalore International Exhibition Centre",
        totalSeats: 300,
        availableSeats: 300,
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        category: "Conference",
    },
    {
        name: "Hamlet - A Royal Shakespeare Production",
        description: "The timeless tragedy of Prince Hamlet brought to life by award-winning actors. A must-see theatrical experience that will leave you spellbound.",
        date: new Date("2024-03-28T18:00:00"),
        venue: "National Centre for Performing Arts, Mumbai",
        totalSeats: 200,
        availableSeats: 200,
        price: 800,
        imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
        category: "Theater",
    },
    {
        name: "Sunburn Festival 2024",
        description: "Asia's biggest electronic dance music festival is back! Three days of non-stop music featuring international DJs, stunning visuals, and an incredible party atmosphere.",
        date: new Date("2024-12-28T16:00:00"),
        venue: "Vagator Beach, Goa",
        totalSeats: 5000,
        availableSeats: 5000,
        price: 3500,
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        category: "Festival",
    },
    {
        name: "Stand-up Comedy Night with Zakir Khan",
        description: "Get ready to laugh till your stomach hurts! Zakir Khan brings his hilarious observations and witty storytelling in this exclusive comedy show.",
        date: new Date("2024-02-14T20:00:00"),
        venue: "The Comedy Store, Delhi",
        totalSeats: 150,
        availableSeats: 150,
        price: 600,
        imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
        category: "Other",
    },
    {
        name: "Pro Kabaddi League Final",
        description: "Witness the thrilling finale of Pro Kabaddi League! Fast-paced action, incredible athleticism, and nail-biting moments guaranteed.",
        date: new Date("2024-03-02T19:00:00"),
        venue: "Gachibowli Indoor Stadium, Hyderabad",
        totalSeats: 400,
        availableSeats: 400,
        price: 450,
        imageUrl: "https://images.unsplash.com/photo-1461896836934- voices?w=800",
        category: "Sports",
    },
    {
        name: "Coldplay World Tour - Mumbai",
        description: "Coldplay brings their spectacular Music of the Spheres World Tour to Mumbai! A night of stunning visuals, beloved hits, and unforgettable memories.",
        date: new Date("2024-06-15T18:00:00"),
        venue: "DY Patil Stadium, Mumbai",
        totalSeats: 800,
        availableSeats: 800,
        price: 5000,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        category: "Concert",
    },
];

// Seed events to database
export const seedEvents = async () => {
    try {
        // Check if events already exist
        const count = await Event.countDocuments();

        if (count > 0) {
            console.log(`📦 Events already seeded (${count} events exist)`);
            return;
        }

        // Insert sample events
        await Event.insertMany(sampleEvents);
        console.log("✅ Sample events seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding events:", error.message);
    }
};

export default sampleEvents;
