import stripe
from payments.models import PaymentMethods, Payments
from payments.serializers import PaymentSerializer, PaymentMethodsSerializer
from rest_framework import status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import  IsAuthenticated

class PaymentMethodsViewSet(viewsets.ViewSet):
    '''ViewSet for managing PaymentMethods related to a user.'''

    permission_classes = [IsAuthenticated]  # Requires authentication for all methods

    def list(self, request):
        '''
        List all PaymentMethods for the authenticated user.

        Retrieves all the payment methods associated with the authenticated user.
        Returns a response with a list of PaymentMethods serialized data.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID from the request object
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        queryset = PaymentMethods.objects.filter(user=req_user)  # Filters PaymentMethods by user ID
        serializer = PaymentMethodsSerializer(queryset, many=True)  # Serializes the data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Returns the serialized data

    def create(self, request):
        '''
        Create a new PaymentMethod for the authenticated user.

        Accepts payment method data from the request and creates a new PaymentMethod record.
        If successful, returns the serialized PaymentMethod data; otherwise, returns validation errors.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        serializer = PaymentMethodsSerializer(data=request.data)  # Serializes incoming data

        if serializer.is_valid():  # Validates the incoming data
            serializer.save(user=req_user)  # Saves the payment method with the user ID
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Successfully created
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Invalid data

    def retrieve(self, request, pk=None):
        '''
        Retrieve a specific PaymentMethod for the authenticated user.

        Fetches a specific PaymentMethod by its ID for the authenticated user.
        Returns the serialized PaymentMethod data if found, otherwise a 404 error.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        queryset = get_object_or_404(PaymentMethods, user=req_user, pk=pk)  # Finds PaymentMethod by user and pk
        if queryset.exists():
            serializer = PaymentMethodsSerializer(queryset)  # Serializes the PaymentMethod
            return Response(serializer.data, status=status.HTTP_200_OK)  # Returns the data
        return Response(status=status.HTTP_404_NOT_FOUND)  # If not found, return 404

    def update(self, request, pk=None):
        '''
        Update an existing PaymentMethod for the authenticated user.

        Updates the details of a specific PaymentMethod identified by the ID (pk).
        If the update is successful, returns the updated PaymentMethod data; otherwise, returns errors.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        queryset = get_object_or_404(PaymentMethods, user=req_user, pk=pk)  # Retrieves PaymentMethod by user and pk
        if queryset.exists():
            serializer = PaymentMethodsSerializer(queryset, data=request.data)  # Serializes data for update
            if serializer.is_valid():  # Validates the data
                serializer.save()  # Saves updated data
                return Response(serializer.data, status=status.HTTP_200_OK)  # Returns the updated data
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Validation errors
        return Response(status=status.HTTP_404_NOT_FOUND)  # If not found, return 404

    def destroy(self, request, pk=None):
        '''
        Delete a PaymentMethod for the authenticated user.

        Deletes a PaymentMethod identified by the ID (pk). Returns a success message (204 No Content) if successful,
        or a 404 error if the PaymentMethod does not exist.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        queryset = get_object_or_404(PaymentMethods, user=req_user, pk=pk)  # Retrieves PaymentMethod by user and pk
        if queryset.exists():
            queryset.delete()  # Deletes the PaymentMethod
            return Response(status=status.HTTP_204_NO_CONTENT)  # Returns 204 No Content if successful
        return Response(status=status.HTTP_404_NOT_FOUND)  # If not found, return 404

class PaymentsViewSet(viewsets.ViewSet):
    '''ViewSet for managing Payments related to a user.'''

    def list(self, request):
        '''
        List all Payments for the authenticated user.

        Retrieves all payments associated with the authenticated user.
        Returns a response with a list of Payment serialized data.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        queryset = Payments.objects.filter(user=req_user)  # Filters Payments by user ID
        serializer = PaymentSerializer(queryset, many=True)  # Serializes the data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Returns the serialized data

    def create(self, request):
        '''
        Create a new Payment for the authenticated user.

        Accepts payment data from the request and creates a new Payment record.
        If successful, returns the serialized Payment data; otherwise, returns validation errors.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        serializer = PaymentSerializer(data=request.data)  # Serializes incoming data

        if serializer.is_valid():  # Validates the incoming data
            serializer.save(user=req_user)  # Saves the payment with the user ID
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Successfully created
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Invalid data

    def retrieve(self, request, pk=None):
        '''
        Retrieve a specific Payment for the authenticated user.

        Fetches a specific Payment by its ID (pk) for the authenticated user.
        Returns the serialized Payment data if found, otherwise a 404 error.
        '''
        try:
            req_user = request.user.id  # Fetches the user ID
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)  # Unauthorized if user ID is not present

        queryset = get_object_or_404(Payments, user=req_user, pk=pk)  # Finds Payment by user and pk
        if queryset.exists():
            serializer = PaymentSerializer(queryset)  # Serializes the Payment
            return Response(serializer.data, status=status.HTTP_200_OK)  # Returns the data
        return Response(status=status.HTTP_404_NOT_FOUND)  # If not found, return 404
