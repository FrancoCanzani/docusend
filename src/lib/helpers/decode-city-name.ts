export function decodeCityName(encodedCity: string): string {
  try {
    return decodeURIComponent(encodedCity);
  } catch (error) {
    return encodedCity;
  }
}
