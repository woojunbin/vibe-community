import type { AppComponent } from './project';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  level: number;
  xp: number;
  follower_count: number;
  following_count: number;
  created_at: string;
}

export interface PublishedScreen {
  id: string;
  owner_id: string;
  name: string;
  components: AppComponent[];
  canvas_width: number;
  canvas_height: number;
  background_color: string;
  is_published: boolean;
  published_at: string | null;
  thumbnail_url: string | null;
  description: string | null;
  tags: string[];
  view_count: number;
  like_count: number;
  connection_count: number;
  created_at: string;
  updated_at: string;
  owner?: UserProfile;
  is_liked?: boolean;
}

export interface Connection {
  id: string;
  source_screen_id: string;
  target_screen_id: string;
  created_by: string;
  label: string | null;
  edge_type: 'solid' | 'dashed';
  source_component_id: string | null;
  created_at: string;
  source_screen?: PublishedScreen;
  target_screen?: PublishedScreen;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface XpEvent {
  id: string;
  user_id: string;
  event_type: string;
  xp_amount: number;
  reference_id: string | null;
  created_at: string;
}

export type XpEventType =
  | 'publish_screen'
  | 'receive_like'
  | 'receive_connection'
  | 'create_connection'
  | 'receive_follow'
  | 'first_component'
  | 'daily_login';
