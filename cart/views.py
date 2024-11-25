from django.shortcuts import render
from .models import CartItem
import jwt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


from account.models import AuthModel
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from account.JwtTokenDecode import decode_jwt
from store.models import Product
from .serializer import CartItemSerializer
# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class AddToCartView(APIView):  
    permission_classes = [IsAuthenticated]
    def post(self,request,format=None):      
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('qty'))
        try:
            product = get_object_or_404(Product, id=int(product_id))
            cart_item = get_object_or_404(CartItem,user=request.user, product=product, is_active=True)
            cart_item.quantity = quantity    
            cart_item.save()
            return Response({
                "message": "Quantity updated for existing item in cart.",
                "cart_item": {
                    "product": cart_item.product.id,
                    "quantity": cart_item.quantity,
                    "sub_total": cart_item.sub_total(),
                }
            }, status=status.HTTP_200_OK)     
        except:
            product = get_object_or_404(Product, id=product_id)
            print("product is ",product)
            new_cart_item = CartItem.objects.create(user=request.user, product=product, quantity=quantity)
            print("new Cart item is ",new_cart_item)
            return Response({
                "message": "Product added to cart.",
                "cart_item": {
                    "product": new_cart_item.product.id,
                    "quantity": new_cart_item.quantity,
                    "sub_total": new_cart_item.sub_total(),
                }
            }, status=status.HTTP_201_CREATED)
        
        
class GetCartProducts(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request,format=None):
        try:
            products= CartItem.objects.filter(user=request.user,is_active=True)
            serializer=CartItemSerializer(products,many=True)
            return Response(
                {"message":"Products Exists",
                 "products":serializer.data,
                 },
                status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response(
                {"message":"Cart is empty"},
                status=status.HTTP_404_NOT_FOUND
            )
            
@method_decorator(csrf_exempt, name='dispatch')            
class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request,product_id,format=None):
        try:
            product = Product.objects.get(id=product_id)
            cart_item = get_object_or_404(CartItem,user=request.user,product=product,is_active=True)
            print("cart Item is ",cart_item)
            cart_item.delete()
            return Response({"message":"item  is not delete !"})
        except ObjectDoesNotExist:
            return Response({"message":"item  is not delete !"})

            