export interface SSHConfig {
  host: string
  username: string
  password?: string
  privateKey?: string
  port?: number
}

export interface SSHResponse {
  stdout: string
  stderr: string
  success: boolean
} 