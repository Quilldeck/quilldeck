// Quilldeck — Genre constants
// Two-step picker: user selects a top-level Category, then a Subgenre within it.

export const GENRE_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Poetry',
  'Afroeurofantasy',
  'Afrofuturism',
] as const;

export type GenreCategory = typeof GENRE_CATEGORIES[number];

export const SUBGENRES: Record<GenreCategory, readonly string[]> = {
  Fiction: [
    'Fantasy', 'Epic Fantasy', 'Dark Fantasy', 'Urban Fantasy', 'Sword & Sorcery',
    'Fairy Tale Retelling', 'Mythology & Folklore Retelling', 'Romantasy',
    'Science Fiction', 'Space Opera', 'Cyberpunk', 'Solarpunk', 'Dystopian',
    'Post-Apocalyptic', 'Climate Fiction (Cli-Fi)', 'Time Travel', 'Crypto / Web3 Fiction',
    'Slipstream', 'Romance', 'Contemporary Romance', 'Paranormal Romance',
    'Romantic Suspense', 'Historical Romance', 'Dark Romance', 'Mystery / Thriller',
    'Cozy Mystery', 'Psychological Thriller', 'Crime / Detective', 'Legal Thriller',
    'Horror', 'Supernatural Horror', 'Grimdark', 'Literary Fiction', 'Historical Fiction',
    "Women's Fiction", 'Adventure', 'War Fiction', 'Western', 'Satire', 'Steampunk',
    'LitRPG / GameLit', 'Young Adult', 'New Adult', 'Middle Grade', "Children's Fiction",
    'Short Story Collection', 'Anthology', 'Erotica',
  ],
  'Non-Fiction': [
    'Memoir', 'Biography / Autobiography', 'Self-Help', 'Personal Development',
    'Business', 'Entrepreneurship', 'Finance / Investing', 'Crypto / Blockchain',
    'AI & Technology', 'Health & Wellness', 'Fitness & Nutrition', 'Psychology',
    'True Crime', 'History', 'Politics & Current Affairs', 'Religion & Spirituality',
    'Philosophy', 'Science & Technology', 'Travel', 'Essays', 'Journalism / Long-Form',
    'Parenting & Family', 'Education / Academic', 'How-To / Reference', 'Cookbook',
    'Art & Design',
  ],
  Poetry: [
    'Narrative Poetry', 'Free Verse', 'Spoken Word', 'Sonnet Collection',
    'Contemporary Poetry', 'Devotional Poetry',
  ],
  Afroeurofantasy: ['Afroeurofantasy Fiction'],
  Afrofuturism: ['Afrofuturism'],
};

export const ALL_GENRES: string[] = Object.values(SUBGENRES).flat();