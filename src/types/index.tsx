export interface AlertItem {
  id: string;
  category: string;
  date: string;
  title: string;
  threat: string;
  location: string;
  productDetails: string;
  lotCode: string;
  useBy: string;
  instructions: string;
  source: string;
}

export interface CardProps {
  item: AlertItem;
}


export interface ProcessingModalProps {
  visible: boolean;
  onCancel: () => void;
}

export interface ProductResult {
  status: 'suitable' | 'avoid';
  productName: string;
  matchConfidence: string;
  imageUri?: string; // Optional captured frame preview
  guidanceTitle: string;
  guidanceSubtitle: string;
  guidanceBody: string;
  checklistTitle?: string;
  checklistItems?: string[];
  alternatives?: {
    icon: string;
    title: string;
    description: string;
  }[];
  recallStatus: string;
  recallDetails: string;
  guidanceSource: string;
}
