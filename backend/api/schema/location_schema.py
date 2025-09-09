"""
GraphQL schema for location-related queries and types.
Provides access to countries, states/provinces, and cities.
"""

from django.db.models import Q

import graphene
from graphene_django import DjangoObjectType

from ..models import City, Country, State, ZipCode


class CountryType(DjangoObjectType):
    """GraphQL type for Country model"""

    class Meta:
        model = Country
        fields = (
            "id",
            "name",
            "code",
            "flag_emoji",
            "phone_code",
            "is_active",
            "created_at",
            "updated_at",
        )

    def resolve_id(self, info):
        return str(getattr(self, "id", None))


class StateType(DjangoObjectType):
    """GraphQL type for State model"""

    class Meta:
        model = State
        fields = (
            "id",
            "name",
            "code",
            "country",
            "is_active",
            "created_at",
            "updated_at",
        )

    def resolve_id(self, info):
        return str(getattr(self, "id", None))


class CityType(DjangoObjectType):
    """GraphQL type for City model"""

    class Meta:
        model = City
        fields = (
            "id",
            "name",
            "state",
            "country",
            "is_active",
            "created_at",
            "updated_at",
        )

    def resolve_id(self, info):
        return str(getattr(self, "id", None))


class ZipCodeType(DjangoObjectType):
    """GraphQL type for ZipCode model"""

    class Meta:
        model = ZipCode
        fields = (
            "id",
            "code",
            "city",
            "state",
            "country",
            "latitude",
            "longitude",
            "is_active",
            "created_at",
            "updated_at",
        )

    def resolve_id(self, info):
        return str(getattr(self, "id", None))


class LocationQuery(graphene.ObjectType):
    """GraphQL queries for location data"""

    # Countries
    all_countries = graphene.List(CountryType)
    country_by_id = graphene.Field(CountryType, id=graphene.ID(required=True))
    country_by_code = graphene.Field(CountryType, code=graphene.String(required=True))

    # States
    all_states = graphene.List(
        StateType,
        country_code=graphene.String(description="Filter states by country code"),
    )
    state_by_id = graphene.Field(StateType, id=graphene.ID(required=True))
    states_by_country = graphene.List(
        StateType,
        country_id=graphene.ID(),
        country_code=graphene.String(),
        description="Get states by country ID or code",
    )

    # Cities
    all_cities = graphene.List(
        CityType,
        state_id=graphene.ID(description="Filter cities by state ID"),
        country_code=graphene.String(description="Filter cities by country code"),
    )
    city_by_id = graphene.Field(CityType, id=graphene.ID(required=True))
    cities_by_state = graphene.List(
        CityType,
        state_id=graphene.ID(required=True),
        description="Get cities by state ID",
    )

    # ZIP Codes
    zip_codes = graphene.List(
        ZipCodeType,
        city_id=graphene.ID(description="Filter ZIP codes by city ID"),
        code=graphene.String(description="Search by ZIP code"),
    )

    def resolve_all_countries(self, info, **kwargs):
        """Get all active countries"""
        return Country.objects.filter(is_active=True).order_by("name")

    def resolve_country_by_id(self, info, id, **kwargs):
        """Get country by ID"""
        try:
            return Country.objects.get(id=id, is_active=True)
        except Country.DoesNotExist:
            return None

    def resolve_country_by_code(self, info, code, **kwargs):
        """Get country by code"""
        try:
            return Country.objects.get(code=code.upper(), is_active=True)
        except Country.DoesNotExist:
            return None

    def resolve_all_states(self, info, country_code=None, **kwargs):
        """Get all active states, optionally filtered by country"""
        queryset = State.objects.filter(is_active=True)

        if country_code:
            queryset = queryset.filter(country__code=country_code.upper())

        return queryset.select_related("country").order_by("name")

    def resolve_state_by_id(self, info, id, **kwargs):
        """Get state by ID"""
        try:
            return State.objects.select_related("country").get(id=id, is_active=True)
        except State.DoesNotExist:
            return None

    def resolve_states_by_country(
        self, info, country_id=None, country_code=None, **kwargs
    ):
        """Get states by country ID or code"""
        queryset = State.objects.filter(is_active=True)

        if country_id:
            queryset = queryset.filter(country_id=country_id)
        elif country_code:
            queryset = queryset.filter(country__code=country_code.upper())

        return queryset.select_related("country").order_by("name")

    def resolve_all_cities(self, info, state_id=None, country_code=None, **kwargs):
        """Get all active cities, optionally filtered by state or country"""
        queryset = City.objects.filter(is_active=True)

        if state_id:
            queryset = queryset.filter(state_id=state_id)
        elif country_code:
            queryset = queryset.filter(country__code=country_code.upper())

        return queryset.select_related("state", "country").order_by("name")

    def resolve_city_by_id(self, info, id, **kwargs):
        """Get city by ID"""
        try:
            return City.objects.select_related("state", "country").get(
                id=id, is_active=True
            )
        except City.DoesNotExist:
            return None

    def resolve_cities_by_state(self, info, state_id, **kwargs):
        """Get cities by state ID"""
        return (
            City.objects.filter(state_id=state_id, is_active=True)
            .select_related("state", "country")
            .order_by("name")
        )

    def resolve_zip_codes(self, info, city_id=None, code=None, **kwargs):
        """Get ZIP codes, optionally filtered by city or code"""
        queryset = ZipCode.objects.filter(is_active=True)

        if city_id:
            queryset = queryset.filter(city_id=city_id)

        if code:
            queryset = queryset.filter(code__icontains=code)

        return queryset.select_related("city", "state", "country").order_by("code")
