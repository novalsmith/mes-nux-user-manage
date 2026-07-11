// implementation/Auth.ts
export class AuthDatasource {
  async loginWithCredentials(username: string, password: string): Promise<any> {
    return await $fetch('/api/auth/token', {
      method: 'POST',
      body: { username, password }
    });
  }

  async fetchMe(token: string): Promise<any> {
    return await $fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}