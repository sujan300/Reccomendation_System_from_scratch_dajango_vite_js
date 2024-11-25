from django.urls import path
from . import views

urlpatterns = [ 
    path('order-place',views.OrderPlaceView.as_view(),name='order-place'),
    path('order-history',views.GetOrderDetail.as_view(),name='order-history'),
    path('search-order-item',views.GetOrderItemByOrderId.as_view(),name="seach_order_id"),
]