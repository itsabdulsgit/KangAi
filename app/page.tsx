"use client"
import { useState } from "react"
import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, MapPin, Compass } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const exampleMoods = [
    "I'm celebrating my birthday!",
    "Feeling stressed, need peace",
    "Want adventure and excitement!",
    "Romantic date night vibes",
    "Need to clear my head",
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get("message") as string
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    e.currentTarget.reset()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I had trouble finding places for you. Please try again!",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendExampleMessage = async (exampleText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: exampleText,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Chat Messages */}
        <div className="space-y-4 mb-6 min-h-[400px]">
          {messages.length === 0 ? (
            <Card className="p-8 text-center bg-card border-2 border-border">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-gochi text-foreground mb-2">Ready to find your perfect place?</h3>
              <p className="text-muted-foreground">
                Describe your mood and I'll suggest real Australian locations with Google Maps links!
              </p>
            </Card>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                      <img src="/kang-avatar.gif" alt="Kang" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground mb-1 font-gochi">Kang</span>
                      <Card className="max-w-[80%] p-4 bg-card text-card-foreground border-2 border-border">
                        <div className="whitespace-pre-wrap">
                          {message.content.split(/\n/).map((line, lineIndex) => {
                            const urlMatch = line.match(/^(https:\/\/www\.google\.com\/maps[^\s]+)$/)
                            if (urlMatch) {
                              const url = urlMatch[1]
                              const prevLine = message.content.split(/\n/)[lineIndex - 1] || ""
                              const placeNameMatch = prevLine.match(/^\d+\.\s*([^—]+)/)
                              const placeName = placeNameMatch ? placeNameMatch[1].trim() : "View on Map"

                              return (
                                <div key={lineIndex} className="my-2">
                                  <button
                                    type="button"
                                    className="w-36 p-0 border-none rotate-[5deg] origin-center font-gochi text-sm cursor-pointer pb-[3px] rounded-md shadow-[0_2px_0_#494a4b] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] bg-[#5cdb95] hover:shadow-[0_4px_0_#494a4b] active:translate-y-[5px] active:pb-0 active:shadow-none"
                                    onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                                  >
                                    <span className="bg-[#f1f5f8] block py-2 px-4 rounded-md border-2 border-[#494a4b] flex items-center justify-center gap-2">
                                      <Compass className="w-4 h-4" />
                                      View Place
                                    </span>
                                  </button>
                                </div>
                              )
                            }
                            const nextLine = message.content.split(/\n/)[lineIndex + 1] || ""
                            const isPlaceNameLine =
                              line.match(/^\d+\.\s*[^—]+—/) && nextLine.match(/^https:\/\/www\.google\.com\/maps/)

                            if (isPlaceNameLine) {
                              const descriptionMatch = line.match(/^\d+\.\s*[^—]+—\s*(.+)$/)
                              const description = descriptionMatch ? descriptionMatch[1] : line
                              return (
                                <div key={lineIndex} className="mb-1">
                                  {line.replace(/^\d+\.\s*[^—]+—\s*/, `${line.match(/^\d+\./)?.[0] || ""} `)}
                                </div>
                              )
                            }

                            return <div key={lineIndex}>{line}</div>
                          })}
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {message.role === "user" && (
                  <Card className="max-w-[80%] p-4 bg-primary text-primary-foreground">
                    <div className="font-gochi whitespace-pre-wrap">{message.content}</div>
                  </Card>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                  <img src="/kang-avatar.gif" alt="Kang" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1 font-gochi">Kang</span>
                  <Card className="max-w-[80%] p-4 bg-card text-card-foreground border-2 border-border">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Kang is finding perfect places for you...</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <Card className="p-4 bg-card border-2 border-border">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              name="message"
              placeholder="How are you feeling today? Tell me your mood..."
              className="flex-1 px-3 py-2 bg-input border-2 border-border focus:border-primary font-gochi rounded-md focus:outline-none"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="mood-button-small">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>

        {/* Example moods - only show when no messages */}
        {messages.length === 0 && (
          <div className="mt-8 text-center">
            <h3 className="text-xl font-gochi text-foreground mb-4">Need inspiration? Try these moods:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {exampleMoods.map((exampleMood) => (
                <button
                  key={exampleMood}
                  onClick={() => sendExampleMessage(exampleMood)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-colors border border-border font-gochi"
                  disabled={isLoading}
                >
                  {exampleMood}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
