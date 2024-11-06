export type Database = {
  public: {
    Tables: {
      ssh_settings: {
        Row: {
          id: string;
          host: string;
          username: string;
          password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          host: string;
          username: string;
          password: string;
          updated_at?: string;
        };
        Update: {
          host?: string;
          username?: string;
          password?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export interface UserSession {
  user: {
    id: string
    email?: string
  } | null
  session: {
    access_token: string
    refresh_token: string
  } | null
}
