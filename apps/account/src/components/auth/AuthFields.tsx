"use client";

import React, { useState } from "react";

import { Field, FieldError, FieldLabel, Input } from "@ansospace/ui/components";
import { Eye, EyeOff } from "lucide-react";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@ansospace/ui/components";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export interface AuthFieldConfig {
  id: string;
  icon?: React.ReactNode;
  placeholder?: string;
  name: string;
  type: string;
  label?: string;
}

interface AuthFieldsProps<T extends FieldValues> {
  form: {
    control: Control<T>;
  };
  fields: AuthFieldConfig[];
  loading?: boolean;
}

/**
 * Generic AuthFields renderer that handles all input types and password toggles
 */
export function AuthFields<T extends FieldValues>({ form, fields, loading }: AuthFieldsProps<T>) {
  // handle password visibility per field
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (name: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {fields.map(({ id, icon, name, type, placeholder, label }) => {
        const isPassword = type === "password";
        const showPassword = visiblePasswords[name];
        const inputType = isPassword && showPassword ? "text" : type;

        return (
          <Controller
            key={id}
            control={form.control}
            name={name as Path<T>}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{label}</FieldLabel>
                <div className="relative">
                  {icon}
                  <Input
                    {...field}
                    id={id}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={loading}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.error?.message}
                    className={`pl-10 ${isPassword ? "pr-10" : ""}`}
                  />
                  {isPassword && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => togglePassword(name)}
                      className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  )}
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        );
      })}
    </>
  );
}
