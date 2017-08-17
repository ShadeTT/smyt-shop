# coding=utf-8

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.urls.base import reverse
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

__author__ = 'shade'


class CommonModel(models.Model):
    class Meta:
        abstract = True

    created = models.DateTimeField('Дата добавления', auto_now_add=True)
    ts = models.DateTimeField('Дата изменения', auto_now=True)


class Category(CommonModel, MPTTModel):

    class Meta:
        app_label = 'app'

    name = models.CharField('Группа товара', max_length=64)
    slug = models.SlugField('Slug', max_length=200, null=True, db_index=True)

    parent = TreeForeignKey('self', null=True, blank=True, db_index=True)
    # True если категория должна отображаться в каталоге.
    # Используется что бы спрятать категории предназначения товаров (техника, одежда)
    # Для удобства, можно перегрузит менеджер, что бы добавить прозрачности в работу программиста
    hidden = models.BooleanField('Уровень каталога', default=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('app:section', kwargs={'path': '%s/%s' % (self.parent.slug, self.slug)})


class Brand(CommonModel):

    name = models.CharField('Наименование бренда', max_length=64)

    def __str__(self):
        return self.name


class Product(CommonModel):

    category = models.ForeignKey(Category, verbose_name='Группа')
    brand = models.ForeignKey(Brand, verbose_name='Бренд')
    name = models.CharField('Название товара', max_length=128)
    price = models.DecimalField('Стоимость, руб.', max_digits=10, decimal_places=2)
    discount_price = models.DecimalField('Стоимость со скидкой, руб.', max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.name


class Discount(CommonModel):

    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    ts_start = models.DateField('Начало действия скидки', null=True, blank=True)
    ts_end = models.DateField('Начало действия скидки', null=True, blank=True)

    discount_price = models.DecimalField('Скидка в рублях', max_digits=10, decimal_places=2, null=True, blank=True)
    discount_percent = models.PositiveSmallIntegerField('Скидка в %', null=True, blank=True)

    email = models.EmailField('Скидка для пользователя', null=True, blank=True)
    short_desc = models.CharField('Название/описание', max_length=500)

    code = models.CharField('Скидочный код', null=True, blank=True, max_length=50)

    def __str__(self):
        return self.code or ''
