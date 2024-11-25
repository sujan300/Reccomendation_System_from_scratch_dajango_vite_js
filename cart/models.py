from django.db import models
from store.models import Product
from account.models import AuthModel

# Create your models here.
class CartItem(models.Model):
    user = models.ForeignKey(AuthModel, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    is_active = models.BooleanField(default=True)

    def sub_total(self):
        return self.product.price * self.quantity

    def __unicode__(self):
        return self.product