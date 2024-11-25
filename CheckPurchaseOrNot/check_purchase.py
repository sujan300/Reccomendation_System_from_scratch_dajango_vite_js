from django.db.models import Q, Subquery, OuterRef
def get_available_products_for_user(user, category):
    from order.models import OrderItem 
    from store.models import Product 
    purchased_products = OrderItem.objects.filter(
        Q(user=user) & Q(order__is_ordered=True)
    ).values('product_id')
    available_products = Product.objects.filter(
        Q(category=category) & Q(is_available=True)
    ).exclude(id__in=Subquery(purchased_products))
    return available_products
