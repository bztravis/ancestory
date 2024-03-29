/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/oWNrI4Te2WH
 */
import { Card } from "@/components/ui/card"

export function RecordButton() {
  return (
    <Card className="w-full max-w-3xl">
      <div className="p-4 grid gap-4">
        <div className="flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <MicIcon className="h-16 w-16 text-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">Ready to record?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click the button below to start recording.</p>
        </div>
      </div>
    </Card>
  )
}


function MicIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}
