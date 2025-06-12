"use client"

import { useState } from "react"
import { Download, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreCircle } from "@/components/analyzer/ScoreCircle"
import { IssueCard } from "@/components/analyzer/IssueCard"

export function ResultsPanel({ results, isAnalyzing }) {
  const [downloadOpen, setDownloadOpen] = useState(false)

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "moderate":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "minor":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      default:
        return null
    }
  }

  const getSeverityCount = (severity) => {
    if (!results) return 0
    return results.issues.filter((issue) => issue.severity === severity).length
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-white/20 shadow-lg transition-all duration-300 hover:shadow-emerald-200/10 dark:hover:shadow-emerald-900/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold">
          <Target className="mr-2 h-5 w-5 text-emerald-500" />
          Analysis Results
        </CardTitle>
        <CardDescription>Accessibility issues found in your content</CardDescription>
      </CardHeader>

      <CardContent>
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Analyzing content...</p>
          </div>
        ) : results ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <ScoreCircle score={results.score} />

              <div className="grid grid-cols-3 gap-2 mt-4 md:mt-0">
                <div className="flex flex-col items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-1" />
                    <span className="font-bold text-red-600 dark:text-red-400">{getSeverityCount("critical")}</span>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400 mt-1">Critical</span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="font-bold text-amber-600 dark:text-amber-400">{getSeverityCount("moderate")}</span>
                  </div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">Moderate</span>
                </div>

                <div className="flex flex-col items-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {getSeverityCount("minor")}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Minor</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Issues Found</h3>

              {results.issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <Target className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs">
              Enter a URL or paste HTML code and click "Analyze" to check for accessibility issues.
            </p>
          </div>
        )}
      </CardContent>

      {results && (
        <CardFooter className="flex flex-col items-start border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="w-full">
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setDownloadOpen(!downloadOpen)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </div>
                {downloadOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {downloadOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                  <Button variant="ghost" className="w-full justify-start mb-1">
                    PDF Report
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    JSON Data
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
