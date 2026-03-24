export interface SubscriptionTemplate {
  name: string;
  provider: string;
  icon: string;
  color: string;
  category: "entertainment" | "music" | "cloud" | "fitness" | "food" | "transport" | "productivity" | "gaming" | "education" | "telecom" | "other";
  defaultAmount?: number;
  defaultFrequency?: string;
}

export const subscriptionTemplates: SubscriptionTemplate[] = [
  // ── Entertainment & Streaming ──
  { name: "Netflix", provider: "Netflix Inc.", icon: "🎬", color: "#E50914", category: "entertainment", defaultAmount: 70, defaultFrequency: "monthly" },
  { name: "Amazon Prime", provider: "Amazon", icon: "📦", color: "#FF9900", category: "entertainment", defaultAmount: 50, defaultFrequency: "monthly" },
  { name: "Disney+", provider: "Disney", icon: "🏰", color: "#113CCF", category: "entertainment", defaultAmount: 50, defaultFrequency: "monthly" },
  { name: "HBO Max", provider: "Warner Bros.", icon: "🎭", color: "#5822B4", category: "entertainment", defaultAmount: 60, defaultFrequency: "monthly" },
  { name: "Apple TV+", provider: "Apple", icon: "🍎", color: "#000000", category: "entertainment", defaultAmount: 50, defaultFrequency: "monthly" },
  { name: "YouTube Premium", provider: "Google", icon: "▶️", color: "#FF0000", category: "entertainment", defaultAmount: 60, defaultFrequency: "monthly" },
  { name: "Shahid VIP", provider: "MBC Group", icon: "📺", color: "#00B140", category: "entertainment", defaultAmount: 35, defaultFrequency: "monthly" },

  // ── Music ──
  { name: "Spotify", provider: "Spotify AB", icon: "🎵", color: "#1DB954", category: "music", defaultAmount: 50, defaultFrequency: "monthly" },
  { name: "Apple Music", provider: "Apple", icon: "🎶", color: "#FC3C44", category: "music", defaultAmount: 50, defaultFrequency: "monthly" },
  { name: "Deezer", provider: "Deezer SA", icon: "🎧", color: "#A238FF", category: "music", defaultAmount: 40, defaultFrequency: "monthly" },
  { name: "Anghami", provider: "Anghami", icon: "🎤", color: "#6C3AE1", category: "music", defaultAmount: 30, defaultFrequency: "monthly" },

  // ── Cloud & Storage ──
  { name: "iCloud+", provider: "Apple", icon: "☁️", color: "#3693F3", category: "cloud", defaultAmount: 10, defaultFrequency: "monthly" },
  { name: "Google One", provider: "Google", icon: "🔵", color: "#4285F4", category: "cloud", defaultAmount: 20, defaultFrequency: "monthly" },
  { name: "Dropbox", provider: "Dropbox Inc.", icon: "📁", color: "#0061FF", category: "cloud", defaultAmount: 100, defaultFrequency: "monthly" },
  { name: "Microsoft 365", provider: "Microsoft", icon: "💼", color: "#D83B01", category: "productivity", defaultAmount: 70, defaultFrequency: "monthly" },

  // ── Fitness ──
  { name: "Gym Membership", provider: "", icon: "🏋️", color: "#FF6B35", category: "fitness" },
  { name: "Strava", provider: "Strava Inc.", icon: "🚴", color: "#FC4C02", category: "fitness", defaultAmount: 50, defaultFrequency: "monthly" },

  // ── Food & Delivery ──
  { name: "Glovo", provider: "Glovo", icon: "🛵", color: "#FFC244", category: "food" },
  { name: "Jumia Food", provider: "Jumia", icon: "🍔", color: "#F68B1E", category: "food" },

  // ── Transport ──
  { name: "InDrive", provider: "InDrive", icon: "🚗", color: "#2ADB68", category: "transport" },
  { name: "Careem", provider: "Careem", icon: "🚕", color: "#49C361", category: "transport" },

  // ── Gaming ──
  { name: "PlayStation Plus", provider: "Sony", icon: "🎮", color: "#003791", category: "gaming", defaultAmount: 50, defaultFrequency: "monthly" },
  { name: "Xbox Game Pass", provider: "Microsoft", icon: "🕹️", color: "#107C10", category: "gaming", defaultAmount: 50, defaultFrequency: "monthly" },
  { name: "Nintendo Online", provider: "Nintendo", icon: "🎯", color: "#E60012", category: "gaming", defaultAmount: 40, defaultFrequency: "yearly" },

  // ── Education ──
  { name: "Coursera Plus", provider: "Coursera", icon: "📚", color: "#0056D2", category: "education", defaultAmount: 400, defaultFrequency: "monthly" },
  { name: "Udemy", provider: "Udemy", icon: "🎓", color: "#A435F0", category: "education" },
  { name: "Duolingo Plus", provider: "Duolingo", icon: "🦉", color: "#58CC02", category: "education", defaultAmount: 70, defaultFrequency: "monthly" },

  // ── Telecom (Morocco) ──
  { name: "Maroc Telecom", provider: "IAM", icon: "📱", color: "#004B93", category: "telecom" },
  { name: "Orange Maroc", provider: "Orange", icon: "📶", color: "#FF6600", category: "telecom" },
  { name: "inwi", provider: "inwi", icon: "📡", color: "#6F2DA8", category: "telecom" },

  // ── Productivity ──
  { name: "ChatGPT Plus", provider: "OpenAI", icon: "🤖", color: "#10A37F", category: "productivity", defaultAmount: 200, defaultFrequency: "monthly" },
  { name: "Claude Pro", provider: "Anthropic", icon: "🧠", color: "#D4A574", category: "productivity", defaultAmount: 200, defaultFrequency: "monthly" },
  { name: "Notion", provider: "Notion Labs", icon: "📝", color: "#000000", category: "productivity", defaultAmount: 80, defaultFrequency: "monthly" },
  { name: "Canva Pro", provider: "Canva", icon: "🎨", color: "#00C4CC", category: "productivity", defaultAmount: 100, defaultFrequency: "monthly" },
  { name: "Adobe Creative Cloud", provider: "Adobe", icon: "🅰️", color: "#FF0000", category: "productivity", defaultAmount: 500, defaultFrequency: "monthly" },
  { name: "Figma", provider: "Figma Inc.", icon: "🖌️", color: "#F24E1E", category: "productivity", defaultAmount: 120, defaultFrequency: "monthly" },
  { name: "GitHub Pro", provider: "GitHub", icon: "🐙", color: "#181717", category: "productivity", defaultAmount: 40, defaultFrequency: "monthly" },
  { name: "Vercel Pro", provider: "Vercel", icon: "▲", color: "#000000", category: "productivity", defaultAmount: 200, defaultFrequency: "monthly" },
];

export const templateCategories = [
  { key: "entertainment", label: "Entertainment", icon: "🎬" },
  { key: "music", label: "Music", icon: "🎵" },
  { key: "cloud", label: "Cloud & Storage", icon: "☁️" },
  { key: "productivity", label: "Productivity", icon: "💼" },
  { key: "fitness", label: "Fitness", icon: "🏋️" },
  { key: "food", label: "Food & Delivery", icon: "🍔" },
  { key: "transport", label: "Transport", icon: "🚗" },
  { key: "gaming", label: "Gaming", icon: "🎮" },
  { key: "education", label: "Education", icon: "📚" },
  { key: "telecom", label: "Telecom", icon: "📱" },
  { key: "other", label: "Other", icon: "📦" },
] as const;
