export interface FormFieldItemProps {
  name: string;
  variant: 'mapped' | 'unmapped';
  selected: boolean;
  onRemove?: () => void;
  onClick?: (fieldName: string) => void;
  className?: string;
}

// form
export type FormData = {
  name: string;
  fields: string[];
  direct_dependencies: Record<string, string[]>;
  transient_dependencies: Record<string, string[]>;
};

export interface FormItem {
  name: string;
  type: 'mapped' | 'unmapped';
  selected: boolean;
  mappedValue?: string
}

export interface PrefilFormProps {
  initialItems?: FormItem[];
  onItemsChange?: (items: FormItem[]) => void;
  onEnabledChange?: (enabled: boolean) => void;
  className?: string;
  formData: FormData;
}