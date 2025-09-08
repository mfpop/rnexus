import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  MapPin,
  Globe,
  Building,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Input } from "../ui/bits";

interface Country {
  name: string;
  cca2: string;
  cca3: string;
  flag: string;
}

interface StateProvince {
  geonameId: number;
  name: string;
  adminName1: string;
}

interface CityTown {
  geonameId: number;
  name: string;
  adminName1: string;
  adminName2: string;
}

interface AddressFormData {
  street_address: string;
  apartment_suite: string;
  country: string;
  state_province: string;
  city: string;
  zip_code: string;
}

interface AddressFormProps {
  value: AddressFormData;
  onChange: (data: AddressFormData) => void;
  className?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<StateProvince[]>([]);
  const [cities, setCities] = useState<CityTown[]>([]);
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (value.country) {
      loadStates(value.country);
      // Reset dependent fields
      onChange({
        ...value,
        state_province: "",
        city: "",
        zip_code: "",
      });
    }
  }, [value.country]);

  // Load cities when state changes
  useEffect(() => {
    if (value.state_province) {
      loadCities(value.state_province);
      // Reset dependent fields
      onChange({
        ...value,
        city: "",
        zip_code: "",
      });
    }
  }, [value.state_province]);

  const loadCountries = async () => {
    setLoading((prev) => ({ ...prev, countries: true }));
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (response.ok) {
        const data = await response.json();
        const sortedCountries = data
          .map((country: any) => ({
            name: country.name.common,
            cca2: country.cca2,
            cca3: country.cca3,
            flag: country.flag,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to load countries:", error);
      setErrors((prev) => ({
        ...prev,
        countries: "Failed to load countries. Please refresh the page.",
      }));
      // Fallback to common countries
      setCountries(getFallbackCountries());
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }));
    }
  };

  const loadStates = async (countryName: string) => {
    setLoading((prev) => ({ ...prev, states: true }));
    try {
      // Try to use real API first (you'll need to sign up for a free API key)
      // const apiKey = process.env.REACT_APP_GEONAMES_USERNAME || 'demo';
      // const response = await fetch(`https://secure.geonames.org/childrenJSON?geonameId=${getCountryGeonameId(countryName)}&username=${apiKey}`);

      // For now, use enhanced mock data with more countries
      const mockStates = getEnhancedStates(countryName);
      setStates(mockStates);
    } catch (error) {
      console.error("Failed to load states:", error);
      setErrors((prev) => ({
        ...prev,
        states: "Failed to load states. Please try again.",
      }));
      setStates([]);
    } finally {
      setLoading((prev) => ({ ...prev, states: false }));
    }
  };

  const loadCities = async (stateName: string) => {
    setLoading((prev) => ({ ...prev, cities: true }));
    try {
      // Try to use real API first
      // const apiKey = process.env.REACT_APP_GEONAMES_USERNAME || 'demo';
      // const response = await fetch(`https://secure.geonames.org/searchJSON?q=${stateName}&maxRows=1000&username=${apiKey}`);

      // For now, use enhanced mock data
      const mockCities = getEnhancedCities(stateName);
      setCities(mockCities);
    } catch (error) {
      console.error("Failed to load cities:", error);
      setErrors((prev) => ({
        ...prev,
        cities: "Failed to load cities. Please try again.",
      }));
      setCities([]);
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  // Enhanced mock data with more countries and regions
  const getEnhancedStates = (countryName: string): StateProvince[] => {
    const stateMap: Record<string, StateProvince[]> = {
      "United States": [
        { geonameId: 1, name: "Alabama", adminName1: "AL" },
        { geonameId: 2, name: "Alaska", adminName1: "AK" },
        { geonameId: 3, name: "Arizona", adminName1: "AZ" },
        { geonameId: 4, name: "Arkansas", adminName1: "AR" },
        { geonameId: 5, name: "California", adminName1: "CA" },
        { geonameId: 6, name: "Colorado", adminName1: "CO" },
        { geonameId: 7, name: "Connecticut", adminName1: "CT" },
        { geonameId: 8, name: "Delaware", adminName1: "DE" },
        { geonameId: 9, name: "Florida", adminName1: "FL" },
        { geonameId: 10, name: "Georgia", adminName1: "GA" },
        { geonameId: 11, name: "Hawaii", adminName1: "HI" },
        { geonameId: 12, name: "Idaho", adminName1: "ID" },
        { geonameId: 13, name: "Illinois", adminName1: "IL" },
        { geonameId: 14, name: "Indiana", adminName1: "IN" },
        { geonameId: 15, name: "Iowa", adminName1: "IA" },
        { geonameId: 16, name: "Kansas", adminName1: "KS" },
        { geonameId: 17, name: "Kentucky", adminName1: "KY" },
        { geonameId: 18, name: "Louisiana", adminName1: "LA" },
        { geonameId: 19, name: "Maine", adminName1: "ME" },
        { geonameId: 20, name: "Maryland", adminName1: "MD" },
        { geonameId: 21, name: "Massachusetts", adminName1: "MA" },
        { geonameId: 22, name: "Michigan", adminName1: "MI" },
        { geonameId: 23, name: "Minnesota", adminName1: "MN" },
        { geonameId: 24, name: "Mississippi", adminName1: "MS" },
        { geonameId: 25, name: "Missouri", adminName1: "MO" },
        { geonameId: 26, name: "Montana", adminName1: "MT" },
        { geonameId: 27, name: "Nebraska", adminName1: "NE" },
        { geonameId: 28, name: "Nevada", adminName1: "NV" },
        { geonameId: 29, name: "New Hampshire", adminName1: "NH" },
        { geonameId: 30, name: "New Jersey", adminName1: "NJ" },
        { geonameId: 31, name: "New Mexico", adminName1: "NM" },
        { geonameId: 32, name: "New York", adminName1: "NY" },
        { geonameId: 33, name: "North Carolina", adminName1: "NC" },
        { geonameId: 34, name: "North Dakota", adminName1: "ND" },
        { geonameId: 35, name: "Ohio", adminName1: "OH" },
        { geonameId: 36, name: "Oklahoma", adminName1: "OK" },
        { geonameId: 37, name: "Oregon", adminName1: "OR" },
        { geonameId: 38, name: "Pennsylvania", adminName1: "PA" },
        { geonameId: 39, name: "Rhode Island", adminName1: "RI" },
        { geonameId: 40, name: "South Carolina", adminName1: "SC" },
        { geonameId: 41, name: "South Dakota", adminName1: "SD" },
        { geonameId: 42, name: "Tennessee", adminName1: "TN" },
        { geonameId: 43, name: "Texas", adminName1: "TX" },
        { geonameId: 44, name: "Utah", adminName1: "UT" },
        { geonameId: 45, name: "Vermont", adminName1: "VT" },
        { geonameId: 46, name: "Virginia", adminName1: "VA" },
        { geonameId: 47, name: "Washington", adminName1: "WA" },
        { geonameId: 48, name: "West Virginia", adminName1: "WV" },
        { geonameId: 49, name: "Wisconsin", adminName1: "WI" },
        { geonameId: 50, name: "Wyoming", adminName1: "WY" },
      ],
      Canada: [
        { geonameId: 51, name: "Alberta", adminName1: "AB" },
        { geonameId: 52, name: "British Columbia", adminName1: "BC" },
        { geonameId: 53, name: "Manitoba", adminName1: "MB" },
        { geonameId: 54, name: "New Brunswick", adminName1: "NB" },
        { geonameId: 55, name: "Newfoundland and Labrador", adminName1: "NL" },
        { geonameId: 56, name: "Northwest Territories", adminName1: "NT" },
        { geonameId: 57, name: "Nova Scotia", adminName1: "NS" },
        { geonameId: 58, name: "Nunavut", adminName1: "NU" },
        { geonameId: 59, name: "Ontario", adminName1: "ON" },
        { geonameId: 60, name: "Prince Edward Island", adminName1: "PE" },
        { geonameId: 61, name: "Quebec", adminName1: "QC" },
        { geonameId: 62, name: "Saskatchewan", adminName1: "SK" },
        { geonameId: 63, name: "Yukon", adminName1: "YT" },
      ],
      "United Kingdom": [
        { geonameId: 64, name: "England", adminName1: "ENG" },
        { geonameId: 65, name: "Scotland", adminName1: "SCT" },
        { geonameId: 66, name: "Wales", adminName1: "WLS" },
        { geonameId: 67, name: "Northern Ireland", adminName1: "NIR" },
      ],
      Germany: [
        { geonameId: 68, name: "Baden-Württemberg", adminName1: "BW" },
        { geonameId: 69, name: "Bavaria", adminName1: "BY" },
        { geonameId: 70, name: "Berlin", adminName1: "BE" },
        { geonameId: 71, name: "Brandenburg", adminName1: "BB" },
        { geonameId: 72, name: "Bremen", adminName1: "HB" },
        { geonameId: 73, name: "Hamburg", adminName1: "HH" },
        { geonameId: 74, name: "Hesse", adminName1: "HE" },
        { geonameId: 75, name: "Lower Saxony", adminName1: "NI" },
        { geonameId: 76, name: "Mecklenburg-Vorpommern", adminName1: "MV" },
        { geonameId: 77, name: "North Rhine-Westphalia", adminName1: "NW" },
        { geonameId: 78, name: "Rhineland-Palatinate", adminName1: "RP" },
        { geonameId: 79, name: "Saarland", adminName1: "SL" },
        { geonameId: 80, name: "Saxony", adminName1: "SN" },
        { geonameId: 81, name: "Saxony-Anhalt", adminName1: "ST" },
        { geonameId: 82, name: "Schleswig-Holstein", adminName1: "SH" },
        { geonameId: 83, name: "Thuringia", adminName1: "TH" },
      ],
      France: [
        { geonameId: 84, name: "Auvergne-Rhône-Alpes", adminName1: "ARA" },
        { geonameId: 85, name: "Bourgogne-Franche-Comté", adminName1: "BFC" },
        { geonameId: 86, name: "Bretagne", adminName1: "BRE" },
        { geonameId: 87, name: "Centre-Val de Loire", adminName1: "CVL" },
        { geonameId: 88, name: "Corse", adminName1: "COR" },
        { geonameId: 89, name: "Grand Est", adminName1: "GES" },
        { geonameId: 90, name: "Hauts-de-France", adminName1: "HDF" },
        { geonameId: 91, name: "Île-de-France", adminName1: "IDF" },
        { geonameId: 92, name: "Normandie", adminName1: "NOR" },
        { geonameId: 93, name: "Nouvelle-Aquitaine", adminName1: "NAQ" },
        { geonameId: 94, name: "Occitanie", adminName1: "OCC" },
        { geonameId: 95, name: "Pays de la Loire", adminName1: "PDL" },
        {
          geonameId: 96,
          name: "Provence-Alpes-Côte d'Azur",
          adminName1: "PAC",
        },
      ],
      Mexico: [
        { geonameId: 100, name: "Aguascalientes", adminName1: "AGU" },
        { geonameId: 101, name: "Baja California", adminName1: "BCN" },
        { geonameId: 102, name: "Baja California Sur", adminName1: "BCS" },
        { geonameId: 103, name: "Campeche", adminName1: "CAM" },
        { geonameId: 104, name: "Chiapas", adminName1: "CHP" },
        { geonameId: 105, name: "Chihuahua", adminName1: "CHH" },
        { geonameId: 106, name: "Ciudad de México", adminName1: "CDMX" },
        { geonameId: 107, name: "Coahuila", adminName1: "COA" },
        { geonameId: 108, name: "Colima", adminName1: "COL" },
        { geonameId: 109, name: "Durango", adminName1: "DUR" },
        { geonameId: 110, name: "Estado de México", adminName1: "MEX" },
        { geonameId: 111, name: "Guanajuato", adminName1: "GUA" },
        { geonameId: 112, name: "Guerrero", adminName1: "GRO" },
        { geonameId: 113, name: "Hidalgo", adminName1: "HID" },
        { geonameId: 114, name: "Jalisco", adminName1: "JAL" },
        { geonameId: 115, name: "Michoacán", adminName1: "MIC" },
        { geonameId: 116, name: "Morelos", adminName1: "MOR" },
        { geonameId: 117, name: "Nayarit", adminName1: "NAY" },
        { geonameId: 118, name: "Nuevo León", adminName1: "NLE" },
        { geonameId: 119, name: "Oaxaca", adminName1: "OAX" },
        { geonameId: 120, name: "Puebla", adminName1: "PUE" },
        { geonameId: 121, name: "Querétaro", adminName1: "QUE" },
        { geonameId: 122, name: "Quintana Roo", adminName1: "ROO" },
        { geonameId: 123, name: "San Luis Potosí", adminName1: "SLP" },
        { geonameId: 124, name: "Sinaloa", adminName1: "SIN" },
        { geonameId: 125, name: "Sonora", adminName1: "SON" },
        { geonameId: 126, name: "Tabasco", adminName1: "TAB" },
        { geonameId: 127, name: "Tamaulipas", adminName1: "TAM" },
        { geonameId: 128, name: "Tlaxcala", adminName1: "TLA" },
        { geonameId: 129, name: "Veracruz", adminName1: "VER" },
        { geonameId: 130, name: "Yucatán", adminName1: "YUC" },
        { geonameId: 131, name: "Zacatecas", adminName1: "ZAC" },
      ],
    };
    return stateMap[countryName] || [];
  };

  const getEnhancedCities = (stateName: string): CityTown[] => {
    const cityMap: Record<string, CityTown[]> = {
      // US Cities
      "New York": [
        {
          geonameId: 101,
          name: "New York City",
          adminName1: "NY",
          adminName2: "New York",
        },
        {
          geonameId: 102,
          name: "Buffalo",
          adminName1: "NY",
          adminName2: "Erie",
        },
        {
          geonameId: 103,
          name: "Rochester",
          adminName1: "NY",
          adminName2: "Monroe",
        },
        {
          geonameId: 104,
          name: "Yonkers",
          adminName1: "NY",
          adminName2: "Westchester",
        },
        {
          geonameId: 105,
          name: "Syracuse",
          adminName1: "NY",
          adminName2: "Onondaga",
        },
      ],
      California: [
        {
          geonameId: 201,
          name: "Los Angeles",
          adminName1: "CA",
          adminName2: "Los Angeles",
        },
        {
          geonameId: 202,
          name: "San Francisco",
          adminName1: "CA",
          adminName2: "San Francisco",
        },
        {
          geonameId: 203,
          name: "San Diego",
          adminName1: "CA",
          adminName2: "San Diego",
        },
        {
          geonameId: 204,
          name: "San Jose",
          adminName1: "CA",
          adminName2: "Santa Clara",
        },
        {
          geonameId: 205,
          name: "Sacramento",
          adminName1: "CA",
          adminName2: "Sacramento",
        },
      ],
      Texas: [
        {
          geonameId: 301,
          name: "Houston",
          adminName1: "TX",
          adminName2: "Harris",
        },
        {
          geonameId: 302,
          name: "Dallas",
          adminName1: "TX",
          adminName2: "Dallas",
        },
        {
          geonameId: 303,
          name: "Austin",
          adminName1: "TX",
          adminName2: "Travis",
        },
        {
          geonameId: 304,
          name: "San Antonio",
          adminName1: "TX",
          adminName2: "Bexar",
        },
        {
          geonameId: 305,
          name: "Fort Worth",
          adminName1: "TX",
          adminName2: "Tarrant",
        },
      ],
      // Canadian Cities
      Ontario: [
        {
          geonameId: 401,
          name: "Toronto",
          adminName1: "ON",
          adminName2: "Toronto",
        },
        {
          geonameId: 402,
          name: "Ottawa",
          adminName1: "ON",
          adminName2: "Ottawa",
        },
        {
          geonameId: 403,
          name: "Mississauga",
          adminName1: "ON",
          adminName2: "Peel",
        },
        {
          geonameId: 404,
          name: "Brampton",
          adminName1: "ON",
          adminName2: "Peel",
        },
        {
          geonameId: 405,
          name: "Hamilton",
          adminName1: "ON",
          adminName2: "Hamilton",
        },
      ],
      Quebec: [
        {
          geonameId: 501,
          name: "Montreal",
          adminName1: "QC",
          adminName2: "Montreal",
        },
        {
          geonameId: 502,
          name: "Quebec City",
          adminName1: "QC",
          adminName2: "Quebec",
        },
        {
          geonameId: 503,
          name: "Laval",
          adminName1: "QC",
          adminName2: "Laval",
        },
        {
          geonameId: 504,
          name: "Gatineau",
          adminName1: "QC",
          adminName2: "Gatineau",
        },
        {
          geonameId: 505,
          name: "Longueuil",
          adminName1: "QC",
          adminName2: "Longueuil",
        },
      ],
      // UK Cities
      England: [
        {
          geonameId: 601,
          name: "London",
          adminName1: "ENG",
          adminName2: "Greater London",
        },
        {
          geonameId: 602,
          name: "Birmingham",
          adminName1: "ENG",
          adminName2: "West Midlands",
        },
        {
          geonameId: 603,
          name: "Manchester",
          adminName1: "ENG",
          adminName2: "Greater Manchester",
        },
        {
          geonameId: 604,
          name: "Liverpool",
          adminName1: "ENG",
          adminName2: "Merseyside",
        },
        {
          geonameId: 605,
          name: "Leeds",
          adminName1: "ENG",
          adminName2: "West Yorkshire",
        },
      ],
      // Mexican Cities
      "Ciudad de México": [
        {
          geonameId: 701,
          name: "Mexico City",
          adminName1: "CDMX",
          adminName2: "Cuauhtémoc",
        },
        {
          geonameId: 702,
          name: "Iztapalapa",
          adminName1: "CDMX",
          adminName2: "Iztapalapa",
        },
        {
          geonameId: 703,
          name: "Gustavo A. Madero",
          adminName1: "CDMX",
          adminName2: "Gustavo A. Madero",
        },
        {
          geonameId: 704,
          name: "Álvaro Obregón",
          adminName1: "CDMX",
          adminName2: "Álvaro Obregón",
        },
        {
          geonameId: 705,
          name: "Coyoacán",
          adminName1: "CDMX",
          adminName2: "Coyoacán",
        },
      ],
      Jalisco: [
        {
          geonameId: 801,
          name: "Guadalajara",
          adminName1: "JAL",
          adminName2: "Guadalajara",
        },
        {
          geonameId: 802,
          name: "Zapopan",
          adminName1: "JAL",
          adminName2: "Zapopan",
        },
        {
          geonameId: 803,
          name: "San Pedro Tlaquepaque",
          adminName1: "JAL",
          adminName2: "San Pedro Tlaquepaque",
        },
        {
          geonameId: 804,
          name: "Tlaquepaque",
          adminName1: "JAL",
          adminName2: "Tlaquepaque",
        },
        {
          geonameId: 805,
          name: "Tonalá",
          adminName1: "JAL",
          adminName2: "Tonalá",
        },
      ],
      "Nuevo León": [
        {
          geonameId: 901,
          name: "Monterrey",
          adminName1: "NLE",
          adminName2: "Monterrey",
        },
        {
          geonameId: 902,
          name: "San Nicolás de los Garza",
          adminName1: "NLE",
          adminName2: "San Nicolás de los Garza",
        },
        {
          geonameId: 903,
          name: "Guadalupe",
          adminName1: "NLE",
          adminName2: "Guadalupe",
        },
        {
          geonameId: 904,
          name: "Santa Catarina",
          adminName1: "NLE",
          adminName2: "Santa Catarina",
        },
        {
          geonameId: 905,
          name: "San Pedro Garza García",
          adminName1: "NLE",
          adminName2: "San Pedro Garza García",
        },
      ],
      Puebla: [
        {
          geonameId: 1001,
          name: "Puebla",
          adminName1: "PUE",
          adminName2: "Puebla",
        },
        {
          geonameId: 1002,
          name: "Amozoc",
          adminName1: "PUE",
          adminName2: "Amozoc",
        },
        {
          geonameId: 1003,
          name: "Atlixco",
          adminName1: "PUE",
          adminName2: "Atlixco",
        },
        {
          geonameId: 1004,
          name: "Cuautlancingo",
          adminName1: "PUE",
          adminName2: "Cuautlancingo",
        },
        {
          geonameId: 1005,
          name: "San Pedro Cholula",
          adminName1: "PUE",
          adminName2: "San Pedro Cholula",
        },
      ],
      "Baja California": [
        {
          geonameId: 1101,
          name: "Tijuana",
          adminName1: "BCN",
          adminName2: "Tijuana",
        },
        {
          geonameId: 1102,
          name: "Mexicali",
          adminName1: "BCN",
          adminName2: "Mexicali",
        },
        {
          geonameId: 1103,
          name: "Ensenada",
          adminName1: "BCN",
          adminName2: "Ensenada",
        },
        {
          geonameId: 1104,
          name: "Tecate",
          adminName1: "BCN",
          adminName2: "Tecate",
        },
        {
          geonameId: 1105,
          name: "Playas de Rosarito",
          adminName1: "BCN",
          adminName2: "Playas de Rosarito",
        },
      ],
      "Quintana Roo": [
        {
          geonameId: 1201,
          name: "Cancún",
          adminName1: "ROO",
          adminName2: "Benito Juárez",
        },
        {
          geonameId: 1202,
          name: "Chetumal",
          adminName1: "ROO",
          adminName2: "Othón P. Blanco",
        },
        {
          geonameId: 1203,
          name: "Playa del Carmen",
          adminName1: "ROO",
          adminName2: "Solidaridad",
        },
        {
          geonameId: 1204,
          name: "Cozumel",
          adminName1: "ROO",
          adminName2: "Cozumel",
        },
        {
          geonameId: 1205,
          name: "Tulum",
          adminName1: "ROO",
          adminName2: "Tulum",
        },
      ],
      Yucatán: [
        {
          geonameId: 1301,
          name: "Mérida",
          adminName1: "YUC",
          adminName2: "Mérida",
        },
        {
          geonameId: 1302,
          name: "Valladolid",
          adminName1: "YUC",
          adminName2: "Valladolid",
        },
        {
          geonameId: 1303,
          name: "Progreso",
          adminName1: "YUC",
          adminName2: "Progreso",
        },
        {
          geonameId: 1304,
          name: "Tekax",
          adminName1: "YUC",
          adminName2: "Tekax",
        },
        {
          geonameId: 1305,
          name: "Umán",
          adminName1: "YUC",
          adminName2: "Umán",
        },
      ],
      Guanajuato: [
        {
          geonameId: 1401,
          name: "León",
          adminName1: "GUA",
          adminName2: "León",
        },
        {
          geonameId: 1402,
          name: "Irapuato",
          adminName1: "GUA",
          adminName2: "Irapuato",
        },
        {
          geonameId: 1403,
          name: "Celaya",
          adminName1: "GUA",
          adminName2: "Celaya",
        },
        {
          geonameId: 1404,
          name: "Salamanca",
          adminName1: "GUA",
          adminName2: "Salamanca",
        },
        {
          geonameId: 1405,
          name: "San Miguel de Allende",
          adminName1: "GUA",
          adminName2: "San Miguel de Allende",
        },
      ],
      Chihuahua: [
        {
          geonameId: 1501,
          name: "Ciudad Juárez",
          adminName1: "CHH",
          adminName2: "Juárez",
        },
        {
          geonameId: 1502,
          name: "Chihuahua",
          adminName1: "CHH",
          adminName2: "Chihuahua",
        },
        {
          geonameId: 1503,
          name: "Cuauhtémoc",
          adminName1: "CHH",
          adminName2: "Cuauhtémoc",
        },
        {
          geonameId: 1504,
          name: "Delicias",
          adminName1: "CHH",
          adminName2: "Delicias",
        },
        {
          geonameId: 1505,
          name: "Hidalgo del Parral",
          adminName1: "CHH",
          adminName2: "Hidalgo del Parral",
        },
      ],
      Sonora: [
        {
          geonameId: 1601,
          name: "Hermosillo",
          adminName1: "SON",
          adminName2: "Hermosillo",
        },
        {
          geonameId: 1602,
          name: "Ciudad Obregón",
          adminName1: "SON",
          adminName2: "Cajeme",
        },
        {
          geonameId: 1603,
          name: "Nogales",
          adminName1: "SON",
          adminName2: "Nogales",
        },
        {
          geonameId: 1604,
          name: "San Luis Río Colorado",
          adminName1: "SON",
          adminName2: "San Luis Río Colorado",
        },
        {
          geonameId: 1605,
          name: "Puerto Peñasco",
          adminName1: "SON",
          adminName2: "Puerto Peñasco",
        },
      ],
    };
    return cityMap[stateName] || [];
  };

  // Fallback countries if API fails
  const getFallbackCountries = (): Country[] => [
    { name: "United States", cca2: "US", cca3: "USA", flag: "🇺🇸" },
    { name: "Canada", cca2: "CA", cca3: "CAN", flag: "🇨🇦" },
    { name: "United Kingdom", cca2: "GB", cca3: "GBR", flag: "🇬🇧" },
    { name: "Germany", cca2: "DE", cca3: "DEU", flag: "🇩🇪" },
    { name: "France", cca2: "FR", cca3: "FRA", flag: "🇫🇷" },
    { name: "Australia", cca2: "AU", cca3: "AUS", flag: "🇦🇺" },
    { name: "Japan", cca2: "JP", cca3: "JPN", flag: "🇯🇵" },
    { name: "India", cca2: "IN", cca3: "IND", flag: "🇮🇳" },
    { name: "Mexico", cca2: "MX", cca3: "MEX", flag: "🇲🇽" },
  ];

  const handleFieldChange = (
    field: keyof AddressFormData,
    fieldValue: string,
  ) => {
    const newValue = { ...value, [field]: fieldValue };
    onChange(newValue);
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateZipCode = (zipCode: string, country: string) => {
    if (!zipCode) return "";

    const patterns: Record<string, RegExp> = {
      "United States": /^\d{5}(-\d{4})?$/,
      Canada: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      "United Kingdom": /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
      Germany: /^\d{5}$/,
      France: /^\d{5}$/,
      Australia: /^\d{4}$/,
      Japan: /^\d{3}-\d{4}$/,
      India: /^\d{6}$/,
      Mexico: /^\d{5}$/,
    };

    const pattern = patterns[country];
    if (pattern && !pattern.test(zipCode)) {
      return `Invalid ${country} postal code format`;
    }

    return "";
  };

  const handleZipCodeChange = (zipCode: string) => {
    const error = validateZipCode(zipCode, value.country);
    setErrors((prev) => ({ ...prev, zip_code: error }));
    handleFieldChange("zip_code", zipCode);
  };

  const getZipCodePlaceholder = (country: string) => {
    const placeholders: Record<string, string> = {
      "United States": "12345 or 12345-6789",
      Canada: "A1A 1A1",
      "United Kingdom": "SW1A 1AA",
      Germany: "12345",
      France: "12345",
      Australia: "1234",
      Japan: "123-4567",
      India: "123456",
      Mexico: "12345",
    };
    return placeholders[country] || "Enter postal code";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-2" />
          Street Address
        </label>
        <Input
          type="text"
          value={value.street_address}
          onChange={(e) => handleFieldChange("street_address", e.target.value)}
          className="w-full"
          placeholder="123 Main Street"
        />
      </div>

      {/* Apartment/Suite */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Building className="inline w-4 h-4 mr-2" />
          Apartment/Suite
        </label>
        <Input
          type="text"
          value={value.apartment_suite}
          onChange={(e) => handleFieldChange("apartment_suite", e.target.value)}
          className="w-full"
          placeholder="Apt 4B"
        />
      </div>

      {/* Country Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="inline w-4 h-4 mr-2" />
          Country *
        </label>
        <div className="relative">
          <select
            value={value.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            disabled={loading.countries}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.cca2} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {loading["countries"] && (
          <p className="text-sm text-gray-500 mt-1">Loading countries...</p>
        )}
        {errors["countries"] && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors["countries"]}
          </p>
        )}
      </div>

      {/* State/Province Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State/Province *
        </label>
        <div className="relative">
          <select
            value={value.state_province}
            onChange={(e) =>
              handleFieldChange("state_province", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            disabled={!value.country || loading.states}
          >
            <option value="">Select a state/province</option>
            {states.map((state) => (
              <option key={state.geonameId} value={state.name}>
                {state.name} ({state.adminName1})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {loading["states"] && (
          <p className="text-sm text-gray-500 mt-1">Loading states...</p>
        )}
        {errors["states"] && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors["states"]}
          </p>
        )}
        {!value.country && (
          <p className="text-sm text-gray-400 mt-1">
            Please select a country first
          </p>
        )}
      </div>

      {/* City Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City/Town *
        </label>
        <div className="relative">
          <select
            value={value.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            disabled={!value.state_province || loading.cities}
          >
            <option value="">Select a city/town</option>
            {cities.map((city) => (
              <option key={city.geonameId} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {loading["cities"] && (
          <p className="text-sm text-gray-500 mt-1">Loading cities...</p>
        )}
        {errors["cities"] && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors["cities"]}
          </p>
        )}
        {!value.state_province && (
          <p className="text-sm text-gray-400 mt-1">
            Please select a state/province first
          </p>
        )}
      </div>

      {/* ZIP/Postal Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="inline w-4 h-4 mr-2" />
          ZIP/Postal Code *
        </label>
        <Input
          type="text"
          value={value.zip_code}
          onChange={(e) => handleZipCodeChange(e.target.value)}
          className={`w-full ${errors["zip_code"] ? "border-red-500" : ""}`}
          placeholder={getZipCodePlaceholder(value.country)}
        />
        {errors["zip_code"] && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors["zip_code"]}
          </p>
        )}
        {!value.city && (
          <p className="text-sm text-gray-400 mt-1">
            Please select a city first
          </p>
        )}
      </div>

      {/* Address Preview */}
      {value.street_address && value.city && value.country && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Address Preview:
          </h4>
          <p className="text-sm text-gray-600">
            {value.street_address}
            {value.apartment_suite && `, ${value.apartment_suite}`}
            <br />
            {value.city}, {value.state_province} {value.zip_code}
            <br />
            {value.country}
          </p>
        </div>
      )}

      {/* API Integration Note */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> This form uses the free{" "}
          <a
            href="https://restcountries.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            REST Countries API
          </a>{" "}
          for country data. For production use, consider integrating with{" "}
          <a
            href="https://www.geonames.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GeoNames
          </a>{" "}
          for comprehensive state/province and city data.
        </p>
      </div>
    </div>
  );
};

export default AddressForm;
