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