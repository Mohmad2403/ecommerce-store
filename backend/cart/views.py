from django.shortcuts import render
from rest_framework import viewsets,permissions
from .models import CartItem
from .serializers import CartItemSerializer
# Create your views here.

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class=CartItemSerializer
    permission_classes=[permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        
