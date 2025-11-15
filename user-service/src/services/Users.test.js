import { getUsersServiceSingleton } from "./Users";

test('login test', async () => {
  await expect(login()).rejects.toMatch('error');
});