import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Customer } from '@/src/api/types';

const TOKEN_KEY = '@loja-que-responde/token';
const CUSTOMER_KEY = '@loja-que-responde/customer';

export async function getSession() {
  const [token, customerJson] = await Promise.all([AsyncStorage.getItem(TOKEN_KEY), AsyncStorage.getItem(CUSTOMER_KEY)]);
  return { token, customer: customerJson ? (JSON.parse(customerJson) as Customer) : null };
}

export async function saveSession(token: string, customer: Customer) {
  await Promise.all([AsyncStorage.setItem(TOKEN_KEY, token), AsyncStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer))]);
}

export async function clearSession() {
  await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(CUSTOMER_KEY)]);
}
