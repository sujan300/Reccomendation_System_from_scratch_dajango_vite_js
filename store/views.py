from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .models import Product,ReviewRating,Category
from .serializer import ProductSerializer,ReviewSerializer,ProductCategorySerializer


from django.shortcuts import get_object_or_404
from order.models import OrderItem
# Create your views here.

from django.db.models import Q
from django.http import JsonResponse

def is_product_purchased_by_user(user, product):
    # Check if there's an OrderItem entry for the user and product
    return OrderItem.objects.filter(
        Q(user=user) & Q(product=product) & Q(order__is_ordered=True)
    ).exists()

class ProductsView(APIView):
    
    def get(self, request,format=None):
        try:
            category = request.query_params.get("category")  # Get category filter from query parameters
            if category:
                products = Product.objects.filter(category__category_name=category).order_by('-created_date')
                serializer = ProductSerializer(products, many=True)
                return Response({
                    'message': "Products ratings found!",
                    'metadata': {
                        'count': None,
                        'next': None,
                        'previous': None,
                    },
                    'results': serializer.data
                })
            else:
                products = Product.objects.all().order_by('-created_date')
                paginator = PageNumberPagination()
                paginator.page_size = 8  # Items per page
                result_page = paginator.paginate_queryset(products, request)
                serializer = ProductSerializer(result_page, many=True)
                print("the all products ",products)
                return Response({
                    'message': "Products ratings found!",
                    'metadata': {
                        'count': paginator.page.paginator.count,
                        'next': paginator.get_next_link(),
                        'previous': paginator.get_previous_link(),
                    },
                    'results': serializer.data
                })
            
            if not products.exists():
                return Response({"message": "No products found for the given category."}, status=404)
            # return Response(serializer.data)
            

            # # Paginate the queryset

            # # Return paginated response with a custom message
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        
        
class ProductDetailView(APIView):
    def get(self,request,id,format=None):
        try:
            product = Product.objects.get(id=id)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"error":"product not found !"})



class ReviewRatingView(APIView):
    permission_class=[IsAuthenticated]
    def post(self,request,product_id,format=None):
        rating= request.data.get('rating')
        review = request.data.get('review')
        print("rating ",rating," review ", review)
        try:
            product = get_object_or_404(Product,pk=product_id)
            user = request.user
            print("Product ",product)
            if is_product_purchased_by_user(user,product):
                if ReviewRating.objects.filter(product=product,user=user).exists():
                    review_object= get_object_or_404(ReviewRating, product=product, user=user)
                    print("Review Object ",review_object)
                    review_object.rating =rating
                    review_object.review=review
                    review_object.save()
                    return Response({"message":"Review is Updated !"})
                else:
                    ReviewRating.objects.create(
                        product=product,
                        user=user,
                        review=review,
                        rating=rating,
                    )
                    return Response({"message":"Review Is Successfully Submitted !"})                    
            else:
                return Response(
                    {"message": "Buy First !."}, 
                    status=status.HTTP_403_FORBIDDEN
                )

        except Exception as e:
            return Response({"message":"review not accepted !",'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class GetProductRating(APIView):
    def get(self,request,product_id,format=None):
        try:
            product = Product.objects.get(pk=product_id)
            reviews = ReviewRating.objects.filter(product=product)
            serializer=ReviewSerializer(reviews,many=True)
            return Response({'message':"products ratings found !",'reviews':serializer.data})
        except:
            return Response({"message":"Product Rating get Function()!"})
        
        
def search_orders_or_products(request):
    query = request.GET.get('q', '').strip()
    results = []

    if query:
        # Search for matching products
        product_matches = Product.objects.filter(Q(product_name__icontains=query) | Q(description__icontains=query)).values('id', 'product_name', 'price')
        results.extend([
            {"type": "Product","id":product['id'],"name": product['product_name'], "price": str(product['price'])}
            for product in product_matches
        ])
    return JsonResponse({'results': results})


class GetContentBasedReccomendation(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id, format=None):
        try:
            product = Product.objects.get(id=id)
            if request.user.is_authenticated:
                print("login ..............................")
                user = request.user
                similar_products = product.recommend_similar_products(user=user)
            else:
                similar_products = product.recommend_similar_products()
            serializer = ProductSerializer(similar_products, many=True)
            return Response({"message": "Success", "data": serializer.data})
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)


class GetAllCategory(APIView):
    def get(self,request,format=None):
        try:
            all_category = Category.objects.all()
            serializer=ProductCategorySerializer(all_category,many=True)
            return Response({'Success':"get all category !",'all_categories':serializer.data})
        except:
            return Response({'Error':"Not Found !"})