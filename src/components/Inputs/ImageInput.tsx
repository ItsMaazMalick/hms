"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type ImageInputProps = {
  label: string;
  control: any;
  name: string;
};

export default function ImageInput({ label, control, name }: ImageInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, ...fieldValues } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...fieldValues}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                fieldValues.onChange(file);
              }}
            />
          </FormControl>
          <FormDescription>Image must be less than 2MB</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
