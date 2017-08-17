# coding=utf-8
from django import forms
from django.contrib import admin
from django.forms.widgets import CheckboxInput

from app.models import Brand, Product, Category, Discount

__author__ = 'shade'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    prepopulated_fields = {"slug": ("name",)}

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    pass


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    pass


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    pass
