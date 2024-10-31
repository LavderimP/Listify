from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Profiles
from .serializers import ProfilesSerializer

# ! To Be Removed
from rest_framework.permissions import AllowAny

# TODO: Create method for the user


# * Profiles Views
class ProfilesView(viewsets.ViewSet):

    # ! To Be Removed
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = Profiles.objects.all()
        serializer = ProfilesSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Profiles.objects.get(profile_id=pk)
        serializer = ProfilesSerializer(queryset)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        # * Get user from token
        user_id = request.user.id

        queryset = Profiles.objects.get(profile_id=pk)

        # * Check if the user and the profile user match
        if int(user_id) is not int(queryset.user.id):
            return Response(
                "Can not update someone elses profile.",
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ProfilesSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        # * Get user from token
        user_id = request.user.id

        queryset = Profiles.objects.get(profile_id=pk)

        # * Check if the user and the profile user match
        if int(user_id) is not int(queryset.user.id):
            return Response(
                "Can not delete someone elses profile.",
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
