import { countryData } from '../constants/country-data';

export default function getCountryData(countryCode: string) {
  return countryData.find(
    (country) => country.countryCode.toLowerCase() === countryCode.toLowerCase()
  );
}
