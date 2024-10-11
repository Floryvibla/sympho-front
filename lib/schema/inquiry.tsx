import { DeepPartial } from 'ai'
import { z } from 'zod'

export const inquirySchema = z.object({
  question: z.string().describe('A questão do inquérito'),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string()
      })
    )
    .describe('As opções de consulta'),
  allowsInput: z
    .boolean()
    .describe('Se o inquérito permite a entrada de dados'),
  inputLabel: z
    .string()
    .optional()
    .describe('O rótulo para o campo de entrada'),
  inputPlaceholder: z
    .string()
    .optional()
    .describe('O espaço reservado para o campo de entrada')
})

export type PartialInquiry = DeepPartial<typeof inquirySchema>
