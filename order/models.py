from decimal import Decimal
from django.conf import settings
from django.db import models
from account.models import AuthModel
from store.models import Product
from datetime import datetime
import random


class Order(models.Model):
    STATUS = (
        ('New', 'New'),
        ('Accepted', 'Accepted'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='order_user')
    full_name = models.CharField(max_length=50)
    address1 = models.CharField(max_length=250)
    state = models.CharField(max_length=250)
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    post_code = models.CharField(max_length=20)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2)
    billing_status = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS, default='New')
    is_ordered = models.BooleanField(default=False)
    order_id = models.CharField(max_length=20, unique=True, editable=False,default=None)
    
    
    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = self.generate_order_id()
        super().save(*args, **kwargs)
        if self.status == 'Completed' and self.is_ordered:
            self.decrease_product_stock()
        if self.status =="Cancelled" and not self.is_ordered:
            self.increase_product_stock()
            
    def decrease_product_stock(self):
        for order_item in self.items.all():
            product = order_item.product
            product.stock -= order_item.quantity
            product.save()
            
    def increase_product_stock(self):
        for order in self.items.all():
            product =order.product
            product.stock +=order.quantity
            product.save() 

    def generate_order_id(self):
        date_part = datetime.now().strftime('%Y%m%d')
        random_part = str(random.randint(1000, 9999))
        return f"ORD-{date_part}-{random_part}"

    class Meta:
        ordering = ('-created',)
    
    def __str__(self):
        return f"Order #{self.id} by {self.full_name} - {self.total_paid}"


class OrderItem(models.Model):
    user = models.ForeignKey(AuthModel, related_name='user', on_delete=models.CASCADE, null=True, blank=True)
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"OrderItem #{self.id} - Product: {self.product.product_name} (Quantity: {self.quantity})"
