import graphene
from graphene_django.types import DjangoObjectType

from api.models import UserProfile


class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ("id", "user")


class TestMutation(graphene.Mutation):
    class Arguments:
        test = graphene.String()

    ok = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, test):
        result = cls()
        result.ok = True
        return result


class Mutation(graphene.ObjectType):
    test_mutation = TestMutation.Field()


class Query(graphene.ObjectType):
    test = graphene.String()

    def resolve_test(self, info):
        return "Test query working"


schema = graphene.Schema(query=Query, mutation=Mutation)
