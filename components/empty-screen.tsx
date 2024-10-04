import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Como cuidar do cabelo?',
    message: 'Como cuidar do cabelo?'
  },
  {
    heading: 'Quais são as melhores séries?',
    message: 'Quais são as melhores séries?'
  },
  {
    heading: 'Como melhorar minha autoestima?',
    message: 'Como melhorar minha autoestima?'
  },
  {
    heading: 'Empreender do zero',
    message: 'Empreender do zero'
  }
]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
