export interface SSHServer {
  id: string
  name: string
  host: string
  user_id: string
  created_at: string
}

export interface GameServer {
  id: string
  name: string
  game: string
  ip: string
  ssh_server_id: string
  user_id: string
  created_at: string
} 