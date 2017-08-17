# coding=utf-8

from django.conf.urls import url
import mptt_urls

from app import views

__author__ = 'shade'

urlpatterns = [
    url(r'^$', views.MainPageView.as_view(), name='mainpage'),
    url(r'^catalog/(?P<path>.*)$', views.CategoryView.as_view(), name='section'),
    url(r'^catalog/(?P<slug>.*)/$', views.ProductView.as_view(), name='product'),
]
