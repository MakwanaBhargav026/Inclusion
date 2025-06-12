"use client"

import { useState } from "react"
import { Globe, Code, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyzerPanel({ onAnalyze, isAnalyzing }) {
  const [activeTab, setActiveTab] = useState("url")
  const [url, setUrl] = useState("")
  const [html, setHtml] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = activeTab === "url" ? { type: "url", value: url } : { type: "html", value: html }
    onAnalyze(data)
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-white/20 shadow-lg transition-all duration-300 hover:shadow-emerald-200/10 dark:hover:shadow-emerald-900/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold">
          <Brain className="mr-2 h-5 w-5 text-emerald-500" />
          Accessibility Analysis
        </CardTitle>
        <CardDescription>Enter a URL or paste HTML code to analyze for accessibility issues</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="url" className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                HTML
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  Website URL
                </label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Enter the full URL including https://</p>
              </div>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="html" className="text-sm font-medium">
                  HTML Code
                </label>
                <Textarea
                  id="html"
                  placeholder="<html>...</html>"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="min-h-[200px] font-mono text-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                  disabled={isAnalyzing}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              disabled={isAnalyzing || (activeTab === "url" && !url) || (activeTab === "html" && !html)}
            >
              {isAnalyzing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Analyze Accessibility
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-start border-t border-slate-200 dark:border-slate-700 pt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Analysis is based on WCAG 2.1 guidelines and best practices for web accessibility.
        </p>
      </CardFooter>
    </Card>
  )
}
