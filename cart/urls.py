from django.urls import path
from . import views

urlpatterns = [
    path('add-to-cart',views.AddToCartView.as_view(),name="add_to_cart"),
    path('get-product',views.GetCartProducts.as_view(),name="get_cart_item"),
    path('delete-cart-item/<int:product_id>/',views.RemoveCartItemView.as_view(),name="remove_item"),   
]