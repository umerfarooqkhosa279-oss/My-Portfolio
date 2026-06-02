export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'url' | 'json' | 'file';
export type FieldConfig = {
  name: string;
  label: string;
  type?: FieldType;
  bucket?: string;
  folder?: string;
  required?: boolean;
};
export type ManagerConfig = {
  title: string;
  table: string;
  description: string;
  fields: FieldConfig[];
  sortField?: string;
  singleton?: boolean;
};
