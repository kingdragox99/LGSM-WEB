export interface GameServer {
  id: string
  user_id: string
  name: string
  game: string
  status: 'running' | 'stopped' | 'error'
  ip: string
  port: number
  created_at?: string
  updated_at?: string
}

export interface ServerCommand {
  name: string
  command: string
  type: 'start' | 'stop' | 'restart' | 'update' | 'custom'
} 