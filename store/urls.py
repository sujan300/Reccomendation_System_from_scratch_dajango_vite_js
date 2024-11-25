from django.urls import path
from . import views

urlpatterns = [
    path('products', views.ProductsView.as_view(), name='products'),
    path('product-detail/<int:id>/',views.ProductDetailView.as_view(),name="product-detail"),
    path('product-rating/<int:product_id>/',views.ReviewRatingView.as_view(),name="product-rating"),
    path('product-get-rating/<int:product_id>/',views.GetProductRating.as_view(),name='get-rating'),
    path('search/', views.search_orders_or_products, name='search_orders_or_products'),
    path('get-simillar-products/<int:id>/',views.GetContentBasedReccomendation.as_view(),name="get-similar-products"),
    path('get-category',views.GetAllCategory.as_view(),name="get-category"),
]