from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_detail= ProductSerializer(source='product',read_only=True)
    
    class Meta:
        model=CartItem
        fields =['id','product','product_detail','quantity','added_at']