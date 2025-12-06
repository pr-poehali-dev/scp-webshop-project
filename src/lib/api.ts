const API_URLS = {
  auth: 'https://functions.poehali.dev/ae706b7c-8b99-4812-befe-e4b06f8fe0d9',
  payment: 'https://functions.poehali.dev/47557b86-e876-48e9-b84c-f60780522807',
  admin: 'https://functions.poehali.dev/b08ef8a3-0f42-49e2-a7be-fac1317f6f63'
};

export interface User {
  id: number;
  username: string;
  avatar?: string;
  is_admin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const api = {
  async loginSteam(steamId: string, username: string, avatar?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URLS.auth}?action=steam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'steam', steam_id: steamId, username, avatar })
    });
    return response.json();
  },

  async loginDiscord(discordId: string, username: string, avatar?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URLS.auth}?action=discord`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'discord', discord_id: discordId, username, avatar })
    });
    return response.json();
  },

  async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    const response = await fetch(`${API_URLS.auth}?action=verify`, {
      method: 'GET',
      headers: { 'X-Auth-Token': token }
    });
    return response.json();
  },

  async createPayment(userId: number, productId: number, productName: string, price: number): Promise<{ payment_url: string; purchase_id: number }> {
    const response = await fetch(`${API_URLS.payment}?action=create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, product_id: productId, product_name: productName, price })
    });
    return response.json();
  },

  async getAdminStats(token: string) {
    const response = await fetch(`${API_URLS.admin}?action=stats`, {
      headers: { 'X-Auth-Token': token }
    });
    return response.json();
  },

  async getUsers(token: string) {
    const response = await fetch(`${API_URLS.admin}?action=users`, {
      headers: { 'X-Auth-Token': token }
    });
    return response.json();
  },

  async getPurchases(token: string) {
    const response = await fetch(`${API_URLS.admin}?action=purchases`, {
      headers: { 'X-Auth-Token': token }
    });
    return response.json();
  },

  async addAdmin(token: string, discordId: string) {
    const response = await fetch(`${API_URLS.admin}?action=add-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify({ discord_id: discordId })
    });
    return response.json();
  }
};
