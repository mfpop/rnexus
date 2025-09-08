import graphene

from .mutations import Mutation
from .queries import Query

# Create the final schema
schema = graphene.Schema(query=Query, mutation=Mutation)
