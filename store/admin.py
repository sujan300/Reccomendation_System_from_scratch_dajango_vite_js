from django.contrib import admin
from .models import Product, ProductImage, Category, ReviewRating, ProductSpecification


# Custom Admin for Category
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'slug')
    list_filter = ['category_name',]
    prepopulated_fields = {'slug': ('category_name',)}


# Inline admin for ProductSpecification
class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1  # Number of empty rows displayed for adding new specifications
    fields = ('key', 'value')
    verbose_name = "Specification"
    verbose_name_plural = "Specifications"


# Inline admin for ProductImage
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1  # Number of empty rows displayed for adding new images
    fields = ('image',)  # You can also add other fields like 'is_primary' if needed
    verbose_name = "Product Image"
    verbose_name_plural = "Product Images"


# Custom Admin for Product
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", 'product_name', 'price', 'stock', 'category', 'modified_date', 'is_available')
    list_filter = ['is_available', 'category']
    search_fields = ['product_name', 'category']
    prepopulated_fields = {'slug': ('product_name',)}
    inlines = [ProductSpecificationInline, ProductImageInline]  # Add specifications and images inline


# Custom Admin for ProductImage
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image')
    list_filter = ('product',)


# Custom Admin for ProductSpecification
class ProductSpecificationAdmin(admin.ModelAdmin):
    list_display = ('product', 'key', 'value')
    list_filter = ('product',)
    search_fields = ('product__product_name', 'key', 'value')


# Register your models
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
# admin.site.register(ProductImage, ProductImageAdmin)
# admin.site.register(ReviewRating)
# admin.site.register(ProductSpecification, ProductSpecificationAdmin)
