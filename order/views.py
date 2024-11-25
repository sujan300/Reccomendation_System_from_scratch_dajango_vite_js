from django.shortcuts import render
from cart.models import CartItem

from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


from .models import Order,OrderItem
from .serializer import OrderSerializer
from decimal import Decimal

# Create your views here.


class OrderPlaceView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request,format="None"):
        user = request.user
        full_name = request.data.get('fullName')
        address = request.data.get('address')
        state = request.data.get('state')
        city = request.data.get('city')
        phone = request.data.get('phonenumber')
        post_code = request.data.get('postCode')
        print("user ",user," full name ",full_name,"  address  ",address,"  state   ",state,"  city ",city,"  phone  ",phone,"   post code ",post_code)
        try:
            cart_items = CartItem.objects.filter(user=user,is_active=True)
            if not cart_items.exists():
                return Response({"message":"No Item In Cart"})
            total_amount = Decimal('0.00')
            for item in cart_items:
                try:
                    price = Decimal(item.product.price) if item.product.price else Decimal('0.00')
                except (TypeError, ValueError) as e:
                    print(f"Invalid price for product {item.product}: {item.product.price}. Error: {str(e)}")
                    price = Decimal('0.00')
                quantity = item.quantity if isinstance(item.quantity, int) and item.quantity > 0 else 0
                total_amount += price * quantity
                print("total price ", total_amount)
            order = Order.objects.create(
                user=user,
                full_name=full_name,
                address1=address,
                state=state,
                city=city,
                phone=phone,
                post_code=post_code,
                total_paid=total_amount,
            )
            
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    user=user,
                    product=item.product,
                    price=item.product.price,
                    quantity=item.quantity
                )
                print("Deleting item from cart:", item)
                item.delete()
            return Response({"message":"order has been save"},status=status.HTTP_201_CREATED)     
        except Exception as e:
            error_message = str(e)
            print("Error:", error_message)
            return Response({'message':'this is OrderPlace View',"error":error_message},status=status.HTTP_406_NOT_ACCEPTABLE)

class GetOrderDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            user = request.user
            order_list = Order.objects.filter(user=user)
            serializer = OrderSerializer(order_list, many=True)
            return Response({'message': 'Order list', 'orders': serializer.data})
        except Exception as e:
            print("Error fetching orders:", str(e))
            return Response({'message': 'No Order List'}, status=status.HTTP_400_BAD_REQUEST)



class GetOrderItemByOrderId(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,format=None):
        order_id = request.query_params.get('order_id')
        print("order is ====  ",order_id)
        if not order_id:
            return Response({"error": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(order_id=order_id,user=request.user)
            print("order item  is ",order)
            order_items = order.items.all()
            order_items_data = [
                {
                    "product_name": item.product.product_name,
                    "quantity": item.quantity,
                    "price": float(item.price),
                    "image_url": item.product.images.first().image.url if item.product.images.exists() else None,
                }
                for item in order_items
            ]

            return Response(
                {
                    "order_id": order.order_id,
                    "total_items": len(order_items_data),
                    "order_items": order_items_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print(" Error is e == ",e)
            return Response({"error": "Order not found or access denied"}, status=status.HTTP_404_NOT_FOUND)