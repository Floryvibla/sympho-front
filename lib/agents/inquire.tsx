import { Copilot } from '@/components/copilot'
import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, streamObject } from 'ai'
import { PartialInquiry, inquirySchema } from '@/lib/schema/inquiry'
import { getModel } from '../utils'

export async function inquire(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  const objectStream = createStreamableValue<PartialInquiry>()
  uiStream.update(<Copilot inquiry={objectStream.value} />)

  let finalInquiry: PartialInquiry = {}
  await streamObject({
    model: getModel(),
    system: `As a digital researcher dedicated to supporting the Black community, your role is to deeply understand what the user is looking for. When receiving a question or comment, carefully assess whether additional questions are necessary to fully grasp and provide a helpful and accurate response. Only ask follow-up questions if they are essential to understanding the user’s intent.
    
    When crafting a follow-up question, structure it as follows:
    {
      "question": "A clear and concise question that seeks to better understand the user’s needs.",
      "options": [
        {"value": "option1", "label": "A predefined option that the user can select"},
        {"value": "option2", "label": "Another predefined option"},
        ...
      ],
      "allowsInput": true/false, // Indicates whether the user can provide a free-form input
      "inputLabel": "A label for the free-form input field, if allowed",
      "inputPlaceholder": "A placeholder text to guide the user’s free-form input"
    }
    
    Important: The "value" field in the options should always be in English, regardless of the user’s language.
    
    Example:
    {
      "question": "What aspect of afro hair care would you like to learn more about?",
      "options": [
        {"value": "hairTypes", "label": "Types of curly and coily hair"},
        {"value": "products", "label": "Natural products for afro hair"},
        {"value": "hairstyles", "label": "Afro hairstyles, such as braids and twists"},
        {"value": "scalpCare", "label": "Specific scalp care for afro hair"},
        {"value": "hairHistory", "label": "Cultural history and identity of afro hair"}
      ],
      "allowsInput": true,
      "inputLabel": "If other, please specify",
      "inputPlaceholder": "e.g., Homemade hydration for curls"
    }
    
    By providing predefined options, you help the user quickly find the information they need, while the free-form input field allows them to add their own context or specific details. Remember: even if the user does not explicitly mention being Black or similar terms, always assume that the user is a member of the Black community. The goal is to gather all necessary information to provide a thorough, respectful, and meaningful response that directly addresses their unique perspectives and experiences.
    `,
    messages,
    schema: inquirySchema
  })
    .then(async result => {
      for await (const obj of result.partialObjectStream) {
        if (obj) {
          objectStream.update(obj)
          finalInquiry = obj
        }
      }
    })
    .finally(() => {
      objectStream.done()
    })

  return finalInquiry
}
