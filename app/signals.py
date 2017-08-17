# coding=utf-8
from django.db.models.query_utils import Q
from django.db.models.signals import post_save, post_delete
from django.dispatch.dispatcher import receiver

from app.models import Discount, Product
from django.db import connection

__author__ = 'shade'


@receiver(post_save, sender=Discount, dispatch_uid="update_discounts")
def discount_create(sender, instance, **kwargs):

    update_discounts.apply_async((instance,))


@receiver(post_delete, sender=Discount, dispatch_uid="update_discounts")
def discount_delete(sender, instance, **kwargs):

    update_discounts.apply_async()


@receiver(post_save, sender=Product, dispatch_uid="update_discounts")
def product_create(sender, instance, **kwargs):

    update_discounts.apply_async((instance,))


@app.task
def update_discounts(discount=None):
    """
    Обновляет скидки для товаров. Проходим циклом по скидкам, выбираем товары,
    участвующие в скидке, и если цена со скидкой(цена без скидки, если нет цены
    со скидкой) больше чем новая цена для скидки, то добавляем в массив для
    обновления.
    Обновление происходит пакетно для всех товаров данной скидки
    :param discount: обновить товары для одной скидки
    :return:
    """

    # Так же команду стоит запускать раз в день, к примеру для пересчета цен
    # товаров по уже неактивным скидкам. Через celery или по крону

    # на реальном проекте с большим кол-вом товаров, возможно, нужна будет
    # какая-либо оптимизация. Для небольшого кол-ва товаров профайлинг делать
    # проблематично

    discounts = discount and [discount]

    if not discount:
        discounts = Discount.objects.all()

    for d in discounts:

        update_data = []
        # для упрощения будем считать что у нас не более 3 уровней вложенности
        # каталога. Для более многоуровленой стурктуры я бы написал рекурсивную
        # процедуру в бд
        products = (Product.objects
                    .filter(Q(category=d.content_object)|
                            Q(category__parent=d.content_object)|
                            Q(category__parent__parent=d.content_object))
                    .values('id', 'price', 'discount_price'))

        for p in products:

            if d.discount_price:

                new_price = p['price'] - d.discount_price
                if new_price < (p['discount_price'] or p['price']):

                    update_data.append((p['id'], p['discount_price']))

            elif d.discount_percent:
                pass

        cursor = connection.cursor()

        query = """
            UPDATE app_product
            SET discount_price = subquery.column2
            FROM (VALUES %s) as subquery
            WHERE id = subquery.column1;
        """ % ','.join(["(%s, '%s')" % (str(k), v) for k, v in update_data])
        cursor.execute(query)
