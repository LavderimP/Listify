from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import List
from user.models import User
from .serializers import ListSerializer
from django.shortcuts import get_object_or_404

# ! To Be Removed
# from rest_framework.permissions import AllowAny


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
        reminder_param = request.query_params.get("reminder")

        if title_param:
            queryset = List.objects.filter(user=user_obj, title__icontains=title_param)
        elif category_param:
            queryset = List.objects.filter(user=user_obj, category=category_param)
        elif reminder_param is not None:
            queryset = List.objects.filter(user=user_obj, reminder__isnull=False)
        else:
            queryset = List.objects.filter(user=user_obj)

        queryset = queryset.order_by("created_at")

        serializer = ListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = ListSerializer(data=request.data)

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

        queryset = get_object_or_404(List, user=user_obj, list_id=pk)
        serializer = ListSerializer(queryset)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(List, user=user_obj, list_id=pk)

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

        queryset = get_object_or_404(List, user=user_obj, list_id=pk)

        # Only allow deletion if user is the owner
        if queryset.user != user_obj:
            return Response(
                {"detail": "You do not have permission to delete this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
