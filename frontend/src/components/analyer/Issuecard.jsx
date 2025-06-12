"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertTriangle, XCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function IssueCard({ issue }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "moderate":
        return <AlertTriangle className="h-4 w-4" />
      case "minor":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30"
      case "moderate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30"
      case "minor":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-md">
      <div className="p-4 cursor-pointer flex items-start justify-between" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start space-x-3">
          <div
            className={`p-1 rounded-full ${issue.severity === "critical" ? "bg-red-100 dark:bg-red-900/30" : issue.severity === "moderate" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}
          >
            {getSeverityIcon(issue.severity)}
          </div>
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100">{issue.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{issue.description}</p>
          </div>
        </div>
        <Badge variant="outline" className={`ml-2 ${getSeverityColor(issue.severity)}`}>
          {issue.severity}
        </Badge>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-800">
          <div className="mt-3 space-y-3">
            {issue.snippet && (
              <div>
                <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Code Snippet:</h5>
                <pre className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs overflow-x-auto">
                  {issue.snippet}
                </pre>
              </div>
            )}

            {issue.suggestion && (
              <div>
                <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Suggested Fix:</h5>
                <p className="text-sm text-slate-700 dark:text-slate-300">{issue.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center p-2 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            Show Details
          </>
        )}
      </button>
    </div>
  )
}
