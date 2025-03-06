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

from rest_framework.permissions import IsAuthenticated


# * List Views
class ListViewSet(viewsets.ViewSet):
    '''ViewSet for managing Lists related to a user.'''

    # Setting the permission class to only allow authenticated users
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        List all the lists for the authenticated user, with optional filters.
        
        Filters available:
        - category: Filter by category of the list
        - title: Filter by title of the list (case-insensitive)
        - reminder: Filter by reminder set (non-null values)
        
        Returns a list of lists in JSON format.
        """
        try:
            # Fetch the authenticated user object based on the request's user ID
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Get filtering parameters from query string (category, title, reminder)
        category_param = request.query_params.get("category")
        title_param = request.query_params.get("title")
        reminder_param = request.query_params.get("reminder")

        # Apply filters based on the provided query parameters
        if title_param:
            queryset = List.objects.filter(user=user_obj, title__icontains=title_param)
        elif category_param:
            queryset = List.objects.filter(user=user_obj, category=category_param)
        elif reminder_param is not None:
            queryset = List.objects.filter(user=user_obj, reminder__isnull=False)
        else:
            queryset = List.objects.filter(user=user_obj)

        # Order lists by creation date
        queryset = queryset.order_by("created_at")

        # Serialize the queryset to return as JSON response
        serializer = ListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        """
        Create a new list for the authenticated user.
        
        Expects data to create the list in the request body.
        
        Returns the created list data if successful.
        """
        try:
            # Fetch the authenticated user object based on the request's user ID
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Deserialize the incoming data to create a new List object
        serializer = ListSerializer(data=request.data)

        if serializer.is_valid():
            # Set the user before saving the list
            serializer.save(user=user_obj)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If the serializer is not valid, return error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """
        Retrieve a specific list by its ID.
        
        Only lists belonging to the authenticated user are accessible.
        
        Returns the list data in JSON format.
        """
        try:
            # Fetch the authenticated user object based on the request's user ID
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the list by its ID and make sure it belongs to the user
        queryset = get_object_or_404(List, user=user_obj, list_id=pk)
        serializer = ListSerializer(queryset)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        """
        Update an existing list.
        
        Only the owner of the list can update it.
        
        Returns the updated list data in JSON format if successful.
        """
        try:
            # Fetch the authenticated user object based on the request's user ID
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the list by ID and ensure it belongs to the user
        queryset = get_object_or_404(List, user=user_obj, list_id=pk)

        # Only allow update if the user is the owner of the list
        if queryset.user != user_obj:
            return Response(
                {"detail": "You do not have permission to update this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Deserialize the incoming data to update the list
        serializer = ListSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # If the serializer is not valid, return error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Delete a specific list.
        
        Only the owner of the list can delete it.
        
        Returns a 204 No Content response if deletion is successful.
        """
        try:
            # Fetch the authenticated user object based on the request's user ID
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the list by ID and ensure it belongs to the user
        queryset = get_object_or_404(List, user=user_obj, list_id=pk)

        # Only allow deletion if the user is the owner of the list
        if queryset.user != user_obj:
            return Response(
                {"detail": "You do not have permission to delete this list."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Perform the deletion and return a No Content response
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def download(self, request, pk=None):
        """
        Download a list in either JSON or Excel format.
        
        Accepts a query parameter `file_format` to specify the format (default: "json").
        
        Returns the list data as a downloadable file in the requested format.
        """
        try:
            # Fetch the authenticated user object based on the request's user ID
            user_obj = get_object_or_404(User, id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the list by ID and ensure it belongs to the user
        queryset = List.objects.filter(list_id=pk, user=user_obj)

        # If the list does not exist, return a 404 response
        if not queryset.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Serialize the list data
        serializer = ListSerializer(queryset, many=True)

        # Get the file format query parameter (default is JSON)
        file_format = request.query_params.get("file_format", "json")

        if file_format == "json":
            # Return the list data as a JSON file
            response = JsonResponse(serializer.data, safe=False)
            response["Content-Disposition"] = 'attachment; filename="list.json"'
            response["Content-Type"] = "application/json"  # Force JSON content type
            return response

        elif file_format == "excel":
            # Create an Excel file using openpyxl
            workbook = openpyxl.Workbook()
            sheet = workbook.active
            sheet.title = "List Data"

            # Add headers to the Excel sheet
            headers = [field for field in serializer.data[0].keys()]
            sheet.append(headers)

            # Add rows to the Excel sheet
            for item in serializer.data:
                row = [item[field] for field in headers]
                sheet.append(row)

            # Prepare the response to return the Excel file
            response = HttpResponse(
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            response["Content-Disposition"] = 'attachment; filename="list.xlsx"'

            # Save the workbook to a BytesIO object and send it in the response
            excel_file = BytesIO()
            workbook.save(excel_file)
            excel_file.seek(0)
            response.write(excel_file.read())

            return response

        else:
            # Return a 400 error if an invalid file format is requested
            return Response(status=status.HTTP_400_BAD_REQUEST)
