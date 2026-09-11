from django.db import models
from django.conf import settings
from products.models import Product
# Create your models here.

class CartItem(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_item')
    product=models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField(default=1)
    added_at=models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"{self.user.username} -{self.product.name} x {self.quantity}"