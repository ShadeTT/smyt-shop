# coding=utf-8

from .settings import *

__author__ = 'shade'


try:
    from .overrides import *
except ImportError:
    pass
