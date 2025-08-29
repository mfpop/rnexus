from django.core.management.base import BaseCommand

from api.models import City, Country, State, ZipCode


class Command(BaseCommand):
    help = "Populate database with location data for USA and Mexico"

    def handle(self, *args, **options):
        self.stdout.write("Starting location data population...")

        try:
            # Create countries
            usa, mexico = self.create_countries()

            # Create states
            self.create_usa_states(usa)
            self.create_mexico_states(mexico)

            # Create cities and zip codes
            self.create_usa_cities_and_zipcodes(usa)
            self.create_mexico_cities_and_zipcodes(mexico)

            self.stdout.write(
                self.style.SUCCESS(
                    "✅ Location data population completed successfully!"
                )
            )
            self.stdout.write(f"\nSummary:")
            self.stdout.write(f"- Countries: {Country.objects.count()}")
            self.stdout.write(f"- States: {State.objects.count()}")
            self.stdout.write(f"- Cities: {City.objects.count()}")
            self.stdout.write(f"- Zip Codes: {ZipCode.objects.count()}")

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error during population: {e}"))
            import traceback

            traceback.print_exc()

    def create_countries(self):
        """Create countries with phone prefix codes"""
        self.stdout.write("Creating countries...")

        countries_data = [
            {
                "code": "USA",
                "name": "United States",
                "flag_emoji": "🇺🇸",
                "phone_code": "+1",
            },
            {"code": "MEX", "name": "Mexico", "flag_emoji": "🇲🇽", "phone_code": "+52"},
            {"code": "CAN", "name": "Canada", "flag_emoji": "🇨🇦", "phone_code": "+1"},
            {
                "code": "GBR",
                "name": "United Kingdom",
                "flag_emoji": "🇬🇧",
                "phone_code": "+44",
            },
            {"code": "DEU", "name": "Germany", "flag_emoji": "🇩🇪", "phone_code": "+49"},
            {"code": "FRA", "name": "France", "flag_emoji": "🇫🇷", "phone_code": "+33"},
            {"code": "ITA", "name": "Italy", "flag_emoji": "🇮🇹", "phone_code": "+39"},
            {"code": "ESP", "name": "Spain", "flag_emoji": "🇪🇸", "phone_code": "+34"},
            {"code": "BRA", "name": "Brazil", "flag_emoji": "🇧🇷", "phone_code": "+55"},
            {
                "code": "ARG",
                "name": "Argentina",
                "flag_emoji": "🇦🇷",
                "phone_code": "+54",
            },
            {"code": "CHL", "name": "Chile", "flag_emoji": "🇨🇱", "phone_code": "+56"},
            {
                "code": "COL",
                "name": "Colombia",
                "flag_emoji": "🇨🇴",
                "phone_code": "+57",
            },
            {"code": "PER", "name": "Peru", "flag_emoji": "🇵🇪", "phone_code": "+51"},
            {
                "code": "VEN",
                "name": "Venezuela",
                "flag_emoji": "🇻🇪",
                "phone_code": "+58",
            },
            {
                "code": "URY",
                "name": "Uruguay",
                "flag_emoji": "🇺🇾",
                "phone_code": "+598",
            },
            {
                "code": "PRY",
                "name": "Paraguay",
                "flag_emoji": "🇵🇾",
                "phone_code": "+595",
            },
            {
                "code": "BOL",
                "name": "Bolivia",
                "flag_emoji": "🇧🇴",
                "phone_code": "+591",
            },
            {
                "code": "ECU",
                "name": "Ecuador",
                "flag_emoji": "🇪🇨",
                "phone_code": "+593",
            },
            {"code": "GUY", "name": "Guyana", "flag_emoji": "🇬🇾", "phone_code": "+592"},
            {
                "code": "SUR",
                "name": "Suriname",
                "flag_emoji": "🇸🇷",
                "phone_code": "+597",
            },
        ]

        created_countries = []
        for country_data in countries_data:
            country, created = Country.objects.get_or_create(
                code=country_data["code"], defaults=country_data
            )
            if created:
                self.stdout.write(f"Created country: {country}")
            else:
                self.stdout.write(f"Country already exists: {country}")
            created_countries.append(country)

        # Return USA and Mexico for the existing functions
        usa = Country.objects.get(code="USA")
        mexico = Country.objects.get(code="MEX")
        return usa, mexico

    def create_usa_states(self, usa):
        """Create major US states"""
        self.stdout.write("\nCreating US states...")

        us_states = [
            {"name": "California", "code": "CA"},
            {"name": "New York", "code": "NY"},
            {"name": "Texas", "code": "TX"},
            {"name": "Florida", "code": "FL"},
            {"name": "Illinois", "code": "IL"},
            {"name": "Pennsylvania", "code": "PA"},
            {"name": "Ohio", "code": "OH"},
            {"name": "Georgia", "code": "GA"},
            {"name": "North Carolina", "code": "NC"},
            {"name": "Michigan", "code": "MI"},
            {"name": "New Jersey", "code": "NJ"},
            {"name": "Virginia", "code": "VA"},
            {"name": "Washington", "code": "WA"},
            {"name": "Arizona", "code": "AZ"},
            {"name": "Massachusetts", "code": "MA"},
            {"name": "Tennessee", "code": "TN"},
            {"name": "Indiana", "code": "IN"},
            {"name": "Missouri", "code": "MO"},
            {"name": "Maryland", "code": "MD"},
            {"name": "Colorado", "code": "CO"},
        ]

        for state_data in us_states:
            state, created = State.objects.get_or_create(
                name=state_data["name"],
                country=usa,
                defaults={"code": state_data["code"]},
            )
            if created:
                self.stdout.write(f"Created state: {state}")
            else:
                self.stdout.write(f"State already exists: {state}")

    def create_mexico_states(self, mexico):
        """Create major Mexican states"""
        self.stdout.write("\nCreating Mexican states...")

        mex_states = [
            {"name": "Jalisco", "code": "JAL"},
            {"name": "Mexico City", "code": "CDMX"},
            {"name": "Nuevo Leon", "code": "NLE"},
            {"name": "Baja California", "code": "BCN"},
            {"name": "Veracruz", "code": "VER"},
            {"name": "Puebla", "code": "PUE"},
            {"name": "Guanajuato", "code": "GUA"},
            {"name": "Chihuahua", "code": "CHH"},
            {"name": "Sonora", "code": "SON"},
            {"name": "Tamaulipas", "code": "TAM"},
            {"name": "Coahuila", "code": "COA"},
            {"name": "Sinaloa", "code": "SIN"},
            {"name": "Michoacan", "code": "MIC"},
            {"name": "Chiapas", "code": "CHP"},
            {"name": "Durango", "code": "DUR"},
            {"name": "Zacatecas", "code": "ZAC"},
            {"name": "San Luis Potosi", "code": "SLP"},
            {"name": "Aguascalientes", "code": "AGS"},
            {"name": "Queretaro", "code": "QUE"},
            {"name": "Hidalgo", "code": "HGO"},
        ]

        for state_data in mex_states:
            state, created = State.objects.get_or_create(
                name=state_data["name"],
                country=mexico,
                defaults={"code": state_data["code"]},
            )
            if created:
                self.stdout.write(f"Created state: {state}")
            else:
                self.stdout.write(f"State already exists: {state}")

    def create_usa_cities_and_zipcodes(self, usa):
        """Create major US cities and zip codes"""
        self.stdout.write("\nCreating US cities and zip codes...")

        # California cities
        california = State.objects.get(name="California", country=usa)
        ca_cities = [
            {
                "name": "Los Angeles",
                "zip_codes": ["90210", "90211", "90212", "90001", "90002"],
            },
            {
                "name": "San Francisco",
                "zip_codes": ["94102", "94103", "94104", "94105", "94107"],
            },
            {
                "name": "San Diego",
                "zip_codes": ["92101", "92102", "92103", "92104", "92105"],
            },
            {
                "name": "Sacramento",
                "zip_codes": ["95814", "95815", "95816", "95817", "95818"],
            },
        ]

        for city_data in ca_cities:
            city, created = City.objects.get_or_create(
                name=city_data["name"], state=california, country=usa
            )
            if created:
                self.stdout.write(f"Created city: {city}")
            else:
                self.stdout.write(f"City already exists: {city}")

            # Create zip codes for this city
            for zip_code in city_data["zip_codes"]:
                zip_obj, created = ZipCode.objects.get_or_create(
                    code=zip_code, city=city, state=california, country=usa
                )
                if created:
                    self.stdout.write(f"  Created zip code: {zip_code}")

        # New York cities
        new_york = State.objects.get(name="New York", country=usa)
        ny_cities = [
            {
                "name": "New York City",
                "zip_codes": ["10001", "10002", "10003", "10004", "10005"],
            },
            {
                "name": "Buffalo",
                "zip_codes": ["14201", "14202", "14203", "14204", "14205"],
            },
            {
                "name": "Rochester",
                "zip_codes": ["14602", "14603", "14604", "14605", "14606"],
            },
        ]

        for city_data in ny_cities:
            city, created = City.objects.get_or_create(
                name=city_data["name"], state=new_york, country=usa
            )
            if created:
                self.stdout.write(f"Created city: {city}")
            else:
                self.stdout.write(f"City already exists: {city}")

            # Create zip codes for this city
            for zip_code in city_data["zip_codes"]:
                zip_obj, created = ZipCode.objects.get_or_create(
                    code=zip_code, city=city, state=new_york, country=usa
                )
                if created:
                    self.stdout.write(f"  Created zip code: {zip_code}")

        # Texas cities
        texas = State.objects.get(name="Texas", country=usa)
        tx_cities = [
            {
                "name": "Houston",
                "zip_codes": ["77001", "77002", "77003", "77004", "77005"],
            },
            {
                "name": "Dallas",
                "zip_codes": ["75201", "75202", "75203", "75204", "75205"],
            },
            {
                "name": "Austin",
                "zip_codes": ["73301", "73344", "78701", "78702", "78703"],
            },
        ]

        for city_data in tx_cities:
            city, created = City.objects.get_or_create(
                name=city_data["name"], state=texas, country=usa
            )
            if created:
                self.stdout.write(f"Created city: {city}")
            else:
                self.stdout.write(f"City already exists: {city}")

            # Create zip codes for this city
            for zip_code in city_data["zip_codes"]:
                zip_obj, created = ZipCode.objects.get_or_create(
                    code=zip_code, city=city, state=texas, country=usa
                )
                if created:
                    self.stdout.write(f"  Created zip code: {zip_code}")

    def create_mexico_cities_and_zipcodes(self, mexico):
        """Create major Mexican cities and zip codes"""
        self.stdout.write("\nCreating Mexican cities and zip codes...")

        # Jalisco cities
        jalisco = State.objects.get(name="Jalisco", country=mexico)
        jal_cities = [
            {
                "name": "Guadalajara",
                "zip_codes": ["44100", "44110", "44120", "44130", "44140"],
            },
            {
                "name": "Zapopan",
                "zip_codes": ["45010", "45020", "45030", "45040", "45050"],
            },
            {
                "name": "Tlaquepaque",
                "zip_codes": ["45500", "45510", "45520", "45530", "45540"],
            },
        ]

        for city_data in jal_cities:
            city, created = City.objects.get_or_create(
                name=city_data["name"], state=jalisco, country=mexico
            )
            if created:
                self.stdout.write(f"Created city: {city}")
            else:
                self.stdout.write(f"City already exists: {city}")

            # Create zip codes for this city
            for zip_code in city_data["zip_codes"]:
                zip_obj, created = ZipCode.objects.get_or_create(
                    code=zip_code, city=city, state=jalisco, country=mexico
                )
                if created:
                    self.stdout.write(f"  Created zip code: {zip_code}")

        # Mexico City
        cdmx = State.objects.get(name="Mexico City", country=mexico)
        cdmx_cities = [
            {
                "name": "Cuauhtemoc",
                "zip_codes": ["06000", "06010", "06020", "06030", "06040"],
            },
            {
                "name": "Miguel Hidalgo",
                "zip_codes": ["11000", "11010", "11020", "11030", "11040"],
            },
            {
                "name": "Coyoacan",
                "zip_codes": ["04000", "04010", "04020", "04030", "04040"],
            },
        ]

        for city_data in cdmx_cities:
            city, created = City.objects.get_or_create(
                name=city_data["name"], state=cdmx, country=mexico
            )
            if created:
                self.stdout.write(f"Created city: {city}")
            else:
                self.stdout.write(f"City already exists: {city}")

            # Create zip codes for this city
            for zip_code in city_data["zip_codes"]:
                zip_obj, created = ZipCode.objects.get_or_create(
                    code=zip_code, city=city, state=cdmx, country=mexico
                )
                if created:
                    self.stdout.write(f"  Created zip code: {zip_code}")
