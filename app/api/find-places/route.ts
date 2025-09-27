import { type NextRequest, NextResponse } from "next/server"

// Comprehensive database of Australian places categorized by mood
const australianPlaces = {
  celebration: [
    {
      name: "Quay Restaurant, Sydney",
      type: "Fine Dining",
      reason: "Award-winning restaurant with stunning harbour views - perfect for special celebrations!",
      location: "Sydney, NSW",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Quay+Restaurant+Sydney+Australia",
    },
    {
      name: "Crown Casino, Melbourne",
      type: "Entertainment",
      reason: "Vibrant atmosphere with dining, shows, and excitement - great for birthday celebrations!",
      location: "Melbourne, VIC",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Crown+Casino+Melbourne+Australia",
    },
    {
      name: "Bondi Beach, Sydney",
      type: "Beach",
      reason: "Iconic beach perfect for celebrating with friends, beach parties, and good vibes!",
      location: "Sydney, NSW",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Bondi+Beach+Sydney+Australia",
    },
  ],
  peaceful: [
    {
      name: "Royal Botanic Gardens, Melbourne",
      type: "Gardens",
      reason: "Tranquil oasis in the city with beautiful landscapes - perfect for finding inner peace.",
      location: "Melbourne, VIC",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Royal+Botanic+Gardens+Melbourne+Australia",
    },
    {
      name: "Blue Mountains, NSW",
      type: "Nature",
      reason: "Serene mountain views and fresh air - ideal for clearing your mind and reducing stress.",
      location: "NSW",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Blue+Mountains+NSW+Australia",
    },
    {
      name: "Cradle Mountain-Lake St Clair, Tasmania",
      type: "National Park",
      reason: "Pristine wilderness and peaceful lakes - perfect for meditation and reconnecting with nature.",
      location: "Tasmania",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Cradle+Mountain+Lake+St+Clair+Tasmania+Australia",
    },
  ],
  adventure: [
    {
      name: "Great Ocean Road, Victoria",
      type: "Scenic Drive",
      reason: "Epic coastal drive with stunning views and adventure stops - perfect for thrill-seekers!",
      location: "Victoria",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Great+Ocean+Road+Victoria+Australia",
    },
    {
      name: "Uluru, Northern Territory",
      type: "Landmark",
      reason: "Iconic monolith offering hiking, cultural experiences, and breathtaking sunrises!",
      location: "Northern Territory",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Uluru+Northern+Territory+Australia",
    },
    {
      name: "Whitsunday Islands, Queensland",
      type: "Islands",
      reason: "Paradise islands with sailing, snorkeling, and tropical adventures!",
      location: "Queensland",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Whitsunday+Islands+Queensland+Australia",
    },
  ],
  romantic: [
    {
      name: "Sydney Harbour Bridge, Sydney",
      type: "Landmark",
      reason: "Romantic harbour views and sunset walks - perfect for date nights and proposals!",
      location: "Sydney, NSW",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Sydney+Harbour+Bridge+Australia",
    },
    {
      name: "Yarra Valley, Victoria",
      type: "Wine Region",
      reason: "Beautiful vineyards and wine tastings - ideal for romantic getaways and intimate dinners.",
      location: "Victoria",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Yarra+Valley+Victoria+Australia",
    },
    {
      name: "Cable Beach, Broome",
      type: "Beach",
      reason: "Stunning sunsets over the Indian Ocean - one of the most romantic beaches in Australia!",
      location: "Western Australia",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Cable+Beach+Broome+Australia",
    },
  ],
  energetic: [
    {
      name: "Federation Square, Melbourne",
      type: "Cultural Hub",
      reason: "Buzzing with events, street performers, and energy - perfect for active exploration!",
      location: "Melbourne, VIC",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Federation+Square+Melbourne+Australia",
    },
    {
      name: "Surfers Paradise, Gold Coast",
      type: "Beach Town",
      reason: "High-energy beach town with surfing, nightlife, and endless activities!",
      location: "Queensland",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Surfers+Paradise+Gold+Coast+Australia",
    },
    {
      name: "Sydney Opera House, Sydney",
      type: "Cultural Venue",
      reason: "Iconic venue with world-class performances and vibrant cultural energy!",
      location: "Sydney, NSW",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Sydney+Opera+House+Australia",
    },
  ],
}

function analyzeMood(mood: string): string[] {
  const moodLower = mood.toLowerCase()
  const categories: string[] = []

  // Celebration keywords
  if (
    moodLower.includes("birthday") ||
    moodLower.includes("celebrat") ||
    moodLower.includes("party") ||
    moodLower.includes("happy") ||
    moodLower.includes("excited") ||
    moodLower.includes("joy")
  ) {
    categories.push("celebration")
  }

  // Peaceful keywords
  if (
    moodLower.includes("stress") ||
    moodLower.includes("peace") ||
    moodLower.includes("calm") ||
    moodLower.includes("quiet") ||
    moodLower.includes("relax") ||
    moodLower.includes("meditat")
  ) {
    categories.push("peaceful")
  }

  // Adventure keywords
  if (
    moodLower.includes("adventure") ||
    moodLower.includes("excit") ||
    moodLower.includes("thrill") ||
    moodLower.includes("explore") ||
    moodLower.includes("active") ||
    moodLower.includes("hik")
  ) {
    categories.push("adventure")
  }

  // Romantic keywords
  if (
    moodLower.includes("romantic") ||
    moodLower.includes("date") ||
    moodLower.includes("love") ||
    moodLower.includes("intimate") ||
    moodLower.includes("couple")
  ) {
    categories.push("romantic")
  }

  // Energetic keywords
  if (
    moodLower.includes("energetic") ||
    moodLower.includes("active") ||
    moodLower.includes("buzz") ||
    moodLower.includes("lively") ||
    moodLower.includes("vibrant")
  ) {
    categories.push("energetic")
  }

  // Default to celebration if no specific mood detected
  if (categories.length === 0) {
    categories.push("celebration")
  }

  return categories
}

export async function POST(request: NextRequest) {
  try {
    const { mood } = await request.json()

    if (!mood || typeof mood !== "string") {
      return NextResponse.json({ error: "Mood description is required" }, { status: 400 })
    }

    const moodCategories = analyzeMood(mood)
    const suggestions: any[] = []

    // Get suggestions from each relevant category
    moodCategories.forEach((category) => {
      const places = australianPlaces[category as keyof typeof australianPlaces]
      if (places) {
        suggestions.push(...places)
      }
    })

    // Remove duplicates and limit to 5 suggestions
    const uniqueSuggestions = suggestions
      .filter((place, index, self) => index === self.findIndex((p) => p.name === place.name))
      .slice(0, 5)

    return NextResponse.json({
      suggestions: uniqueSuggestions,
      analyzedMood: moodCategories,
    })
  } catch (error) {
    console.error("Error processing mood:", error)
    return NextResponse.json({ error: "Failed to process mood" }, { status: 500 })
  }
}
