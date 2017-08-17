# coding=utf-8
from django.db.models.query_utils import Q
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from app.models import Product, Category

__author__ = 'shade'


class MainPageView(TemplateView):
    """
    Главная страница
    """

    template_name = "index.html"

    def get_context_data(self, **kwargs):

        context = super(MainPageView, self).get_context_data(**kwargs)

        context['category_list'] = Category.objects.all()

        return context


class ProductView(DetailView):
    """
    Страница продукта
    """

    model = Product

    def get_context_data(self, **kwargs):
        context = super(ProductView, self).get_context_data(**kwargs)

        return context


class CategoryView(ListView):
    """
    Страница категории
    """

    template_name = 'section.html'
    model = Product

    def get_queryset(self):

        path = list(filter(None, self.kwargs['path'].split('/')))

        return Product.objects.filter(category__slug=path[1], category__parent__slug=path[0])

    def get_context_data(self, **kwargs):

        context = super(CategoryView, self).get_context_data(**kwargs)
        context['category_list'] = Category.objects.all()

        return context
