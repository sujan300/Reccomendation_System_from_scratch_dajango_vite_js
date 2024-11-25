from rest_framework import serializers
from .models import CartItem
from store.models import Product,ProductImage


# class CartItem(models.Model):
#     user = models.ForeignKey(AuthModel, on_delete=models.CASCADE, null=True)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.IntegerField()
#     is_active = models.BooleanField(default=True)

#     def sub_total(self):
#         return self.product.price * self.quantity

#     def __unicode__(self):
#         return self.product




class ProductSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'product_name', 'price', 'first_image',"stock"]

    def get_first_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            return first_image.image.url
        return None 
    
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    sub_total = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'quantity', 'is_active', 'sub_total']

    def get_sub_total(self, obj):
        return obj.sub_total()