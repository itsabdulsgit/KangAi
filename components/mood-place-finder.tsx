import { Card } from "@/components/ui/card"

interface Suggestion {
  name: string
  type: string
  reason: string
  location: string
  mapUrl: string
}

interface MoodPlaceFinderProps {
  suggestions: Suggestion[]
}

export function MoodPlaceFinder({ suggestions }: MoodPlaceFinderProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-gochi text-center text-foreground mb-8">Perfect places for your mood! 🎯</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-6 bg-card border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-gochi text-foreground text-balance">{suggestion.name}</h3>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                  {suggestion.type}
                </span>
              </div>

              <p className="text-muted-foreground text-sm text-pretty">{suggestion.reason}</p>

              <div className="pt-2">
                <a
                  href={suggestion.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  📍 View on Google Maps
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
