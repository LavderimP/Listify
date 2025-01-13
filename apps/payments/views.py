import stripe
from payments.models import PaymentMethods, Payments
from payments.serializers import PaymentSerializer, PaymentMethodsSerializer
from rest_framework import status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class PaymentMethodsViewSet(viewsets.ViewSet):
    '''ViewSet for the PaymentMethods class'''

    def list(self, request):
        '''List all PaymentMethods'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = PaymentMethods.objects.filter(profile=user_profile)
        serializer = PaymentMethodsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        '''Create a new PaymentMethod'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = PaymentMethodsSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=user_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        '''Retrieve a PaymentMethod'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(PaymentMethods, profile=user_profile, pk=pk)
        if queryset.exists():
            serializer = PaymentMethodsSerializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        '''Update a PaymentMethod'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(PaymentMethods, profile=user_profile, pk=pk)
        if queryset.exists():
            serializer = PaymentMethodsSerializer(queryset, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        '''Delete a PaymentMethod'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(PaymentMethods, profile=user_profile, pk=pk)
        if queryset.exists():
            queryset.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

class PaymentsViewSet(viewsets.ViewSet):
    '''ViewSet for the Payments class'''

    def list(self, request):
        '''List all Payments'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = Payments.objects.filter(profile=user_profile)
        serializer = PaymentSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        '''Create a new Payment'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = PaymentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=user_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        '''Retrieve a Payment'''
        try:
            user_profile = request.user.id
        except:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        queryset = get_object_or_404(Payments, profile=user_profile, pk=pk)
        if queryset.exists():
            serializer = PaymentSerializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)




