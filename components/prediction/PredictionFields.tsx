import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { predictionFieldMetadata } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getErrorMessage(errors: unknown, path: string) {
  const error = path.split(".").reduce<unknown>((current, key) => {
    if (!isRecord(current)) {
      return undefined
    }

    return current[key]
  }, errors)

  if (isRecord(error) && typeof error.message === "string") {
    return error.message
  }

  return undefined
}

export function PredictionFields<T extends FieldValues>({
  register,
  errors,
  prefix,
  disabled,
}: {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  prefix?: string
  disabled?: boolean
}) {
  return (
    <div className="grid gap-4">
      {predictionFieldMetadata.map((field) => {
        const fieldPath = prefix ? `${prefix}.${field.name}` : field.name
        const inputId = fieldPath.replace(".", "-")
        const errorMessage = getErrorMessage(errors, fieldPath)

        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={inputId}>{field.label}</Label>
            <Input
              id={inputId}
              type="number"
              min={field.min}
              max={"max" in field ? field.max : undefined}
              step={field.step}
              disabled={disabled}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? `${inputId}-error` : `${inputId}-helper`}
              {...register(fieldPath as Path<T>, { valueAsNumber: true })}
            />
            {errorMessage ? (
              <p id={`${inputId}-error`} className="text-xs font-medium text-red-700">
                {errorMessage}
              </p>
            ) : (
              <p id={`${inputId}-helper`} className="text-xs leading-5 text-slate-500">
                {field.helper}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
