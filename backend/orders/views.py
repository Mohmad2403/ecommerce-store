from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import render
from rest_framework import viewsets,permissions,status
import razorpay
from rest_framework.decorators import action
from django.db import transaction
from rest_framework.response import Response
from .models import Order,OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem
from django.db.models import Sum,Count

# Create your views here.
client= razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))


def send_order_confirmation_email(order):
    items_text="\n".join(
        [f"-{item.product.name}x{item.quantity}=Rs.{item.price*item.quantity}" for item in order.items.all()]
    )
    message=f"""Hii {order.user.username},
    
    Thank you for your order! Here are the details:
    
    Order #{order.id}
    {items_text}
    
    Total : Rs. {order.total_amount}
    Status: {order.status}
    
    We'll notify you once your order ships.
    
    Thank you for shopping with myShop 
    """
    send_mail(
        subject=f"Order Confirmation - Order #{order.id}",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],
        fail_silently=False

    )
def send_order_cancellation_email(order):
    items_text = "\n".join(
        [f"- {item.product.name} x {item.quantity}" for item in order.items.all()]
    )
    message = f"""Hi {order.user.username},

Your order has been cancelled as requested.

Order #{order.id}
{items_text}

Total: Rs. {order.total_amount}

If you did not request this cancellation, or if this was a mistake, please contact our support team.

Thanks for shopping with MyShop!
"""
    send_mail(
        subject=f'Order Cancelled - Order #{order.id}',
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],
        fail_silently=False,
    )

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class=OrderSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin_user:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


    @action(detail=False,methods=['post'])
    def place_order(self,request):
        cart_items=CartItem.objects.filter(user=request.user)


        if not cart_items.exists():
            return Response({'error':'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            total=sum(item.product.price *item.quantity for item in cart_items)

            order =Order.objects.create(user=request.user,total_amount=total)


            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
            cart_items.delete()

        serializer=OrderSerializer(order)
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    @action(detail=True,methods=['post'])
    def create_payment(self,request,pk=None):
        order = self.get_object()

        razorpay_order=client.order.create({
            'amount':int(order.total_amount*100),
            'currency':'INR',
            'payment_capture':1
        })

        order.razorpay_order_id=razorpay_order['id']
        order.save()

        return Response({
            'razorpay_order_id':razorpay_order['id'],
            'amount':razorpay_order['amount'],
            'currency':razorpay_order['currency'],
            'key_id':settings.RAZORPAY_KEY_ID,
        })

    @action(detail=True, methods=['post'])
    def verify_payment(self, request, pk=None):
        order = self.get_object()

        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

        order.razorpay_payment_id = razorpay_payment_id
        order.is_paid = True
        order.status = 'processing'
        order.save()



        send_order_confirmation_email(order)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        if not request.user.is_admin_user:
            return Response({'error': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

        order = self.get_object()
        new_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        if not request.user.is_admin_user:
            return Response({'error': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

        total_revenue = Order.objects.filter(is_paid=True).aggregate(total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.count()
        paid_orders = Order.objects.filter(is_paid=True).count()

        status_counts = list(
            Order.objects.values('status').annotate(count=Count('id'))
        )

        top_products = list(
            OrderItem.objects.values('product__name')
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:5]
        )

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'paid_orders': paid_orders,
            'status_counts': status_counts,
            'top_products': top_products,
        })

    @action(detail=True,methods=['post'])
    def cancel_order(self,request,pk=None):
        order=self.get_object()

        if order.user !=request.user:
            return Response({'error':'Not authorized.'},status=status.HTTP_403_FORBIDDEN)

        if order.status in ['delivered','cancelled']:
            return Response({'error':f'Cannot cancel an order that is already {order.status}.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if order.is_paid:
            return Response({'error':'This order is already been paid .Please contact support for cancellation and refund .'},status=status.HTTP_400_BAD_REQUEST)
        order.status ='cancelled'
        order.save()

        send_order_cancellation_email(order)


        serializer=OrderSerializer(order)
        return Response(serializer.data)

