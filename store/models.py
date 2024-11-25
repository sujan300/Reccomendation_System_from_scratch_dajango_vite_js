from django.db import models
from django.urls import reverse
from account.models import AuthModel
from django.db.models import Avg, Count
from django.db.models import Q, Subquery, OuterRef
from CheckPurchaseOrNot.check_purchase import get_available_products_for_user
from ContentBasedFiltering.algoritm import TfidfVectorAndCosine,preprocessed
from django.db.models import JSONField


from sklearn.preprocessing import MinMaxScaler
import numpy as np

class Category(models.Model):
    category_name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.category_name
    
    


class Product(models.Model):
    product_name    = models.CharField(max_length=200, unique=True)
    slug            = models.SlugField(max_length=200, unique=True)
    description     = models.TextField(max_length=10000, blank=True)
    price           = models.DecimalField(max_digits=10, decimal_places=2)
    stock           = models.IntegerField()
    is_available    = models.BooleanField(default=True)
    category        = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_date    = models.DateTimeField(auto_now_add=True)
    modified_date   = models.DateTimeField(auto_now=True)
    specifications = JSONField(blank=True, null=True)

    def get_url(self):
        return reverse('product_detail', args=[self.category.slug, self.slug])

    def __str__(self):
        return self.product_name
    
    
    def averageReview(self):
        reviews = ReviewRating.objects.filter(product=self, status=True).aggregate(average=Avg('rating'))
        avg = 0
        if reviews['average'] is not None:
            avg = float(reviews['average'])
        return avg

    def countReview(self):
        reviews = ReviewRating.objects.filter(product=self, status=True).aggregate(count=Count('id'))
        count = 0
        if reviews['count'] is not None:
            count = int(reviews['count'])
        return count
    
    def get_feature_vector(self):
        vector = {
            "description": self.description,
            "category": self.category.category_name
        }
        return vector
    
    def recommend_similar_products(self, top_n=4, user=None):
        if user:
            all_products = get_available_products_for_user(user, self.category).exclude(id=self.id)
            print("if user login ----------------------------------->>>>>>>>>>>>>>>> ", all_products)
        else:
            all_products = Product.objects.filter(category=self.category, is_available=True).exclude(id=self.id)
        
        if not all_products.exists():
            all_products = Product.objects.filter(is_available=True).exclude(id=self.id)
            
        if not all_products.exists():  # Return an empty list if no products are available
            return []

        # Step 1: Preprocess data for similarity computation
        def get_product_text(product):
            specs = " ".join([f"{spec.key}: {spec.value}" for spec in product.product_specifications.all()])
            return f"{product.product_name} {product.description} {specs} {product.category.category_name}"

        all_product_texts = [get_product_text(product) for product in all_products]
        current_product_text = get_product_text(self)

        # Step 2: Initialize the TF-IDF model
        tfidf_model = TfidfVectorAndCosine()
        tfidf_model.fit([current_product_text] + all_product_texts)

        # Compute TF-IDF vectors
        current_product_vector = tfidf_model.transform(current_product_text)
        other_product_vectors = [tfidf_model.transform(text) for text in all_product_texts]

        # Step 3: Normalize prices using Min-Max scaling
        prices = [product.price for product in all_products]
        scaler = MinMaxScaler()
        normalized_prices = scaler.fit_transform(np.array(prices).reshape(-1, 1)).flatten()

        current_product_price = self.price
        current_product_normalized_price = scaler.transform([[current_product_price]])[0][0]

        # Step 4: Calculate price similarity
        price_similarity = [
            1 - abs(current_product_normalized_price - price)
            for price in normalized_prices
        ]

        # Step 5: Compute content similarity (cosine similarity)
        content_similarity_scores = [
            tfidf_model.cosine_similarity(current_product_vector, vector)
            for vector in other_product_vectors
        ]

        # Step 6: Combine similarities
        combined_scores = [
            0.6 * content_sim + 0.4 * price_sim  # Adjust weights as needed
            for content_sim, price_sim in zip(content_similarity_scores, price_similarity)
        ]

        # Combine products with their similarity scores
        scored_products = list(zip(all_products, combined_scores))
        print("scored products ........................",scored_products)

        # Sort by combined score in descending order
        scored_products = sorted(scored_products, key=lambda x: x[1], reverse=True)

        # Return the top N similar products
        similar_products = [product for product, score in scored_products[:top_n]]
        print("similar_products", similar_products)
        
        return similar_products





class ProductSpecification(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="product_specifications"  # Use a unique related_name here
    )
    key = models.CharField(max_length=100)  # Specification name, e.g., "CPU", "Battery"
    value = models.CharField(max_length=255)  # Specification value, e.g., "Intel i7", "5000mAh"

    def __str__(self):
        return f"{self.key}: {self.value} for {self.product.product_name}"

    

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='photos/products')

    def __str__(self):
        return f"{self.product.product_name} Image"



    
    
    
class ReviewRating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(AuthModel, on_delete=models.CASCADE)
    review = models.TextField(max_length=500, blank=True)
    rating = models.FloatField(default=0.0)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} and {self.product}"
    def get_user_name(self):
        return self.user.name