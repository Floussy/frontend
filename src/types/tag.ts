export interface Tag {
  id: number;
  name: string;
  color: string | null;
  usage_count?: number;
  created_at: string;
}
