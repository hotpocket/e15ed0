export interface FormFieldItemProps {
  name: string;
  variant: 'mapped' | 'unmapped';
  onRemove?: () => void;
  formData: FormData;
  renderTree: (formData: FormData) => void;
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
  mappedValue?: string
}

export interface PrefilFormProps {
  initialItems?: FormItem[];
  onItemsChange?: (items: FormItem[]) => void;
  onEnabledChange?: (enabled: boolean) => void;
  className?: string;
  formData: FormData;
}