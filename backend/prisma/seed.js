import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const main = async () => {
    console.log("Cleaning up database...");
    await prisma.watchlistItem.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();

    console.log("Seeding users...");
    const commonPassword = await hashPassword("password123");

    const users = [
        { name: "Admin User", email: "admin@example.com", password: commonPassword, role: "ADMIN" },
        { name: "Staff Member", email: "staff@example.com", password: commonPassword, role: "ADMIN" },
        { name: "John Doe", email: "john@example.com", password: commonPassword, role: "USER" },
        { name: "Jane Smith", email: "jane@example.com", password: commonPassword, role: "USER" },
        { name: "Movie Buff", email: "buff@example.com", password: commonPassword, role: "USER" },
        { name: "Cinephile 42", email: "cine@example.com", password: commonPassword, role: "USER" },
        { name: "Carlos Coder", email: "carlos@example.com", password: commonPassword, role: "USER" },
    ];

    const createdUsers = [];
    for (const u of users) {
        const user = await prisma.user.create({ data: u });
        createdUsers.push(user);
        console.log(`Created user: ${u.email} (${u.role})`);
    }

    const adminId = createdUsers[0].id;
    const staffId = createdUsers[1].id;
    const userId1 = createdUsers[2].id;
    const userId2 = createdUsers[3].id;

    console.log("Seeding movies...");
    const movieData = [
        {
            title: "The Matrix",
            overview: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
            releaseYear: 1999,
            genres: ["Action", "Sci-Fi"],
            runtime: 136,
            posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80",
            createdBy: adminId,
        },
        {
            title: "Inception",
            overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            releaseYear: 2010,
            genres: ["Action", "Sci-Fi", "Adventure"],
            runtime: 148,
            posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
            createdBy: adminId,
        },
        {
            title: "Pulp Fiction",
            overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            releaseYear: 1994,
            genres: ["Crime", "Drama"],
            runtime: 154,
            posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&q=80",
            createdBy: staffId,
        },
        {
            title: "The Shawshank Redemption",
            overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            releaseYear: 1994,
            genres: ["Drama"],
            runtime: 142,
            posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
            createdBy: adminId,
        },
        {
            title: "Interstellar",
            overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            releaseYear: 2014,
            genres: ["Adventure", "Drama", "Sci-Fi"],
            runtime: 169,
            posterUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80",
            createdBy: userId1,
        },
        {
            title: "The Dark Knight",
            overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            releaseYear: 2008,
            genres: ["Action", "Crime", "Drama"],
            runtime: 152,
            posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
            createdBy: staffId,
        },
        {
            title: "The Godfather",
            overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            releaseYear: 1972,
            genres: ["Crime", "Drama"],
            runtime: 175,
            posterUrl: "https://images.unsplash.com/photo-1598899139501-92e1050e0591?w=600&q=80",
            createdBy: adminId,
        },
        {
            title: "Spirited Away",
            overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
            releaseYear: 2001,
            genres: ["Animation", "Adventure", "Family"],
            runtime: 125,
            posterUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&q=80",
            createdBy: staffId,
        },
        {
            title: "The Grand Budapest Hotel",
            overview: "A writer encounters the owner of a decaying high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
            releaseYear: 2014,
            genres: ["Adventure", "Comedy", "Crime"],
            runtime: 99,
            posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
            createdBy: userId2,
        },
        {
            title: "Parasite",
            overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
            releaseYear: 2019,
            genres: ["Drama", "Thriller", "Comedy"],
            runtime: 132,
            posterUrl: "https://images.unsplash.com/photo-1533928123233-ca5464d509cd?w=600&q=80",
            createdBy: adminId,
        },
        {
            title: "Spider-Man: Across the Spider-Verse",
            overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
            releaseYear: 2023,
            genres: ["Animation", "Action", "Adventure"],
            runtime: 140,
            posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&q=80",
            createdBy: userId1,
        },
        {
            title: "Blade Runner 2049",
            overview: "A young Blade Runner's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
            releaseYear: 2017,
            genres: ["Action", "Sci-Fi", "Drama"],
            runtime: 164,
            posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
            createdBy: staffId,
        },
        {
            title: "Mad Max: Fury Road",
            overview: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the help of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
            releaseYear: 2015,
            genres: ["Action", "Adventure", "Sci-Fi"],
            runtime: 120,
            posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80",
            createdBy: adminId,
        },
        {
            title: "Joker",
            overview: "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.",
            releaseYear: 2019,
            genres: ["Crime", "Drama", "Thriller"],
            runtime: 122,
            posterUrl: "https://images.unsplash.com/photo-1559583109-3e7968136c29?w=600&q=80",
            createdBy: staffId,
        },
        {
            title: "Arrival",
            overview: "A linguist works with the military to communicate with alien lifecrafts that have landed around the world.",
            releaseYear: 2016,
            genres: ["Drama", "Sci-Fi", "Mystery"],
            runtime: 116,
            posterUrl: "https://images.unsplash.com/photo-1475139441338-693e7dbe20b6?w=600&q=80",
            createdBy: userId2,
        },
        {
            title: "The Prestige",
            overview: "After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
            releaseYear: 2006,
            genres: ["Drama", "Mystery", "Sci-Fi"],
            runtime: 130,
            posterUrl: "https://images.unsplash.com/photo-1533928123233-ca5464d509cd?w=600&q=80",
            createdBy: userId1,
        },
        {
            title: "Coco",
            overview: "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
            releaseYear: 2017,
            genres: ["Animation", "Adventure", "Family"],
            runtime: 105,
            posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
            createdBy: staffId,
        },
        {
            title: "Whiplash",
            overview: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
            releaseYear: 2014,
            genres: ["Drama", "Music"],
            runtime: 106,
            posterUrl: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=600&q=80",
            createdBy: adminId,
        },
        {
            title: "Django Unchained",
            overview: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.",
            releaseYear: 2012,
            genres: ["Drama", "Western"],
            runtime: 165,
            posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
            createdBy: staffId,
        },
        {
            title: "The Wolf of Wall Street",
            overview: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
            releaseYear: 2013,
            genres: ["Biography", "Comedy", "Crime"],
            runtime: 180,
            posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&q=80",
            createdBy: userId2,
        }
    ];

    const createdMovies = [];
    for (const m of movieData) {
        const movie = await prisma.movie.create({ data: m });
        createdMovies.push(movie);
        console.log(`Created movie: ${m.title}`);
    }

    console.log("Seeding watchlist items...");
    const watchlistData = [
        { userId: userId1, movieId: createdMovies[0].id, status: "WATCHING", rating: 9, notes: "Amazing visuals!" },
        { userId: userId1, movieId: createdMovies[1].id, status: "COMPLETED", rating: 10, notes: "Masterpiece." },
        { userId: userId1, movieId: createdMovies[2].id, status: "PLANNED" },
        { userId: userId2, movieId: createdMovies[0].id, status: "PLANNED" },
        { userId: userId2, movieId: createdMovies[3].id, status: "WATCHING", rating: 8 },
        { userId: adminId, movieId: createdMovies[4].id, status: "COMPLETED", rating: 9 },
        { userId: staffId, movieId: createdMovies[5].id, status: "COMPLETED", rating: 10 },
        { userId: createdUsers[4].id, movieId: createdMovies[6].id, status: "WATCHING" },
    ];

    for (const w of watchlistData) {
        await prisma.watchlistItem.create({ data: w });
    }

    console.log("Seeding completed successfully!");
};

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });