from rest_framework import serializers
from .models import Order,OrderItem

from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_detail=ProductSerializer(source='product',read_only=True)


    class Meta:
        model=OrderItem
        fields=['id','product','product_detail','quantity','price']



class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True,read_only=True)
    username=serializers.CharField(source='user.username',read_only=True)


    class Meta:
        model=Order
        fields=['id','user','username','total_amount','status','created_at','items','is_paid']
        read_only_fields=['user','total_amount','status']