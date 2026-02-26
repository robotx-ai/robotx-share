import countries from "world-countries";
import {
  getServiceAreaByValue,
  SERVICE_AREAS,
} from "@/lib/serviceLocation";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  const getAll = () => SERVICE_AREAS;

  const getByValue = (value: string) => {
    const serviceArea = getServiceAreaByValue(value);
    if (serviceArea) {
      return serviceArea;
    }

    // Compatibility fallback for pre-SoCal location values during rollout.
    return formattedCountries.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCountries;
