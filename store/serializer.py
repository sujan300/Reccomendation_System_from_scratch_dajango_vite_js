from rest_framework import serializers
from .models import Product, ProductImage,ReviewRating,Category,ProductSpecification

class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ['key', 'value'] 

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True, source='product_specifications')
    class Meta:
        model = Product
        fields = ["id",'product_name', 'slug', 'description', 'price', 'stock', 'is_available', 'category', 'created_date', 'modified_date', 'images','averageReview','countReview','specifications']
        
    
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_name']
    
# class ReviewRating(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     user = models.ForeignKey(AuthModel, on_delete=models.CASCADE)
#     review = models.TextField(max_length=500, blank=True)
#     rating = models.FloatField()
#     status = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user} and {self.product}"    
class ReviewSerializer(serializers.ModelSerializer):
    updated_at = serializers.DateTimeField(format="%Y-%m-%d")
    class Meta:
        model = ReviewRating
        fields = ['id','review','rating','created_at','get_user_name','updated_at']