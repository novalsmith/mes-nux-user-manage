export class AuthDatasource {
  async exchangeCode(code: string, codeVerifier: string): Promise<any> {
    return await $fetch('/api/auth/token', {
      method: 'POST',
      body: { code, codeVerifier }
    });
  }

  async fetchMe(token: string): Promise<any> {
    return await $fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}