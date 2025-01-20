from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import List, ListPictures
from user.models import User
from .serializers import ListSerializer
from django.shortcuts import get_object_or_404

# ! To Be Removed
# from rest_framework.permissions import AllowAny


# TODO: List Pictures


# * List Views
class ListViewSet(viewsets.ViewSet):

    # # ! To Be Removed
    # permission_classes = [AllowAny]

    def list(self, request):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO: Add the status
        category_param = request.query_params.get("category")
        title_param = request.query_params.get("title")

        if title_param:
            queryset = List.objects.filter(
                user=user_obj, title__icontains=title_param
            )
        elif category_param:
            queryset = List.objects.filter(
                user=user_obj, category=category_param
            )
        else:
            queryset = List.objects.filter(user=user_obj)

        queryset = queryset.order_by("created_at")

        # Use ListSerializer for list view to hide private content
        serializer = ListSerializer(queryset, many=True, context={"list": True})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = ListSerializer(data=request.data)

        # pictures = request.FILES.getlist(
        #     "pictures"
        # )  # Use FILES for file uploads and getlist for multiple files

        if serializer.is_valid():
            # Set the user before saving
            serializer.save(user=user_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, user=user_obj ,list_id=pk)
        serializer = ListSerializer(queryset)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def pin(self, request, pk=None):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, user=user_obj,list_id=pk)

        # Toggle the pined status
        queryset.pined = not queryset.pined
        queryset.save()

        return Response(status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, user=user_obj,list_id=pk)

        # Only allow update if user is the owner
        if queryset.user != user_obj:
            return Response(
                {"detail": "You do not have permission to update this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ListSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, user=user_obj,list_id=pk)

        # Only allow deletion if user is the owner
        if queryset.user != user_obj:
            return Response(
                {"detail": "You do not have permission to delete this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
