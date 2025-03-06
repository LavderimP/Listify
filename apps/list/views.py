from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import List
from user.models import User
from .serializers import ListSerializer
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
import openpyxl
from io import BytesIO
import json

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

    def download(self, request, pk=None):
        try:
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = List.objects.filter(list_id=pk, user=user_obj)

        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Serialize each object individually in the queryset
        serializer = ListSerializer(queryset, many=True)

        file_format = request.query_params.get(
            "file_format", "json"
        )  # Default to JSON if not specified

        if file_format == "json":
            # Ensure JSON is downloaded as a file
            response = JsonResponse(serializer.data, safe=False)
            response["Content-Disposition"] = 'attachment; filename="list.json"'
            response["Content-Type"] = "application/json"  # Force JSON content type
            return response

        elif file_format == "excel":
            # Create an Excel file
            workbook = openpyxl.Workbook()
            sheet = workbook.active
            sheet.title = "List Data"

            # Add headers to the Excel sheet
            headers = [field for field in serializer.data[0].keys()]
            sheet.append(headers)

            # Add data rows to the Excel sheet
            for item in serializer.data:
                row = [item[field] for field in headers]
                sheet.append(row)

            # Write the Excel file to a BytesIO object
            response = HttpResponse(
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            response["Content-Disposition"] = 'attachment; filename="list.xlsx"'

            # Save workbook to the response stream
            excel_file = BytesIO()
            workbook.save(excel_file)
            excel_file.seek(0)
            response.write(excel_file.read())

            return response

        else:
            # Invalid file format requested
            return Response(status=status.HTTP_400_BAD_REQUEST)
