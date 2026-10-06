export interface TemplateType {
  alias: string;
  title: string;
  category: string;
  file: string;
  size: string;
  created_at: string;
}

export interface DeleteTemplateDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  template: TemplateType | null;
}

export interface EditTemplateDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  template: TemplateType | null;
}
